import * as cdk from '@aws-cdk/core'
import * as codepipeline from '@aws-cdk/aws-codepipeline'
import * as pipelineActions from '@aws-cdk/aws-codepipeline-actions'
import * as codebuild from '@aws-cdk/aws-codebuild'
import * as iam from '@aws-cdk/aws-iam'
// import * as appDelivery from '@aws-cdk/app-delivery'
import * as appDelivery from './PipelineDeployStackAction'
import * as ssm from '@aws-cdk/aws-ssm'
import { Bucket, IBucket, BlockPublicAccess } from '@aws-cdk/aws-s3'
// import { HostingStack } from './hosting-stack'
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment'
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity
} from '@aws-cdk/aws-cloudfront'
import { WebStack } from './web-stack'

const hostingBucket = (scope: cdk.Construct): IBucket => {
  const bucketArn = ssm.StringParameter.valueForStringParameter(scope, '/mathieugilbert/web/production/hosting-bucket-arn')

  // const bucketArn = ssm.StringParameter.fromStringParameterAttributes(scope, 'BucketArn', {
  //   parameterName: '/mathieugilbert/web/production/hosting-bucket-arn'
  // }).stringValue;

  const bucket = Bucket.fromBucketAttributes(scope, 'Bucket', { bucketArn })

  return bucket
}

const setupSourceStep = (scope: cdk.Construct, pipeline: codepipeline.Pipeline): codepipeline.Artifact => {
  const oauthToken = cdk.SecretValue.secretsManager('/mathieugilbertcom/github-oauth-token', {
    jsonField: 'oauthToken'
  })

  const sourceOutput = new codepipeline.Artifact()
  const sourceAction = new pipelineActions.GitHubSourceAction({
    actionName: 'SourceFromGitHub',
    oauthToken,
    output: sourceOutput,
    owner: 'MathieuGilbert',
    repo: 'mathieugilbertcom',
    trigger: pipelineActions.GitHubTrigger.WEBHOOK
  })

  pipeline.addStage({
    stageName: 'Source',
    actions: [sourceAction]
  })

  // connect existing webhook to pipeline
  new codepipeline.CfnWebhook(scope, 'Webhook', {
    authentication: 'GITHUB_HMAC',
    authenticationConfiguration: {
      secretToken: oauthToken.toString()
    },
    filters: [
      {
        jsonPath: '$.ref',
        matchEquals: 'refs/heads/{Branch}'
      }
    ],
    targetAction: sourceAction.actionProperties.actionName,
    targetPipeline: pipeline.pipelineName,
    targetPipelineVersion: 1
  })

  return sourceOutput
}

const setupBuildStep = (scope: cdk.Construct, pipeline: codepipeline.Pipeline, sourceOutput: codepipeline.Artifact): codepipeline.Artifact => {
  const buildBuildSpec = codebuild.BuildSpec.fromObject({
    version: '0.2',
    phases: {
      install: {
        'runtime-versions': {
          nodejs: 12
        },
        commands: [
          'yarn --cwd web global add aws-cdk',
          'yarn --cwd web install'
        ]
      },
      build: {
        commands: [
          'yarn --cwd web build',
          'yarn --cwd web/hosting synth'
        ]
      }
    },
    artifacts: {
      baseDirectory: 'dist',
      files: '**/*'
    }
  })

  const codeBuildProject = new codebuild.PipelineProject(scope, 'BuildPipelineProject', {
    buildSpec: buildBuildSpec,
    environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2
      }
    }
  )

  const buildOutput = new codepipeline.Artifact()
  const buildAction = new pipelineActions.CodeBuildAction({
    actionName: "BuildAction",
    project: codeBuildProject,
    input: sourceOutput,
    outputs: [buildOutput]
  })

  pipeline.addStage({
    stageName: 'Build',
    actions: [buildAction]
  })

  return buildOutput
}

const setupSelfUpdateStep = (stack: cdk.Stack, pipeline: codepipeline.Pipeline, buildOutput: codepipeline.Artifact) => {
  const selfUpdateAction = new appDelivery.PipelineDeployStackAction({
    stack,
    input: buildOutput,
    adminPermissions: true
  })

  pipeline.addStage({
    stageName: 'SelfUpdate',
    actions: [selfUpdateAction]
  })
}

const setupDeployStep = (scope: cdk.Construct, pipeline: codepipeline.Pipeline, buildOutput: codepipeline.Artifact) => {
  const webStack = new WebStack(scope, 'mg-web-production')

  const deployAction = new appDelivery.PipelineDeployStackAction({
    stack: webStack,
    input: buildOutput,
    adminPermissions: false
  })

  pipeline.addStage({
    stageName: 'Deploy',
    actions: [deployAction]
  })
}

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      restartExecutionOnUpdate: true
    })

    const sourceOutput = setupSourceStep(this, pipeline)

    const buildOutput = setupBuildStep(this, pipeline, sourceOutput)

    // setupSelfUpdateStep(this, pipeline, buildOutput)

    setupDeployStep(this, pipeline, buildOutput)
  }
}


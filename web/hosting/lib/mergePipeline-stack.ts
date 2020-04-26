import * as cdk from '@aws-cdk/core'
import * as codepipeline from '@aws-cdk/aws-codepipeline'
import * as pipelineActions from '@aws-cdk/aws-codepipeline-actions'
import * as codebuild from '@aws-cdk/aws-codebuild'
import * as iam from '@aws-cdk/aws-iam'
import * as appDelivery from '@aws-cdk/app-delivery'
import * as ssm from '@aws-cdk/aws-ssm'
import { Bucket, IBucket, BlockPublicAccess } from '@aws-cdk/aws-s3'
// import { HostingStack } from './hosting-stack'
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment'
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity
} from '@aws-cdk/aws-cloudfront'

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

  pipeline.addStage({
    stageName: 'Source',
    actions: [sourceAction]
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
          'yarn --cwd web install'
        ]
      },
      build: {
        commands: [
          'yarn --cwd web build'
        ]
      }
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

const setupDeployStep = (scope: cdk.Construct, pipeline: codepipeline.Pipeline, buildOutput: codepipeline.Artifact): codepipeline.Artifact => {
  const deployOutput = new codepipeline.Artifact()

  const siteBucket = new Bucket(scope, 'SiteBucket', {
    websiteIndexDocument: 'index.html',
    websiteErrorDocument: 'error.html',
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    removalPolicy: cdk.RemovalPolicy.RETAIN
  })
  new cdk.CfnOutput(scope, 'Bucket', { value: siteBucket.bucketName })

  new BucketDeployment(scope, 'DeployWithInvalidation', {
    sources: [buildOutput],
    destinationBucket: siteBucket
  })

  const originAccessIdentity = new OriginAccessIdentity(scope, 'OriginAccessIdentity')

    const distribution = new CloudFrontWebDistribution(scope, 'WebDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: siteBucket,
            originAccessIdentity
          },
          behaviors : [ {isDefaultBehavior: true}]
        }
      ]
    })
    new cdk.CfnOutput(scope, 'DomainName', { value: distribution.domainName })

  const deployAction = new pipelineActions.S3DeployAction({
    actionName: 'Website',
    input: buildOutput,
    bucket: siteBucket
  })

  pipeline.addStage({
    stageName: 'Deploy',
    actions: [deployAction]
  })

  return deployOutput
}

export class MergePipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const pipeline = new codepipeline.Pipeline(this, 'Pipeline')

    const sourceOutput = setupSourceStep(this, pipeline)

    const buildOutput = setupBuildStep(this, pipeline, sourceOutput)

    const deployOutput = setupDeployStep(this, pipeline, buildOutput)

return
    // Deploy -- deploy built source to the existing hosting bucket from the Hosting stack.

// ~~~~~~~~~~~~~
    // const deployBuildSpec = codebuild.BuildSpec.fromObject({
    //   version: '0.2',
    //   phases: {
    //     install:{
    //       commands: [
    //         'yarn --cwd web/hosting install'
    //       ]
    //     },
    //     build: {
    //       commands: [
    //         'yarn --cwd web/hosting deploy:hosting -c stage=production',
    //       ]
    //     }
    //   }
    // })

    // const codeDeployProject = new codebuild.PipelineProject(this, 'DeployPipelineProject', {
    //   buildSpec: deployBuildSpec,
    //   environment: {
    //       buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2
    //     }
    //   }
    // )

    // const policyStatement = new iam.PolicyStatement()
    // policyStatement.addActions(...[
    //   '*'
    // ])
    // policyStatement.addResources("*")
    // codeDeployProject.addToRolePolicy(policyStatement)

// ~~~~~~~~~~~~~~



    // const deployAction = new pipelineActions.CloudFormationCreateUpdateStackAction({
    //   actionName: 'DeployAction',
    //   adminPermissions: true,
    //   templatePath: buildOutput.atPath('HostingStack.template.json'),
    //   stackName: 'HostingDeployStack'
    // })



// ~~~~~~~~~~
    // const hostingStack = new HostingStack(scope, 'mathieugilbert-web-production')


// ~~~~~~~~~~~~~
    // const deployAction = new appDelivery.PipelineDeployStackAction({
    //   stack: hostingStack,
    //   input: buildOutput,
    //   adminPermissions: false
    // })

    // const deployAction = new actions.S3DeployAction({
    //   actionName: "DeployAction",
    //   project: codeDeployProject,
    //   input: sourceOutput
    // })
// ~~~~~~~~~~~~~~~

    // const deployAction = new pipelineActions.CodeBuildAction({
    //   actionName: "DeployAction",
    //   project: codeDeployProject,
    //   input: sourceOutput,
    //   outputs: [deployOutput]
    // })
// ~~~~~~~~~~~~~~


    return

    // Notify
    pipeline.addStage({
      stageName: 'Notify',
      actions: [
        // see below...
      ]
    })
  }
}


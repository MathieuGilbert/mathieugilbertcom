import * as cdk from '@aws-cdk/core'
import * as codepipeline from '@aws-cdk/aws-codepipeline'
import * as pipelineActions from '@aws-cdk/aws-codepipeline-actions'
import * as codebuild from '@aws-cdk/aws-codebuild'
import * as iam from '@aws-cdk/aws-iam'
import * as appDelivery from '@aws-cdk/app-delivery'
import { Bucket } from '@aws-cdk/aws-s3'
import { HostingStack } from './hosting-stack'

export class MergePipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const pipeline = new codepipeline.Pipeline(this, 'Pipeline')

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

    new codepipeline.CfnWebhook(this, 'Webhook', {
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

    // Build

    const buildBuildSpec = codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: {
          'runtime-versions': {
            nodejs: 12
          },
          commands: [
            'yarn --cwd web install',
            'yarn --cwd web/hosting install'
          ]
        },
        build: {
          commands: [
            'yarn --cwd web build',
            'yarn --cwd web/hosting build'
          ]
        }
      }
    })

    const codeBuildProject = new codebuild.PipelineProject(this, 'BuildPipelineProject', {
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

    // Deploy

// ~~~~~~~~~~~~~
    // const deployBuildSpec = codebuild.BuildSpec.fromObject({
    //   version: '0.2',
    //   phases: {
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



    const deployAction = new pipelineActions.CloudFormationCreateUpdateStackAction({
      actionName: 'DeployAction',
      adminPermissions: true,
      templatePath: buildOutput.atPath('HostingStack.template.json'),
      stackName: 'HostingDeployStack'
    })



// ~~~~~~~~~~
    // const hostingStack = new HostingStack(scope, 'mathieugilbert-web-production')

  //   const hostingBucket = cdk.Fn.importValue('Bucket')
  //   const buck = new Bucket(scope, hostingBucket)

  //   const bucket = Bucket.fromBucketAttributes(this, 'Bucket', {
  //     bucketArn: 'arn:aws:s3:::my-bucket'
  // }


  //   const deployAction = new pipelineActions.S3DeployAction({
  //     actionName: 'Website',
  //     input: buildOutput,
  //     bucket: buck
  //   })
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
    // const deployOutput = new codepipeline.Artifact()
    // const deployAction = new pipelineActions.CodeBuildAction({
    //   actionName: "DeployAction",
    //   project: codeDeployProject,
    //   input: sourceOutput,
    //   outputs: [deployOutput]
    // })
// ~~~~~~~~~~~~~~
    pipeline.addStage({
      stageName: 'Deploy',
      actions: [deployAction]
    })

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


import * as cdk from '@aws-cdk/core'
import * as codepipeline from '@aws-cdk/aws-codepipeline'
import * as actions from '@aws-cdk/aws-codepipeline-actions'
import * as codebuild from '@aws-cdk/aws-codebuild'
import * as ssm from '@aws-cdk/aws-ssm'

export class PreviewPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const pipeline = new codepipeline.Pipeline(this, 'Pipeline')

    const oauthToken = cdk.SecretValue.secretsManager('/mathieugilbertcom/github-oauth-token', {
      jsonField: 'oauthToken'
    })

    const sourceOutput = new codepipeline.Artifact()
    const sourceAction = new actions.GitHubSourceAction({
      actionName: 'SourceFromGitHub',
      oauthToken,
      output: sourceOutput,
      owner: 'MathieuGilbert',
      repo: 'mathieugilbertcom',
      trigger: actions.GitHubTrigger.WEBHOOK
    })

    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction]
    })

    const webhook = new codepipeline.CfnWebhook(this, 'Webhook', {
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

    const buildSpec = codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        install: {
          'runtime-versions': { nodejs: 12 },
          commands: [
            'cd web',
            'yarn install'
          ],
        },
        build: {
          commands: [
            'yarn --cwd web build'
          ],
        },
      }
    })

    const codeBuildProject = new codebuild.PipelineProject(this, 'BuildPipelineProject', {
      buildSpec,
      environment: {
          buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2
        }
      }
    )

    const buildOutput = new codepipeline.Artifact()
    const buildAction = new actions.CodeBuildAction({
      actionName: "BuildAction",
      project: codeBuildProject,
      input: sourceOutput,
      outputs: [buildOutput]
    })
    pipeline.addStage({
      stageName: 'Build',
      actions: [buildAction]
    })

    return

    // Deploy


    const codeDeployProject = new codebuild.PipelineProject(this, 'DeployPipelineProject', {
      buildSpec: {
        isImmediate: false,
        toBuildSpec: () => 'yarn --cwd ./hosting cdk deploy  -c stage=pipeline'
      },
      environment: {
          buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2
        }
      }
    )

    const deployOutput = new codepipeline.Artifact()
    const deployAction = new actions.CodeBuildAction({
      actionName: "CodeBuild",
      project: codeBuildProject,
      input: buildOutput,
      outputs: [deployOutput]
    })
    pipeline.addStage({
      stageName: 'Deploy',
      actions: [deployAction]
    })

    // Notify
    pipeline.addStage({
      stageName: 'Notify',
      actions: [
        // see below...
      ]
    })
  }
}


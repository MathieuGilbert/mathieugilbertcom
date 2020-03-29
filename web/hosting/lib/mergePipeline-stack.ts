import * as cdk from '@aws-cdk/core'
import * as codepipeline from '@aws-cdk/aws-codepipeline'
import * as actions from '@aws-cdk/aws-codepipeline-actions'
import * as codebuild from '@aws-cdk/aws-codebuild'
import * as iam from '@aws-cdk/aws-iam'

export class MergePipelineStack extends cdk.Stack {
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

    const buildSpec = codebuild.BuildSpec.fromObject({
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

    // Deploy

    const buildSpecDeploy = codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        post_build: {
          commands: [
            'yarn --cwd web/hosting deploy:hosting -c stage=production',
          ]
        }
      }
    })

    const codeDeployProject = new codebuild.PipelineProject(this, 'DeployPipelineProject', {
      buildSpec: buildSpecDeploy,
      environment: {
          buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2
        }
      }
    )

    const policyStatement = new iam.PolicyStatement()
    policyStatement.addActions(...[
      '*'
    ])
    policyStatement.addResources("*")
    codeDeployProject.addToRolePolicy(policyStatement)

    const deployOutput = new codepipeline.Artifact()
    const deployAction = new actions.CodeBuildAction({
      actionName: "DeployAction",
      project: codeDeployProject,
      input: sourceOutput,
      outputs: [deployOutput]
    })
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


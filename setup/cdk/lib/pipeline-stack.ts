import { Stack, StackProps } from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const githubOIDC = new iam.OpenIdConnectProvider(this, 'GithubOIDC', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
      thumbprints: ['a031c46782e6e6c662c2c87c76da9aa62ccabd8e'],
    })

    const role = new iam.Role(this, `${id}-assumable-role`, {
      assumedBy: new iam.WebIdentityPrincipal(
        githubOIDC.openIdConnectProviderArn,
        {
          StringLike: {
            // Only allow specified subjects to assume this role
            [`token.actions.githubusercontent.com:sub`]:
              'repo:MathieuGilbert/mathieugilbertcom:*',
          },
          StringEquals: {
            // Audience is always sts.amazonaws.com with AWS official Github Action
            // https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services#adding-the-identity-provider-to-aws
            ['token.actions.githubusercontent.com:aud']: 'sts.amazonaws.com',
          },
        }
      ),
    })

    // so it can assume cdk deploy role
    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['sts:AssumeRole'],
        resources: ['*'],
      })
    )
  }
}

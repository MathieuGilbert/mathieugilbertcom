# Welcome to your CDK TypeScript project!

This deploys a React site to s3 and hosts it via CloudFront.

`yarn deploy:hosting -c stage=production`


##  Pipelines

*Requires creating a Personal Access Token in GitHub and storing it in Secrets Manager*

*previewPipeline*

`WIP`

- Open Github pull request
  - source
  - build
  - deploy
  - report status & add comment to PR with branch-specific URL

*mergePipeline*

`yarn deploy:mergePipeline`
vs
`yarn deploy:pipeline`

- Merge to master
  - source
  - build
  - deploy

TODO: tests



## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

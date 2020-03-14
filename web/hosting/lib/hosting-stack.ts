import * as cdk from '@aws-cdk/core'
import { Bucket, BlockPublicAccess } from '@aws-cdk/aws-s3'
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment'
import {
  CloudFrontWebDistribution,
  CloudFrontWebDistributionProps,
  OriginAccessIdentity
} from '@aws-cdk/aws-cloudfront'

export class HostingStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const siteBucket = new Bucket(this, 'SiteBucket', {
      bucketName: 'mathieugilbertcom-test-bucket',
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY // NOT recommended for production code
    })
    new cdk.CfnOutput(this, 'Bucket', { value: siteBucket.bucketName })

    new BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [ Source.asset('../build/') ],
      destinationBucket: siteBucket
    })

    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity')

    const distribution = new CloudFrontWebDistribution(this, 'WebDistribution', {
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
  }
}

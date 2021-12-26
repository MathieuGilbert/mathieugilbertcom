import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as iam from 'aws-cdk-lib/aws-iam'

export interface ContainerStackProps extends StackProps {}

export class ContainerStack extends Stack {
  constructor(scope: Construct, id: string, props?: ContainerStackProps) {
    super(scope, id, props)

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'OriginAccessIdentity'
    )

    const bucket = new s3.Bucket(this, `${id}-hosting-bucket`, {
      bucketName: `${id.toLocaleLowerCase()}-hosting-bucket`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedHeaders: ['Authorization', 'Content-Length'],
          allowedMethods: [s3.HttpMethods.GET],
          allowedOrigins: ['*'],
          maxAge: 3000,
        },
      ],
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })

    const origin = new origins.S3Origin(bucket, {
      originAccessIdentity,
    })

    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [bucket.arnForObjects('*')],
        principals: [
          new iam.CanonicalUserPrincipal(
            originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    )

    const distribution = new cloudfront.Distribution(
      this,
      `${id}-distribution`,
      {
        defaultBehavior: {
          origin,
          cachePolicy: new cloudfront.CachePolicy(this, `${id}-cache-policy`, {
            headerBehavior: cloudfront.CacheHeaderBehavior.allowList(
              'Access-Control-Request-Headers',
              'Access-Control-Request-Method',
              'Origin'
            ),
          }),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        },
        defaultRootObject: 'index.html',
      }
    )

    new s3deploy.BucketDeployment(this, `${id}-deploy-frontend`, {
      sources: [s3deploy.Source.asset('../container/build')],
      destinationBucket: bucket,
      retainOnDelete: false,
      contentLanguage: 'en',
      storageClass: s3deploy.StorageClass.INTELLIGENT_TIERING,
      serverSideEncryption: s3deploy.ServerSideEncryption.AES_256,
      distribution,
    })
  }
}

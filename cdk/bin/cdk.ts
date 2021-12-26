#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { ContainerStack } from '../lib/container/container-stack'
import { HometownStack } from '../lib/hometown/hometown-stack'

const app = new cdk.App()

const env = app.node.tryGetContext('env') || 'default'

new ContainerStack(app, `${env}-ContainerStack`, {
  description: 'MFE Container',
})

new HometownStack(app, `${env}-HometownStack`, {
  description: 'MFE Hometown',
})

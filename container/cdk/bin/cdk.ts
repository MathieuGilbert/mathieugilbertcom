#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { ContainerStack } from '../lib/container-stack'

const app = new cdk.App()

const env = app.node.tryGetContext('env') || 'default'

new ContainerStack(app, `${env}-ContainerStack`, {
  description: 'MFE Container',
})

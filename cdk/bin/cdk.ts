#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { ContainerStack } from '../lib/container/stacks/container'

const app = new cdk.App()

const env = app.node.tryGetContext('env') || 'default'
console.log('env', env)

new ContainerStack(app, `${env}-ContainerStack`, {
  description: 'MFE Container',
})

#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { HometownStack } from '../lib/hometown-stack'

const app = new cdk.App()

const env = app.node.tryGetContext('env') || 'default'

new HometownStack(app, `${env}-HometownStack`, {
  description: 'Hometown MFE',
})

#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { HostingStack } from '../lib/hosting-stack'

const app = new cdk.App()

const appName = app.node.tryGetContext('appName')
if (!appName) {
  throw new Error('ckd context value "appName" is required.')
}

const org = app.node.tryGetContext('org')
if (!org) {
  throw new Error('ckd context value "org" is required.')
}

const stage = app.node.tryGetContext('stage')
if (!stage) {
  throw new Error('ckd context value "stage" is required.')
}

const stackId = `${org}-${appName}-${stage}`

new HostingStack(app, stackId)

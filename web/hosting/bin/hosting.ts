#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { HostingStack } from '../lib/hosting-stack'
import { PreviewPipelineStack } from '../lib/preview-pipeline-stack'

const app = new cdk.App()

const appName = app.node.tryGetContext('appName')
const org = app.node.tryGetContext('org')
const stage = app.node.tryGetContext('stage')
if (!appName || !org || !stage) {
  throw new Error('ckd context values "appName", "org", and "stage" are required.')
}
const stackId = `${org}-${appName}-${stage}`

new HostingStack(app, stackId)
new PreviewPipelineStack(app, 'mg-preview-pipeline')

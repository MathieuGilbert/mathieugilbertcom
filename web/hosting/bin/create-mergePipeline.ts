#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { MergePipelineStack } from '../lib/mergePipeline-stack'

const app = new cdk.App()

new MergePipelineStack(app, 'mathieugilbert-web-mergePipeline')

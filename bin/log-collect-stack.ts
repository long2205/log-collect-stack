#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LogCollectStack } from '../lib/log-collect-stack-stack';

const app = new cdk.App();
new LogCollectStack(app, 'LogCollectStack');

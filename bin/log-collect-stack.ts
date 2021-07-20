#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LogCollectStackStack } from '../lib/log-collect-stack-stack';

const app = new cdk.App();
new LogCollectStackStack(app, 'LogCollectStackStack');

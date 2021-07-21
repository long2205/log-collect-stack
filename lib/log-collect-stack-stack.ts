import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import * as subscriptions from '@aws-cdk/aws-sns-subscriptions';
import * as logs from '@aws-cdk/aws-logs';
import * as logs_des from '@aws-cdk/aws-logs-destinations';

export class LogCollectStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const subcriptionEmail = new cdk.CfnParameter(this, "subcriptionEmail", {
      type: "String",
      description: "Email which SNS will send notifications to"
    });
    
    const logName = new cdk.CfnParameter(this, "logName", {
      type: "String",
      description: "Prefix name of log group and log stream for Lambda's trigger"
    });

    //Define subcription
    const sns_topic = new sns.Topic(this, `${this.stackName}-sns-topic`, {
      topicName: `${this.stackName}-sns-topic`,
    });
    sns_topic.addSubscription(new subscriptions.EmailSubscription(subcriptionEmail.valueAsString));

    //Role for lambda
    const custom_policy = {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Effect": "Allow",
              "Action": "sns:Publish",
              "Resource": sns_topic.topicArn
          },
          {
              "Effect": "Allow",
              "Action": [
                  "logs:CreateLogGroup",
                  "logs:CreateLogStream",
                  "logs:PutLogEvents"
              ],
              "Resource": "arn:aws:logs:ap-northeast-1:803319575531:log-group:/aws/lambda/"+`${this.stackName}-lambda`+":*"
          }
      ]
    };
    const custom_policy_document = iam.PolicyDocument.fromJson(custom_policy);
    const lambda_role = new iam.Role(this,`${this.stackName}-lambda-role`,
    {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies: { "custom-lambda-role": custom_policy_document },
    });
    const lambda_fn = new lambda.Function(this, `${this.stackName}-LambdaFunction`, {
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '/lambda_code')),
      role: lambda_role,
      environment: {
        'snsARN': sns_topic.topicArn
      },
      logRetention: logs.RetentionDays.ONE_DAY
    });

    //Create log group, log stream and subscription filter
    const log_group = new logs.LogGroup(this, `${this.stackName}-LogGroup`, {
      retention: logs.RetentionDays.ONE_DAY,
      logGroupName: logName.valueAsString + "-Group"
    });

    const log_stream = new logs.LogStream(this, `${this.stackName}-LogStream`, {
      logGroup: log_group,
      logStreamName: logName.valueAsString + "-Stream"
    });
    
    const subscription_filter = new logs.SubscriptionFilter(this,`${this.stackName}-SubscriptionFilter`,{
      logGroup: log_group,
      destination: new logs_des.LambdaDestination(lambda_fn),
      filterPattern: logs.FilterPattern.anyTerm('ERROR', 'WARN'),
    });
  }
}

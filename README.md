# CUSTOM ERROR NOTIFICATION FOR LOG GROUP
1. Deploy with custom email for SNS to send notifications, log group and log stream prefix
```
cdk deploy --parameters subcriptionEmail=sabo2205@gmail.com --parameters logName=testlog
```
2. Confirm subscription after deploy
3. You can test run by creating new log event in log group
Current setting gonna push notification with **ERROR** or **WARN**
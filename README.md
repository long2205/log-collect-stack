# CUSTOM ERROR NOTIFICATION FOR LOG GROUP
1. Deploy with custom email for SNS to send notifications, log group and log stream prefix
```
cdk deploy --parameters subcriptionEmail=sabo2205@gmail.com --parameters logName=testlog
```
2. Confirm subscription after deploy
3. You can test run by creating new log event in log group
Current setting gonna push notification with **ERROR** or **WARN**


## Setup log collect from EC2
Make sure EC2 have permission to send log to CloudWatch Logs
```
sudo yum install -y amazon-cloudwatch-agent
```
**Option 1: Run cloudwatch agent wizard setting**
```
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```
**Option 2: Manual setting**
Create cloudWatch agent's configuration file location: `/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json`
```
amazon-cloudwatch-agent-ctl -a append-config -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
-- restart agent
amazon-cloudwatch-agent-ctl -a stop
amazon-cloudwatch-agent-ctl -a start
```
Config log collect's settings
Example:
```json
{
  "agent": {
    "metrics_collection_interval": 10,
    "logfile": "/opt/aws/amazon-cloudwatch-agent/logs/amazon-cloudwatch-agent.log"
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/html/www/project/app/storage/logs/**.log",
            "log_group_name": "project-application-log",
            "log_stream_name": "backend-log",
            "timezone": "Local",
            "timestamp_format": "%Y-%m-%d %H:%M:%S %f %Z"
          },
          {
            "file_path": "/opt/aws/amazon-cloudwatch-agent/logs/test.log",
            "log_group_name": "test.log",
            "log_stream_name": "test.log",
            "timezone": "Local"
          }
        ]
      }
    },
    "log_stream_name": "my_log_stream_name",
    "force_flush_interval": 15
  }
}
```
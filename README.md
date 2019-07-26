CodeCommit Slack Bot
===

This is a lambda function which will send message direct to your slack channel when PR status or PR comment changed in CodeCommit repository.

## Usage

1. Run build script,  upload zip file to lambda and define environment variables.
1. Setup CloudWatch alarm and add lambda trigger.
1. Try create a PR and a comment for it.

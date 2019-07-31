const AWS = require("aws-sdk");
const codecommit = new AWS.CodeCommit();
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const {
    detail: {
      pullRequestId,
      pullRequestStatus,
      callerUserArn,
      title,
      repositoryNames
    }
  } = event;
  const user = getUser(callerUserArn)
  const repoName = getRepoName(repositoryNames)
  const data = await codecommit.getPullRequest({ pullRequestId }).promise()
  const payload = {
    channel: process.env.channel,
    username: `${user}@${repoName}`,
    text: `[PR] ${title} (${pullRequestStatus}) <${getPrLink(repoName, pullRequestId)}>`,
    icon_emoji: ":mega:"
  };
  console.log(payload);
  return fetch(process.env.webhook, {
    method: 'post',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  }).then(res => res.text())
};

function getUser(arn) {
  return arn.match(/user\/(?<user>[a-zA-Z.]*)@/).groups.user;
}

function getPrLink(repoName, id) {
  return `https://${process.env.AWS_REGION}.console.aws.amazon.com/codesuite/codecommit/repositories/${repoName}/pull-requests/${id}`
}

function getRepoName(names) {
  return names.slice(0, 1).join('')
}

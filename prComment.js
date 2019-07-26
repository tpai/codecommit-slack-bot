const AWS = require("aws-sdk");
const codecommit = new AWS.CodeCommit();
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const {
    detail: {
      callerUserArn,
      commentId,
      pullRequestId
    }
  } = event;
  const user = getUser(callerUserArn)
  const prData = await codecommit.getPullRequest({ pullRequestId }).promise()
  const commentData = await codecommit.getComment({ commentId }).promise();
  const payload = {
    channel: process.env.channel,
    username: `${user}@${process.env.repository}.pr.comment`,
    text: `Re: [PR] ${prData.pullRequest.title}\n\`\`\`\n${commentData.comment.content}\n\`\`\`\n\n<${getPrLink(pullRequestId)}|Click here> for detail.`,
    icon_emoji: ":speech_balloon:"
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

function getPrLink(id) {
  return `https://${process.env.AWS_REGION}.console.aws.amazon.com/codesuite/codecommit/repositories/${process.env.repository}/pull-requests/${id}/activity`
}

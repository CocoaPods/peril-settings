import { danger } from "danger";
import { Issues } from "github-webhook-event-types"

export default async (webhook: Issues) => {
  const issue = webhook.issue
  const repo = webhook.repository

  // Support quietly transforming issue bodies from "Cocoapods" to "CocoaPods".
  // Wrap it in whitespace to avoid changing links.
  
  // > "aCocoapods CocoaPods Cocoapods ".replace(/ Cocoapods /g, " CocoaPods ")
  // => 'aCocoapods CocoaPods CocoaPods '

  const newBody = issue.body.replace(/ Cocoapods /g, " CocoaPods ")
                            .replace(/ XCode /g, " Xcode ");

  // Update the comment, make all our lives easier
  if (newBody !== issue.body) {
    await danger.github.api.issues.update({
      owner: repo.owner.login,
      repo: repo.name,
      number: issue.number,
      body: newBody
    })
  }
  
  // Support checking if the issue has the same content as the issue template.

  // A failing request for contents via the API throws, so we need to 
  // catch it safely.
  try {
    // danger/peril#129
    const ghIssueTemplateResponse = await danger.github.api.repos.getContents({
      owner: repo.owner.login,
      repo: repo.name,
      path: ".github/ISSUE_TEMPLATE.md"
    })

    const buffer = new Buffer(ghIssueTemplateResponse.data.content, "base64")
    const template = buffer.toString()

    // Whitespace between code on disk vs text which comes from GitHub is different.
    // This took far too long to figure.
    if (template && template.replace(/\s+/g, "") === issue.body.replace(/\s+/g, "")) {
      // Post a message
      await danger.github.api.issues.createComment({
        owner: repo.owner.login,
        repo: repo.name,
        number: issue.number,
        body: `Hi there, thanks for the issue, but it seem that this issue is just the default template. Please create a new issue with the template filled out.`
      })

      // Close the issue
      await danger.github.api.issues.update({
        owner: repo.owner.login,
        repo: repo.name,
        number: issue.number,
        state: "closed"
      })
    }

  } catch (error) {}

}

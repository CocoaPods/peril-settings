import { danger } from "danger";
import { IssueComment } from "github-webhook-event-types"

export default async (webhook: IssueComment) => {
  const comment = webhook.comment
  const repo = webhook.repository

  // Support quietly transforming comment bodies from "Cocoapods" to "CocoaPods".
  // Wrap it in whitespace to avoid changing links.
  
  // > "aCocoapods CocoaPods Cocoapods ".replace(/ Cocoapods /g, " CocoaPods ")
  // => 'aCocoapods CocoaPods CocoaPods '

  const newBody = comment.body.replace(/ Cocoapods /g, " CocoaPods ")
                              .replace(/ XCode /g, " Xcode ");

  // Update the comment
  if (newBody !== comment.body) {
    await danger.github.api.issues.editComment({
      owner: repo.owner.login,
      repo: repo.name,
      comment_id: String(comment.id),
      body: newBody
    })
  }
}

import { danger, schedule } from "danger"

const issue = danger.github as any // danger/peril#128

// Support quietly transforming issue bodies from "Cocoapods" to "CocoaPods"
//
if (issue.body.includes("Cocoapods")) {
  const newBody = issue.body.replace(/Cocoapods/, "CocoaPods")
  const repo = issue.repository

  schedule(async () => {
    await danger.github.api.issues.edit({
      owner: repo.owner.login,
      repo: repo.name,
      number: issue.number,
      body: newBody,
    })
  })
}


import { danger, schedule } from "danger"


const gh = danger.github as any // danger/peril#128
const issue = gh.issue

// Support quietly transforming issue bodies from "Cocoapods" to "CocoaPods"
//
if (issue.body.includes("Cocoapods")) {
  const newBody = issue.body.replace(/Cocoapods/g, "CocoaPods")
  const repo = gh.repository

  schedule(async () => {
    await danger.github.api.issues.edit({
      owner: repo.owner.login,
      repo: repo.name,
      number: issue.number,
      body: newBody,
    })
  })
}


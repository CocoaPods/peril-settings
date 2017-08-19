import { danger, schedule, markdown } from "danger"

const gh = danger.github as any // danger/peril#128
const issue = gh.issue
const repo = gh.repository

// Support quietly transforming issue bodies from "Cocoapods" to "CocoaPods"
//
if (issue.body.includes("Cocoapods")) {
  const newBody = issue.body.replace(/Cocoapods/, "CocoaPods")

  schedule(async () => {
    await danger.github.api.issues.edit({
      owner: repo.owner.login,
      repo: repo.name,
      number: issue.number,
      body: newBody,
    })
  })
}

// Support checking if the issue has the same content as the issue template.

schedule( async () => {
  const repo = gh.repository
  
  // danger/peril#129
  const ghIssueTemplateResponse = await danger.github.api.repos.getContent({
    owner: repo.owner.login,
    repo: repo.name,
    path: ".github/ISSUE_TEMPLATE.md"
  })
  const buffer = new Buffer(ghIssueTemplateResponse.content, "base64")
  const template = buffer.toString()

  if (buffer && buffer === issue.body) {
    markdown(`
Hi there, thanks for the issue, but it seem that this issue is just the default template. Please re-create an issue with 
the template filled out.
    `)

    await danger.github.api.issues.edit({
      owner: repo.owner.login,
      repo: repo.name,
      number: issue.number,
      state: "closed"
    })
  }
})


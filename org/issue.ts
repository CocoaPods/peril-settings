import { danger, schedule, markdown } from "danger";
import * as Diff from "text-diff";

const gh = danger.github as any; // danger/peril#128
const issue = gh.issue;
const repo = gh.repository;

// Support quietly transforming issue bodies from "Cocoapods" to "CocoaPods".
// Wrap it in whitespace to avoid changing links.
if (issue.body.includes(" Cocoapods ")) {
  // > "aCocoapods CocoaPods Cocoapods ".replace(/ Cocoapods /g, " CocoaPods ")
  // => 'aCocoapods CocoaPods CocoaPods '
  const newBody = issue.body.replace(/ Cocoapods /g, " CocoaPods ");

  schedule(async () => {
    await danger.github.api.issues.edit({
      owner: repo.owner.login,
      repo: repo.name,
      number: issue.number,
      body: newBody
    })
  })
}

// Support checking if the issue has the same content as the issue template.

schedule(async () => {
  const repo = gh.repository

  let ghIssueTemplateResponse
  try {
    // danger/peril#129
    ghIssueTemplateResponse = await danger.github.api.repos.getContent({
      owner: repo.owner.login,
      repo: repo.name,
      path: ".github/ISSUE_TEMPLATE.md"
    })

    const buffer = new Buffer(ghIssueTemplateResponse.data.content, "base64")
    const template = buffer.toString()

    // Whitespace between code on disk vs text which comes from GitHub is different.
    // This took far too long to figure.
    if (template && template.replace(/\s+/g, "") === issue.body.replace(/\s+/g, "")) {
      markdown(`Hi there, thanks for the issue, but it seem that this issue is just the default template. Please create a new issue with the template filled out.`);

      await danger.github.api.issues.edit({
        owner: repo.owner.login,
        repo: repo.name,
        number: issue.number,
        state: "closed"
      })
    }

  } catch (error) {}
});

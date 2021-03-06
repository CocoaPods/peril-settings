## CocoaPods' Peril Settings

### What is this project?

This is the configuration repo for Peril on the CocoaPods org. There is a [settings file](settings.json) and org-wide
dangerfiles which are inside the [org folder](org).

Here's some links to the key things

 - [Peril](https://github.com/danger/peril)
 - [Danger JS](http://danger.systems/js/)
 - [Peril for Orgs](https://github.com/danger/peril/blob/master/docs/setup_for_org.md)
 - [Staging Dashboard](https://staging-dashboard.peril.systems)

This org runs on Peril Staging.


### TLDR on this Repo?

Peril is Danger running on a web-server, this repo is the configuration for that, currently the dangerfiles in [org](org/)
run on every issue and pull request for all CocoaPods Repos.

### To Develop

```sh
git clone https://github.com/CocoaPods/peril-settings.git
yarn install
code .

# Verify your TypeScript compiles
yarn type-check 
```

You will need node and yarn installed beforehand. You can get them both by running `brew install yarn`. 

This will give you auto-completion and types for Danger mainly. 

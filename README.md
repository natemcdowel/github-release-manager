# github-release-manager
Creates and downloads github releases

# Installation
- `npm install github-release-manager`

# Creating a release
- ```node create-release.js <branch> <github_token> <owner> <repo>```
- The contents of the `/release` directory will be gzipped and uploaded to a github release versioned by branch name.

# Downloading a release
- ```node ./node_modules/github-release-manager/download-release.js <branch> <github_token> <owner> <repo>```
- The zipped release will be downloaded and unzipped to the `/release` directory.

# Publishing to NPM

- bump the version number in package.json
- run `npm publish` locally

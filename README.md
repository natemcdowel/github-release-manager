# github-release-manager
Creates and downloads github releases

# Installation
- `npm install github-release-creator`

# Creating a release
- `node create-release.js <branch> <github_token> <owner> <owner`
- The contents of the `/release` directory will be gzipped and uploaded to a github release versioned by branch name.

# Downloading a release
- `bash ./node_modules/github-release-manager/download_release.sh <branch> <owner> <repo>` 
- The zipped release will be downloaded and unzipped to the `/release` directory.

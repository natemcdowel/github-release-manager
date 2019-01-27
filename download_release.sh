#!/bin/bash

BRANCH=$1
OWNER=$2
REPO=$3
GET_ASSET_ID="import sys, json; print json.load(sys.stdin)['assets'][0]['id']"
ASSET_ID=$(curl https://api.github.com/repos/$OWNER/$REPO/releases/tags/release-$BRANCH?access_token=$GITHUB_ACCESS_TOKEN | \
           python -c "$GET_ASSET_ID")

# Download release
wget -q --auth-no-challenge --header='Accept:application/octet-stream' \
  https://api.github.com/repos/$OWNER/$REPO/releases/assets/$ASSET_ID?access_token=$GITHUB_ACCESS_TOKEN \
  -O release.tar.gz

# Extract to release directory
mkdir release
tar -zvxf release.tar.gz

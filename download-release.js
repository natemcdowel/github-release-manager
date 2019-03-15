const HEADERS = {headers: {'User-Agent': 'request'}};
const TRAVIS_BRANCH_OR_TAG = process.argv[2];
const GH_TOKEN = process.argv[3];
const OWNER = process.argv[4];
const REPO = process.argv[5];
const TOKEN = '?access_token=' + GH_TOKEN;
let HttpWrapper = require('./http-wrapper.js');
let _ = require('lodash');
let shell = require('shelljs');
let http = new HttpWrapper();
let date = Date.now();

class GithubReleaseDownloader {

  downloadRelease() {
    this.getReleases();
  }
  
  getReleaseData() {
    return JSON.stringify({
      tag_name: 'release-' + TRAVIS_BRANCH_OR_TAG + '-' + date,
      target_commitish: TRAVIS_BRANCH_OR_TAG
    });
  }
  
  getReleases() {
    http.makeGetRequest(
      'https://api.github.com/repos/' + OWNER + '/' + REPO + '/releases' + TOKEN,
      HEADERS
    ).then(res => {

      const releasesFound = JSON.parse(res.body).filter(release => release.tag_name.indexOf( 'release-' + TRAVIS_BRANCH_OR_TAG ) > -1);
      const releasesSorted = _.sortBy(releasesFound, release => release.created_at);
      const lastRelease = releasesSorted[ releasesSorted.length -1 ];

      console.log('Using asset id: ' + lastRelease.assets[0].id);
      console.log('Release created at: ' + lastRelease.created_at);

      this.download(lastRelease.assets[0].id);
      this.makeReleaseDir();
      this.unzipRelease();

    });
  }

  download(assetId) {
    shell.exec(
      `wget -q --auth-no-challenge --header='Accept:application/octet-stream' https://api.github.com/repos/${OWNER}/${REPO}/releases/assets/${assetId}?access_token=${GH_TOKEN} -O release.tar.gz`
    )
  }

  makeReleaseDir() {
    shell.exec('mkdir release');
  }

  unzipRelease() {
    shell.exec('tar -zvxf release.tar.gz');
  }

}

let downloader = new GithubReleaseDownloader();
downloader.downloadRelease();

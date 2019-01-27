const HEADERS = {headers: {'User-Agent': 'request'}};
const TRAVIS_BRANCH = process.argv[2];
const GH_TOKEN = process.argv[3];
const OWNER = process.argv[4];
const REPO = process.argv[5];
const TOKEN = '?access_token=' + GH_TOKEN;

let HttpWrapper = require('./http-wrapper.js');
let http = new HttpWrapper();

class GithubReleaseCreator {
  
  getReleaseData() {
    return JSON.stringify({
      tag_name: 'release-' + TRAVIS_BRANCH,
      target_commitish: TRAVIS_BRANCH
    });
  }
  
  uploadReleaseZip(id) {

    console.log('Uploading release...')

    http.makeFileUploadRequest(
      './release.tar.gz',
      'https://uploads.github.com/repos/' + OWNER + '/' + REPO + '/releases/' + id + '/assets' + TOKEN + '&name=release.tar.gz'
    ).then(() => {

      console.log('Release successfully uploaded...')
      process.exit(0);

    }, error => {

      console.log(error);
      process.exit(1);

    });
  }
  
  getReleases() {
    http.makeGetRequest(
      'https://api.github.com/repos/mdx-dev/platform-ui-2/releases' + TOKEN,
      HEADERS
    ).then(res => {
  
      const releaseFound = JSON.parse(res.body).find(release => release.target_commitish === TRAVIS_BRANCH);
      if (releaseFound && releaseFound.assets && releaseFound.assets.length) {
  
        http.makeDeleteRequest(
          'https://api.github.com/repos/' + OWNER + '/' + REPO + '/releases/assets/' + releaseFound.assets[0].id + TOKEN
        ).then(res => {
          this.handleRelease(releaseFound);
        });
  
      } else {
  
        this.handleRelease(releaseFound);
  
      }
    });
  }
  
  handleRelease(releaseFound) {
    if (!releaseFound) {
  
      this.createRelease();
  
    } else {
  
      this.editRelease(releaseFound.id);
  
    }
  }
  
  createRelease() {
    http.makePostRequest(
      'https://api.github.com/repos/' + OWNER + '/' + REPO + '/releases' + TOKEN,
      this.getReleaseData()
    ).then(res => {

      this.uploadReleaseZip(JSON.parse(res.body).id);
  
    });
  }
  
  editRelease(id) {
    http.makePatchRequest(
      'https://api.github.com/repos/' + OWNER + '/' + REPO + '/releases/' + id + TOKEN,
      this.getReleaseData()
    ).then(() => {
  
      this.uploadReleaseZip(id);
  
    });
  }
}

let creator = new GithubReleaseCreator();
creator.getReleases();

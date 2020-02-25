const TRAVIS_BRANCH_OR_TAG = process.argv[2];
const GH_TOKEN = process.argv[3];
const OWNER = process.argv[4];
const REPO = process.argv[5];
const TOKEN = '?access_token=' + GH_TOKEN;

let HttpWrapper = require('./http-wrapper.js');
let shell = require('shelljs');
let http = new HttpWrapper();
let date = Date.now();

class GithubReleaseCreator {
  
  getReleaseData() {
    return JSON.stringify({
      tag_name: 'release-' + TRAVIS_BRANCH_OR_TAG + '-' + date
    });
  }
  
  uploadReleaseZip(id) {

    console.log('Uploading release...')

    http.makeFileUploadRequest(
      './release.tar.gz',
      'https://uploads.github.com/repos/' + OWNER + '/' + REPO + '/releases/' + id + '/assets' + TOKEN + '&name=release.tar.gz'
    ).then(res => {

      console.log(res.body);
      console.log('Release successfully uploaded...')
      process.exit(0);

    }, error => {

      console.log(error);
      process.exit(1);

    });
  }
  
  createRelease() {

    console.log('Release data: ' + this.getReleaseData());

    http.makePostRequest(
      'https://api.github.com/repos/' + OWNER + '/' + REPO + '/releases' + TOKEN,
      this.getReleaseData()
    ).then(res => {

      console.log(res.body);
      this.uploadReleaseZip(JSON.parse(res.body).id);
  
    });
  }

  getSha() {
    return new Promise(resolve => {

      const process = shell.exec('git rev-parse --verify HEAD', () => {});
      process.stdout.on('data', (data) => {
        this.sha = data.replace('\n', '');
        resolve(this.sha);
      });

    })
  }

}

let creator = new GithubReleaseCreator();

creator.getSha().then(() => creator.createRelease());

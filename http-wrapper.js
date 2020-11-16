let request = require('request');
let fs = require('fs');

class HttpWrapper {

  makeGetRequest(url, options) {
    return new Promise((resolve, reject) => {
      request(url, options, (error, response) => {
        if (!error && response.statusCode == 200) {
          resolve(response);
        }
        reject((response && `${response.statusCode}: ${response.statusMessage}`) || error);
      })
    });
  }

  makePostRequest(url, body, contentType) {
    return new Promise((resolve, reject) => {
      request.post({url: url, headers: {'User-Agent': 'request', 'Content-Type': contentType}, body: body}, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
  }

  makePatchRequest(url, body) {
    return new Promise((resolve, reject) => {
      request.patch({url: url, headers: {'User-Agent': 'request'}, body: body}, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
  }

  makeDeleteRequest(url) {
    return new Promise((resolve, reject) => {
      request.delete({url: url, headers: {'User-Agent': 'request'}}, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
  }

  makeFileUploadRequest(file, url) {
    return new Promise((resolve, reject) => {
      const stats = fs.statSync(file);

      fs.createReadStream(file).pipe(request.post(
        {
          url: url,
          json: true,
          headers: {
            'User-Agent': 'Release-Agent',
            'Accept': 'application/vnd.github.v3+json',
            'Content-Length': stats.size,
            'Content-Type': 'application/gzip'
          }
        },
        (error, response) => {
          if (error) {
            reject(error);
          }
          resolve(response)
        }
      ));
    });
  }

}

module.exports = HttpWrapper;

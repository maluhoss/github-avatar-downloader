var request = require('request');
var secrets = require('./secrets');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!')

var repoOwner = process.argv[2];
var repoName = process.argv[3];

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${secrets.GITHUB_TOKEN}`
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });
  }

getRepoContributors(repoOwner, repoName, function(err, result) {
  var data = JSON.parse(result);

  // console.log("Errors:", err);
  // console.log("Result:", data);

  data.forEach(function(indivData) {
    // 'Name: ', indivData.login, indivData.avatar_url)
    downloadImageByURL(indivData.avatar_url, "./avatars/" + indivData.login + '.jpg')
  })
});

function downloadImageByURL(url, filePath) {
  var dir = './avatars';
  console.log('Downloading file: ', filePath)


  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  request.get(url)
  .on('error', function(err) {
    throw err;
  })
  .pipe(fs.createWriteStream(filePath))
}

console.log('Downloading Avatars...')



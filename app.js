var Hackpad = require('hackpad');
var gitLib = require('simple-git');
var Q = require('q');
var fs = require('fs');

var HACKPAD_CLIENTID = '{HACKPAD_CLIENTID}';
var HACKPAD_SECRET = '{HACKPAD_SECRET}';
var HACKPAD_ID = '{HACKPAD_ID}';

var GIT_REMOTE_URL = "https://{personal_access_token}@github.com/{user}/{repo}";
var GIT_LOCAL_PATH = "./Backups";

function GetHackPadContent() {
  console.log('Start GetHackPadContent');

  var deferred = Q.defer();
  var client = new Hackpad(HACKPAD_CLIENTID, HACKPAD_SECRET);

  client.export(HACKPAD_ID, null, 'html', function(err, data) {
    if (err) {
      console.log(err);
      deferred.reject(err);
    } else {
      console.log(data);
      deferred.resolve(data);
    }
  });

  return deferred.promise;
}

function CloneFromGithub() {
  console.log('Start CloneFromGithub');

  var deferred = Q.defer();
  var git = gitLib();

  git.clone(GIT_REMOTE_URL, GIT_LOCAL_PATH, function(err) {
    if (err) {
      if (err.indexOf('already exists') <= -1) {
        deferred.reject(err);

        return;
      }
    }

    deferred.resolve();
  });

  return deferred.promise;
}

function PushToGithub(content) {
  console.log('Start PushToGithub');

  var deferred = Q.defer();
  var git = gitLib(GIT_LOCAL_PATH);

  fs.writeFile(GIT_LOCAL_PATH + '/backup.html', content, function(err) {
    if (err) {
      deferred.reject(err);
      return;

    } else {
      git.add('./*')
        .commit(new Date().toISOString() + ' backup')
        .push('origin', 'master', function() {
          deferred.resolve();
        });
    }
  });

  return deferred.promise;
}

CloneFromGithub()
  .then(function() {
    GetHackPadContent()
      .then(function(content) {
        PushToGithub(content)
          .then(function() {
            console.log('done!');
          });
      });
  });

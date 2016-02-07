# Hackpad to github

A simple script to sync from hackpad content to github.

## Usage

1. Restore packages

    npm install

1. Modify these variable in app.js.

    var HACKPAD_CLIENTID = '{HACKPAD_CLIENTID}';
    var HACKPAD_SECRET = '{HACKPAD_SECRET}';
    var HACKPAD_ID = '{HACKPAD_ID}';

    var GIT_REMOTE_URL = "https://{personal_access_token}@github.com/{user}/{repo}";
    var GIT_LOCAL_PATH = "./Backups";

1. Run script

    npm run start

rm index.zip
zip index.zip index.js index.html images images/*

curl -X PUT -u poi5305:9837098370 "https://oc.elggum.com/remote.php/dav/files/poi5305/xRobotmon/scripts/cookieKingdom.js" --data-binary @"index.js"

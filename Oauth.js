/*
* File: Oauth.gs
* Author: Max Torresdey
* Description: 
* This is the file with the functions that enable Oauth authorization, 
* the CLIENT_ID and CLIENT_SECRET should not be disclosed.
*/

var CLIENT_ID = 'fd67980b6a42b58f7168';
var CLIENT_SECRET = 'f3e7146911b1f209411dc97efeb9b1bb509fe767';

/***************************************/
//getGithubService_
// configure the service
function getGithubService_() {
  return OAuth2.createService('GitHub')
    .setAuthorizationBaseUrl('https://github.com/login/oauth/authorize')
    .setTokenUrl('https://github.com/login/oauth/access_token')
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('repo'); 
}

/***************************************/
//logRedirectUri
// Logs the redict URI to register
// can also get this from File > Project Properties
function logRedirectUri() {
  var service = getGithubService_();
  Logger.log(service.getRedirectUri());
}

/***************************************/
// authCallback
// Handle the callback
function authCallback(request) {
  var githubService = getGithubService_();
  var isAuthorized = githubService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

/***************************************/
// getGitHubRateLimit
// Get Rate limit
function getGitHubRateLimit() {
  // set up the service
  var service = getGithubService_();
  
  if (service.hasAccess()) {
    Logger.log("App has access.");
    
    var api = "https://api.github.com/rate_limit";
    
    var headers = {
      "Authorization": "Bearer " + getGithubService_().getAccessToken(),
      "Accept": "application/vnd.github.v3+json"
    };
    
    var options = {
      "headers": headers,
      "method" : "GET",
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(api, options);
    
    var json = JSON.parse(response.getContentText());
    var responseCode = response.getResponseCode();
    
    Logger.log(responseCode);
    
    Logger.log("You have " + json.rate.remaining + " requests left this hour.");
    return null;
  }
  else {
    Logger.log("App has no access yet.");
    
    // open this url to gain authorization from github
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log("Open the following URL and re-run the script: %s",
        authorizationUrl);
    return authorizationUrl;
  }
}

/***************************************/
//loginToGithub
//This function is called by the login button in the login Page
function loginToGithub(loginAgain){
     url = getGitHubRateLimit();
  //if already logged in
  if (url == null && !loginAgain) {
    RepoPullOptions();
  }
  //if user needs to log in
  else {
    var html = HtmlService.createHtmlOutput('<html><script>'
     +'window.close = function(){window.setTimeout(function(){google.script.host.close()},9)};'
     +'var a = document.createElement("a"); a.href="'+url+'"; a.target="_blank";'
     +'if(document.createEvent){'
     +'  var event=document.createEvent("MouseEvents");'
     +'  if(navigator.userAgent.toLowerCase().indexOf("firefox")>-1){window.document.body.append(a)}'                          
     +'  event.initEvent("click",true,true); a.dispatchEvent(event);'
     +'}else{ a.click() }'
     +'close();'
     +'</script>'
     // Offer URL as clickable link in case above code fails.
     +'<body style="word-break:break-word;font-family:sans-serif;">Failed to open automatically. <a href="'+url+'" target="_blank" onclick="window.close()">Click here to proceed</a>.</body>'
     +'<script>google.script.host.setHeight(40);google.script.host.setWidth(410)</script>'
     +'</html>').setWidth( 90 ).setHeight( 1 );
    showSidebar();
    DocumentApp.getUi().showModalDialog( html, "Opening ..." );
  }
}

//TESTING FUNCTIONS(REMOVE THEM LATER):

/***************************************/
// getGitHubRateLimit2
// Get Rate limit
function getGitHubRateLimit2() {
  // set up the service
  var service = getGithubService_();
    Logger.log("App has no access yet.");
    
    // open this url to gain authorization from github
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log("Open the following URL and re-run the script: %s",
        authorizationUrl);
    return authorizationUrl;
  
}

/***************************************/
//loginToGithub
//This function is called by the login button in the login Page
function loginToGithub2(loginAgain){
     url = getGitHubRateLimit2();
  //if already logged in
  if (url == null && !loginAgain) {
    RepoPullOptions();
  }
  //if user needs to log in
  else {
    var html = HtmlService.createHtmlOutput('<html><script>'
     +'window.close = function(){window.setTimeout(function(){google.script.host.close()},9)};'
     +'var a = document.createElement("a"); a.href="'+url+'"; a.target="_blank";'
     +'if(document.createEvent){'
     +'  var event=document.createEvent("MouseEvents");'
     +'  if(navigator.userAgent.toLowerCase().indexOf("firefox")>-1){window.document.body.append(a)}'                          
     +'  event.initEvent("click",true,true); a.dispatchEvent(event);'
     +'}else{ a.click() }'
     +'close();'
     +'</script>'
     // Offer URL as clickable link in case above code fails.
     +'<body style="word-break:break-word;font-family:sans-serif;">Failed to open automatically. <a href="'+url+'" target="_blank" onclick="window.close()">Click here to proceed</a>.</body>'
     +'<script>google.script.host.setHeight(40);google.script.host.setWidth(410)</script>'
     +'</html>').setWidth( 90 ).setHeight( 1 );
    showSidebar();
    DocumentApp.getUi().showModalDialog( html, "Opening ..." );
  }
}






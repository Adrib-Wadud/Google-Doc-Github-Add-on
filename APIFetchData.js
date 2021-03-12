/*
* File: APIFetchData.gs
* Author: Max Torresdey
* Description: 
* This file contains all the functions that request data from the github api.
* Data such, repos data, branches data, etc.
*/

var API_URL = "https://api.github.com/";

/**
* returns the owner from which the repo_name belongs
*
* @param {string} repo_name, name of repo
* @return {string} owner of repo_name
*/
function getOwner(repo_name){
  var allRepos = listReposComplete();
  
  for (var i = 0; i < allRepos.length; i++){
    if (allRepos[i].name === repo_name){
      return allRepos[i].owner.login;
    }
  }
  return null;
}

/**
* Returns the repos from the current user
*
* @return {array of json object} repo list object, checkout at: https://developer.github.com/v3/repos/#list-repositories-for-the-authenticated-user
*
*/
function listReposComplete(){
  var repoList = apiCall(API_URL + "user/repos");
  return repoList;
}

/**
* Returns the repo names
*
* @return {string array} names of the repos of current user
*/
function listReposNames(){
  var repoList = listReposComplete();
  var strListRepoNames = [];
  
  for (var i = 0; i < repoList.length; i++){
    strListRepoNames.push(repoList[i].name); 
  }
  //DocumentApp.getActiveDocument().getBody().appendParagraph(strListRepoNames.toString());
  Logger.log(strListRepoNames.toString());
  return strListRepoNames;
}

/**
* Returns an array of all the branches
*
* @param {string} repo_name, name of repo
* @return {array of json objects} branches objects , check on: https://developer.github.com/v3/repos/branches/#list-branches
*/
function listBranchesComplete(repo_name){
  var owner = getOwner(repo_name);
  
  if (owner != null){
    var url = API_URL + "repos/"+ owner +"/"+ repo_name+"/branches";
    var listBranches = apiCall(url);
    return listBranches;
  }
  else {
    //in case of error do: 
    return null;
  }
}

/**
* Returns an array of all the branches names
*
* @param {string} repo_name, name of repo
* @return {string array} names of branches
*/
function listBranchesNames(repo_name){
  var branchesNameList = [];
  var branchesListObj = listBranchesComplete(repo_name);
  
  Logger.log(repo_name);
  
  for (var i = 0; i < branchesListObj.length; i++){
    branchesNameList.push(branchesListObj[i].name); 
  }
  return branchesNameList;
}

/**
* Returns the list of all commits objects
*
* @param {string} repo_name, name of repo
* @param {string} branch_name, name of branch
* @param {json object} attributes, contains filtering data for commit, example: var attributes = {author: "Maxrod98", since:"2020-03-26T00:00:00Z", until:"2020-11-08T20:00:00Z"};
* @return {array of json objects} all commits, check on: https://developer.github.com/v3/repos/commits/#list-commits
*/
function listCommitsComplete(repo_name, branch_name, attributes) {
  var attsString = "";
  
  //handling attributes
  if (attributes != null){
    if (attributes.since != null) attsString += ("&since=" + encodeURIComponent(attributes.since));
    if (attributes.until != null) attsString += ("&until=" + encodeURIComponent(attributes.until));
    if (attributes.author != null) attsString += ("&author=" + encodeURIComponent(attributes.author));
  }
  
  var owner = getOwner(repo_name);
  if (owner != null) {
    var url = API_URL + "repos/" + owner + "/" + repo_name +"/commits?sha=" + branch_name +  attsString;
    Logger.log(url);
    var commitsList = apiCall(url);
    return commitsList;
  }
  else {
    //If error occurs
    return null; 
  }
}

/**
* Returns a list of the commits messages
*
* @param {string} repo_name, name of repo
* @param {string} branch_name, name of branch
* @param {json array} attributes,in the same format as the previous function
* @return {string array} returns the messages of the commits
*/
function listCommitsMessages(repo_name, branch_name, attributes){
  var listCommits = listCommitsComplete(repo_name, branch_name, attributes);
  var listCommitMessages = [];
  
  if (listCommits != null){
    for (var i = 0; i < listCommits.length; i++){
      listCommitMessages.push(listCommits[i].commit.message); 
    }
    return listCommitMessages;
  }
  else {
    //if error occurs 
    return null;
  }
}

/**
* Returns the collaborators info
*
* @param {string} repo_name, name of repo
* @return {array of json objects} returns the collaborators, check on: https://developer.github.com/v3/repos/collaborators/
*/
function listCollaboratorsComplete(repo_name){
  var owner = getOwner(repo_name);
  
  if (owner != null) {
    var url = API_URL + "repos/"+ owner + "/" + repo_name + "/collaborators";
    
    var listCollaborators = apiCall(url);
    return listCollaborators;
  }
  else {
    //On error
    return null;
  }
}

/**
* Returns the collaborators names
*
* @param {string} repo_name, name of repo
* @return {array of strings} returns the collaborators
*/
function listCollaboratorsNames(repo_name){
  var listNames = [];
  var listCollaborators = listCollaboratorsComplete(repo_name);
  
  for (var i = 0; i < listCollaborators.length; i++) {
    listNames.push(listCollaborators[i].login);
  }
  
  return listNames;
}


/**
* Returns the commits
*
* @param {string} repo_name, name of repo
* @param {string} commit1, first commit or reference number
* @param {string} commit2, second commit or reference number
* @return {array of json objects} list of commits, check on: https://developer.github.com/v3/repos/commits/#compare-two-commits
*/
function compareCommitsComplete(repo_name, commit1, commit2){
  var owner = getOwner(repo_name);
  if (owner != null){
    var url = API_URL + "repos/" + owner +"/" + repo_name +"/compare/" + commit1 + "..." + commit2;
    var compareCommitsObj = apiCall(url);
    return compareCommitsObj;
  }
  else {
    //On error
    return null;
  }
}

/**
* Returns the commits with the code only
*
* @param {string} repo_name, name of repo
* @param {string} commit1, first commit or reference number
* @param {string} commit2, second commit or reference number
* @return {string array} list of commits messages
*/
function compareCommitsCodeOnly(repo_name, commit1, commit2){
  var commitsCodeChangesList = [];
  var commitDiffList = compareCommitsComplete(repo_name, commit1, commit2).files;
  
  for (var i = 0; i < commitDiffList.length; i++) {
    commitsCodeChangesList.push(commitDiffList[i].patch);
  }
  
  return commitsCodeChangesList;
}

/**
* Returns the commit
*
* @param {string} repo_name, name of repo
* @param {string} commit_ref, reference or branch of commit
* @return {json object} object of the commit, check on: https://developer.github.com/v3/repos/commits/#get-a-commit
*/
function getCommit(repo_name, commit_ref){
  var owner = getOwner(repo_name);
  if (owner != null) {
    var url = API_URL + "repos/" + owner + "/" + repo_name +"/commits/" + commit_ref;
    var commit_info = apiCall(url);
    return commit_info;
  }
  else {
    //If error occurs
    return null; 
  }
}

/**
* Returns the result of the API Call
*
* @param {string} api_url, url of the api request
* @return {json object} any type of result from an api call, a json object
*/
function apiCall(api_url) {
  var service = getGithubService_();
  
  if (service.hasAccess()) {
    Logger.log("App has access.");
    
    var headers = {
      "Authorization": "Bearer " + getGithubService_().getAccessToken(),
      "Accept": "application/vnd.github.v3+json"
    };
    
    var options = {
      "headers": headers,
      "method" : "GET",
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(api_url, options);
    
    //if failed return null
    if (response.getResponseCode() != 200) return null;
    var json = JSON.parse(response.getContentText());
    
    return json;
  }
  else {
    Logger.log("App has no access yet.");
    
    // open this url to gain authorization from github
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log("Open the following URL and re-run the script: %s",
               authorizationUrl);
  }
  return null;
}


//testing purposes only
function test(){
  Logger.log(JSON.stringify(listCommitsComplete("Finance-Web-App", "master")));
  //DocumentApp.getActiveDocument().getBody().appendParagraph(JSON.stringify(listCommitsComplete("privaterepo", "main")));
  DocumentApp.getActiveDocument().getBody().appendParagraph("TASDASD");
}


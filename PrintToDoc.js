/*
* File: PrintToDoc.gs
* Author: Hunter Garza
* Description: 
* This file will print commit information based on chosen settings
*/

//used within the html from RepoPullOptions to set the print format (table, list, or bulletpoints)
function setCurrentPrintFormat(printFormatId){
  PropertiesService.getScriptProperties().setProperty('curPrintFormat', printFormatId);
}


//This function calls the compareCommits API to get the JSON object which is parsed and printed to the doc.
function printCompareCommits(repo_name, commit1, commit2) {
  var compare_commit_info = compareCommitsComplete(repo_name, commit1, commit2);
  
  //ERROR HANDLING
  if (compare_commit_info == null) {
    showError("Bad request: the commit reference number or branches names are not correct or in the incorrect order.");
    return;
  }
  
  if (compare_commit_info == null) return;
  var files = compare_commit_info.files;
  
  var body = DocumentApp.getActiveDocument().getBody();
  
  // Use editAsText to obtain a single text element containing
  // all the characters in the document.
  var text = body.editAsText();
  
  for (var i = 0; i < files.length; i++) {
    
    text.appendText("\nCommit patch: \n"+ files[i].patch);
    text.appendText("\nFilename:"+ JSON.stringify(files[i].filename));
    text.appendText("\nStatus:"+ JSON.stringify(files[i].status));
    text.appendText("\nAdditions:"+ JSON.stringify(files[i].additions));
    text.appendText("\nDeletions:"+ JSON.stringify(files[i].deletions));
    text.appendText("\nChanges:"+ JSON.stringify(files[i].changes));
    text.appendText("\nURL:"+ JSON.stringify(files[i].raw_url));
    text.appendText("\n--------------------------------------------------------------");
    
  }
}

//This function calls the getCommit API to get the JSON object which is parsed and printed to the doc.
function printCommit(repo_name, commit_ref){
    var commit_info = getCommit(repo_name, commit_ref);
  
  if (commit_info == null) {
    showError("Could not retrieve commit, check your branch name or commit ref.");
    return;
  }
    var body = DocumentApp.getActiveDocument().getBody();
  
    body.appendParagraph("COMMIT REF: " + commit_ref);
    body.appendParagraph("Commit author:"+ JSON.stringify(commit_info.commit.author.name));
    body.appendParagraph("Author email:"+ JSON.stringify(commit_info.commit.author.email));
    body.appendParagraph("Commit date:"+ JSON.stringify(commit_info.commit.author.date));
    body.appendParagraph("Commit message:"+ JSON.stringify(commit_info.commit.message));
    body.appendParagraph("URL:"+ JSON.stringify(commit_info.url));
    body.appendParagraph("----------------");
}

//This function calls the listCommits API to get the JSON object which is parsed and printed to the doc.
function printListCommits(repo_name, branch_name, attributes) {
  var commits = listCommitsComplete(repo_name, branch_name, attributes);
  
  //ERROR HANDLING
  if (commits != null) {
    if (commits.length < 0) {
      showError("No commits found");
    }
  }
  else {
    showError("No commits found");
  }
    
  var textList = [];
  for (var i = 0; i < commits.length; i++) {
        var sha = commits[i].sha;
        var contributor = commits[i].commit.committer.name;
        var message = commits[i].commit.message;
        var date = commits[i].commit.committer.date;
        var body = DocumentApp.getActiveDocument().getBody();
    
        var text = "COMMIT REF ID: " + sha + "\n";
        text += "CONTRIBUTOR:  " + contributor + "\n";
        text += "COMMIT MESSAGE: " + message + "\n";
        text += "DATE: " + date + "\n";
        textList.push(text);
      }
  
  var curPrintFormat = PropertiesService.getScriptProperties().getProperty('curPrintFormat');
  if (curPrintFormat == null) setCurrentPrintFormat("TABLE");
  Logger.log("TESTING HERE");
  Logger.log(curPrintFormat);
  
  switch (curPrintFormat){
    case "TABLE":
      var table = [["COMMIT REF ID", "CONTRIBUTOR", "COMMIT MESSAGE", "DATE"]];
      for (var i = commits.length - 1; i >= 0; i--) {
        var sha = commits[i].sha;
        var contributor = commits[i].commit.committer.name;
        var message = commits[i].commit.message;
        var date = commits[i].commit.committer.date;
        var body = DocumentApp.getActiveDocument().getBody();
        table.push([sha, contributor, message, date]);
      }
      body.appendTable(table);
      break;
    case "LIST":
      for (var i = textList.length - 1; i >= 0 ; i--) {
        body.appendListItem(textList[i]);
      }
      break;
    case "BULLETS":
      for (var i = textList.length - 1; i >= 0 ; i--) {
        body.appendParagraph("*\n" +  textList[i]);
      }
      break;
    default:
      body.appendParagraph("*\n ERROR" );
  }
  
  
}

//This function proccess styling requests made by the user

function updateDocumentStyling(selectedOptions){
  var fontColor;
  var backgroundColor;
  DocumentApp.getActiveDocument().getHeader().editAsText().setFontFamily(selectedOptions[0]);
  DocumentApp.getActiveDocument().getHeader().editAsText().setFontSize(parseInt(selectedOptions[1], 10));
  
  switch (selectedOptions[2]) {
    case 'Aggie (Maroon)':
      fontColor = '#800000';
      break;
    case 'Red':
      fontColor = '#FF0000';
      break;
    case 'Orange':
      fontColor = '#FFA500';
      break;
    case 'Yellow':
      fontColor = '#FFFF00';
      break;
    case 'Green':
      fontColor = '#008000';
      break; 
    case 'Blue':
      fontColor = '#0000FF';
      break;
    case 'Purple':
      fontColor = '#400080';
      break;
    case 'Pink':
      fontColor = '#FFC0CB';
      break;
    case 'Black':
      fontColor = '#000000';
      break;
    case 'Gray':
      fontColor = '#808080';
      break;
    case 'White':
      fontColor = '#FFFFFF';
      break;
  }
  DocumentApp.getActiveDocument().getHeader().editAsText().setForegroundColor(fontColor);
  
  DocumentApp.getActiveDocument().getBody().editAsText().setFontFamily(selectedOptions[3]);
  DocumentApp.getActiveDocument().getBody().editAsText().setFontSize(parseInt(selectedOptions[4], 10));
  switch (selectedOptions[5]) {
    case 'Aggie (Maroon)':
      fontColor = '#800000';
      break;
    case 'Red':
      fontColor = '#FF0000';
      break;
    case 'Orange':
      fontColor = '#FFA500';
      break;
    case 'Yellow':
      fontColor = '#FFFF00';
      break;
    case 'Green':
      fontColor = '#008000';
      break; 
    case 'Blue':
      fontColor = '#0000FF';
      break;
    case 'Purple':
      fontColor = '#400080';
      break;
    case 'Pink':
      fontColor = '#FFC0CB';
      break;
    case 'Black':
      fontColor = '#000000';
      break;
    case 'Gray':
      fontColor = '#808080';
      break;
    case 'White':
      fontColor = '#FFFFFF';
      break;
  }
  DocumentApp.getActiveDocument().getBody().editAsText().setForegroundColor(fontColor);
  
  /*
  switch (selectedOptions[6]) {
    case 'Table':
      
      break;
    case 'Numbered List':
      var bodyText = DocumentApp.getActiveDocument().getBody().getText();
      var regex = /^[^-]+.+/gm;
      var matches = bodyText.match(regex);
      DocumentApp.getActiveDocument().getBody().clear();
      for(var i = 0; i < matches.length; i++){
        DocumentApp.getActiveDocument().getBody().appendListItem(matches[i] + "\n");
      }
      break;
    case 'Bullet Points':
      
      break;
  }
  */
  
  switch (selectedOptions[7]) {
    case 'Aggie (Maroon)':
      backgroundColor = '#800000';
      break;
    case 'Red':
      backgroundColor = '#FF0000';
      break;
    case 'Orange':
      backgroundColor = '#FFA500';
      break;
    case 'Yellow':
      backgroundColor = '#FFFF00';
      break;
    case 'Green':
      backgroundColor = '#008000';
      break; 
    case 'Blue':
      backgroundColor = '#0000FF';
      break;
    case 'Purple':
      backgroundColor = '#400080';
      break;
    case 'Pink':
      backgroundColor = '#FFC0CB';
      break;
    case 'Black':
      backgroundColor = '#000000';
      break;
    case 'Gray':
      backgroundColor = '#808080';
      break;
    case 'White':
      backgroundColor = '#FFFFFF';
      break;
  }
  DocumentApp.getActiveDocument().getHeader().editAsText().setBackgroundColor(backgroundColor);
  DocumentApp.getActiveDocument().getBody().editAsText().setBackgroundColor(backgroundColor);
}


/*
* File: UI.gs
* Description: Main UI manipulation
* This file contains all the functions manipulating the html UI. 
*/

//opens the LoginPage html code
function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('LoginPage')
      .setTitle('Login');
  DocumentApp.getUi().showSidebar(ui);
}


//creates an addon in the add on menu named Start Project 3 Add-on
function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Start Project 3 Add-on', 'showSidebar')
      .addToUi();
}

//runs the onOpen function when the add-on is installed
function onInstall(e) {
  onOpen(e);
}

/*
function myFunction() {
  var doc = DocumentApp.getActiveDocument();
  
  doc.getHeader();
  
  var html = doGet("LoginPage").setTitle('Log in').setWidth(300);
  DocumentApp.getUi() // Or DocumentApp or FormApp
      .showSidebar(html);

 
}
*/

//opens the most important page that loads the commit data
function RepoPullOptions(){
  var html = doGet("RepoPullOptions").setTitle('Commit Options').setWidth(800); //removed .setWidth(300)
  DocumentApp.getUi() // Or DocumentApp or FormApp
      .showSidebar(html);

}

//takes user to page where they can modify
function goToStyleDevLogPage(){
  var html = doGet("StyleDevLog").setTitle('Preferred Styling');
  DocumentApp.getUi() // Or DocumentApp or FormApp
      .showSidebar(html);
}

//makes a pop-up that explains user how to use the add-on
function showHelp() {
  var ui = DocumentApp.getUi(); // Same variations.

  var result = ui.alert(
    'Help panel',
    'Welcome to the Github add-on! \n \n This add-on will import your commit data from Github and will print it into your word document. \n ' 
    +'How to use: \n 1. First log in with your github credentials. \n 2. Then select the repository and branch from which you want to extract your commits. \n '
    +'3. Select the date intervals from your commits. \n 4. Select the collaborators and then you can print the commits into your word document. \n' 
    +'5. You can change the styling of the output by clicking into the button \'Change Styling\' or you can leave it as it is.'
    + '\n \n That\'s it!',
      ui.ButtonSet.OK);

  var ui = HtmlService.createHtmlOutputFromFile('LoginPage')
      .setTitle('Login');
  DocumentApp.getUi().showSidebar(ui);
}

//makes a pop-up that tells the user that something went wrong with their request
function showError(errorMessage) {
  var ui = DocumentApp.getUi(); // Same variations.

  var result = ui.alert(
    'Error on request',errorMessage,
      ui.ButtonSet.OK);

  //RepoPullOptions();
}

//used to redirect to other html pages
function doGet(page) {
  return HtmlService
      .createTemplateFromFile(page)
      .evaluate();
}


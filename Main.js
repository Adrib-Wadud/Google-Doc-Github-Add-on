//opens the index html code
function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('index')
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
  
  var html = doGet("index").setTitle('Log in').setWidth(300);
  DocumentApp.getUi() // Or DocumentApp or FormApp
      .showSidebar(html);

 
}
*/

function loggedin(){
  var html = doGet("loggedIn").setTitle('Commit Options').setWidth(800); //removed .setWidth(300)
  DocumentApp.getUi() // Or DocumentApp or FormApp
      .showSidebar(html);

}

function goToStylingPage(){
  var html = doGet("styling").setTitle('Preferred Styling');
  DocumentApp.getUi() // Or DocumentApp or FormApp
      .showSidebar(html);
}

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

  // Process the user's response.
  if (result == ui.Button.OK) {
    // User clicked "Yes".
  }
  var ui = HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Login');
  DocumentApp.getUi().showSidebar(ui);
  
}

function doGet(page) {
  return HtmlService
      .createTemplateFromFile(page)
      .evaluate();
}


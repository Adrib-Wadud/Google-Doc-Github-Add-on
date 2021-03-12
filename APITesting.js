function apiFunction() {
  var query = 'acti';
  var url = "https://api.github.com/users/Maxrod98";

  
  var response = UrlFetchApp.fetch(url);
  
  //var response = UrlFetchApp.fetch("http://www.google.com/");
  //Logger.log(response.getContentText());
  
  Logger.log(response.getContentText());
}

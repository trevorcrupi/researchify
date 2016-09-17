document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('savePage');
  checkPageButton.addEventListener('click', function() {

    chrome.tabs.getSelected(null, function(tab) {
      var data = {};
      data.url = tab.url;
      var request = new XMLHttpRequest();
      request.open('POST', 'http://localhost:3000/api/article', true);
      request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      request.send(JSON.stringify(data));
    });
  }, false);
}, false);
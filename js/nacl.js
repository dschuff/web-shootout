    helloWorldModule = null;  // Global application object.
    statusText = 'NO-STATUS';

    // When the NaCl module has loaded, hook up an event listener to handle
    // messages coming from it, and then indicate success.
    function moduleDidLoad() {
      helloWorldModule = document.getElementById('hello_world');
      // Add a message handler that accepts messages coming from the NaCl
      // module.
      helloWorldModule.addEventListener('message', handleMessage, false);
      updateStatus('Module Loaded');
    }

    function updateResultBox(message_event) {
      resultbox = document.getElementById('NaclResults');
      resultbox.innerHTML += message_event.data + '<br>';
    }

    // Handle a message coming from the NaCl module.
    function handleMessage(message_event) {
      console.log("got " + message_event.data);
      if (message_event.data.search(":") != -1) {
        updateResultBox(message_event);
        var nameAndScore = message_event.data.split(':');
        if (nameAndScore[0] == "Score") {
          updateStatus(message_event.data);
      }
        registerResult(nameAndScore[0], nameAndScore[1], "nacl");
      } else {
        updateStatus(message_event.data);
      }
    }

    // If the page loads before the Native Client module loads, then set the
    // status message indicating that the module is still loading.  Otherwise,
    // do not change the status message.
    function pageDidLoad() {
      if (helloWorldModule == null) {
        updateStatus('LOADING...');
      } else {
        // It's possible that the Native Client module onload event fired
        // before the page's onload event.  In this case, the status message
        // will reflect 'SUCCESS', but won't be displayed.  This call will
        // display the current message.
        updateStatus();
      }
    }

    function fortyTwo() {
      helloWorldModule.postMessage('fortyTwo');
    }

function ClearNaclResults() {
  var results = document.getElementById("NaclResults");
  // Only clear after we have completed a run
  if (results.innerHTML.search("Score:") != -1) {
    results.innerHTML = "";
  }
}

function runSmallNaclBenchmarks() {
    ClearNaclResults();
    helloWorldModule.postMessage('runBenchmarks small');
}
function runLargeNaclBenchmarks() {
    ClearNaclResults();
    helloWorldModule.postMessage('runBenchmarks large');
}

    function reverseText() {
      // Grab the text from the text box, pass it into reverseText()
      var inputBox = document.forms.helloForm.inputBox;
      helloWorldModule.postMessage('reverseText:' + inputBox.value);
      // Note: a |false| return tells the <form> tag to cancel the GET action
      // when submitting the form.
      return false;
    }

    // Set the global status message.  If the element with id 'NaclStatus'
    // exists, then set its HTML to the status message as well.
    // opt_message The message test.  If this is null or undefined, then
    //     attempt to set the element with id 'NaclStatus' to the value of
    //     |statusText|.
    function updateStatus(opt_message) {
      if (opt_message)
        statusText = opt_message;
      var NaclStatus = document.getElementById('NaclStatus');
      if (NaclStatus) {
        NaclStatus.innerHTML = statusText;
      }
    }

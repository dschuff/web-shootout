var benchmarkNaClModule = null;  // Global application object.
    statusText = 'NO-STATUS';

    // When the NaCl module has loaded, hook up an event listener to handle
    // messages coming from it, and then indicate success.
    function moduleDidLoad() {
      benchmarkNaClModule = document.getElementById('benchmark_nexe');
      // Add a message handler that accepts messages coming from the NaCl
      // module.
      benchmarkNaClModule.addEventListener('message', handleMessage, false);
      updateStatus('Module Loaded');
    }

    function updateResultBox(message_event) {
      resultbox = document.getElementById('NaclResults');
      resultbox.innerHTML += message_event.data + '<br>';
    }

    // Handle a message coming from the NaCl module.
    function handleMessage(message_event) {
      console.log("nexe said: " + message_event.data);
      if (message_event.data.search(":") != -1 &&
          message_event.data.search("Score") == -1) {
          updateResultBox(message_event);
      } else {
        updateStatus(message_event.data);
      }
    }

    // If the page loads before the Native Client module loads, then set the
    // status message indicating that the module is still loading.  Otherwise,
    // do not change the status message.
    function pageDidLoad() {
      if (benchmarkNaClModule == null) {
        updateStatus('Loading module...');
      } else {
        // It's possible that the Native Client module onload event fired
        // before the page's onload event.  In this case, the status message
        // will reflect 'SUCCESS', but won't be displayed.  This call will
        // display the current message.
        updateStatus();
      }
    }

function ClearNaclResults() {
  var results = document.getElementById("NaclStatus");
  // Only clear after we have completed a run
  if (results.innerHTML.search("Score:") != -1) {
    document.getElementById("NaclResults").innerHTML = "<br />";
  }
}

function runSmallNaclBenchmarks() {
    ClearNaclResults();
    benchmarkNaClModule.postMessage('runBenchmarks small');
}
function runLargeNaclBenchmarks() {
    ClearNaclResults();
    benchmarkNaClModule.postMessage('runBenchmarks large');
}

    function reverseText() {
      // Grab the text from the text box, pass it into reverseText()
      var inputBox = document.forms.helloForm.inputBox;
      benchmarkNaClModule.postMessage('reverseText:' + inputBox.value);
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

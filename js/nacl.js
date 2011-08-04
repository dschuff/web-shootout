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

    // Handle a message coming from the NaCl module.
    function handleMessage(message_event) {
      resultbox = document.getElementById('naclResults');
      resultbox.innerHTML += message_event.data + '<br>';
    }

    // If the page loads before the Native Client module loads, then set the
    // status message indicating that the module is still loading.  Otherwise,
    // do not change the status message.
    function pageDidLoad() {
      // Set the focus on the text input box.  Doing this means you can press
      // return as soon as the page loads, and it will fire the reversetText()
      // function.
      document.forms.helloForm.inputBox.focus();
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

function runNaclBenchmarks() {
    helloWorldModule.postMessage('runBenchmarks');
}

    function reverseText() {
      // Grab the text from the text box, pass it into reverseText()
      var inputBox = document.forms.helloForm.inputBox;
      helloWorldModule.postMessage('reverseText:' + inputBox.value);
      // Note: a |false| return tells the <form> tag to cancel the GET action
      // when submitting the form.
      return false;
    }

    // Set the global status message.  If the element with id 'statusField'
    // exists, then set its HTML to the status message as well.
    // opt_message The message test.  If this is null or undefined, then
    //     attempt to set the element with id 'statusField' to the value of
    //     |statusText|.
    function updateStatus(opt_message) {
      if (opt_message)
        statusText = opt_message;
      var statusField = document.getElementById('statusField');
      if (statusField) {
        statusField.innerHTML = statusText;
      }
    }

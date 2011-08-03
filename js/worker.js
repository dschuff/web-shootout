

self.addEventListener('message', function(e) {
  var msgtype = e.data.type;
  var msg = e.data.msg;
  switch (msgtype) {
    case "start":
      RunV8Style();
      break;
    default:
      throw msg;
      break;
  }
}, false);

importScripts('base.js');
importScripts('fasta_10k_ref_output.js');
importScripts('io_replacement.js');
importScripts('biginteger.js');
importScripts('fannkuchredux.js');
importScripts('fasta.js');
importScripts('revcomp.js');
importScripts('binarytrees.js');
importScripts('knucleotide.js');
importScripts('nbody.js');
importScripts('spectralnorm.js');
importScripts('pidigits.js');


var completed = -1;
var benchmarks = BenchmarkSuite.CountBenchmarks();
var success = true;

function PostTypedMessage(type, msg) {
  self.postMessage({'type': type, 'msg': msg});
}

function WWShowProgress(name) {
  var percentage = ((++completed) / benchmarks) * 100;
  var message = "Running, " + Math.round(percentage) + "% completed";
  PostTypedMessage('status', message);
}


function WWAddResult(name, result) {
  var text = name + ': ' + result;
  PostTypedMessage('result', text);
}


function WWAddError(name, error) {
  success = false;
  PostTypedMessage('error', name + ': ' + error);
}


function WWAddScore(score) {
  if (success) {
      PostTypedMessage('score', score);
  }
}


function RunV8Style() {
  WWShowProgress("benchmark");
  BenchmarkSuite.RunSuites({ NotifyStep: WWShowProgress,
                             NotifyError: WWAddError,
                             NotifyResult: WWAddResult,
                             NotifyScore: WWAddScore }); 
}

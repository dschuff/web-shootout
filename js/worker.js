

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
var benchmarks = 0;
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

// This function is duplicated in run.js but it has to run after loading
// all the individual benchmarks which is different at the CLI
function SetupSmallBenchmarks() {
  SetupBenchmark("Fannkuchredux", FannkuchBenchmark, 10, 490000);
  SetupBenchmark("Fasta", FastaBenchmark, 10000, 40779);
  SetupBenchmark("Revcomp", RevcompBenchmark, 0, 4944);
  SetupBenchmark("BinaryTrees", BinarytreesBenchmark, 15, 285180);
  SetupBenchmark("Knucleotide", KnucleotideBenchmark, 0, 113680);
  SetupBenchmark("Nbody", NbodyBenchmark, 1000000, 730000);
  SetupBenchmark("Spectralnorm", SpectralnormBenchmark, 350, 57758);
  SetupBenchmark("Pidigits", PidigitsBenchmark, 1000, 1050000);
  benchmarks = BenchmarkSuite.CountBenchmarks();
}

function RunShootoutStyle() {
  
}

function RunV8Style() {
  SetupSmallBenchmarks();
  WWShowProgress("benchmark");
  BenchmarkSuite.RunSuites({ NotifyStep: WWShowProgress,
                             NotifyError: WWAddError,
                             NotifyResult: WWAddResult,
                             NotifyScore: WWAddScore }); 
}

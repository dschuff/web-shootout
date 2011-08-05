// Copyright 2008 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


load('base.js');
load("fasta_10k_ref_output.js");
load('io_replacement.js');
load('biginteger.js');

load('fannkuchredux.js');
load('fasta.js');
load('revcomp.js');
load('binarytrees.js');
load('knucleotide.js');
load('nbody.js');
load('spectralnorm.js');
load('pidigits.js');

var success = true;

function PrintResult(name, result) {
  print(name + ': ' + result);
}


function PrintError(name, error) {
  PrintResult(name, error);
  success = false;
}


function PrintScore(score) {
  if (success) {
    print('----');
    print('Score (version ' + BenchmarkSuite.version + '): ' + score);
  }
}

// This function is duplicated in worker.js but it has to run after loading
// all the individual benchmarks which is different in the browser
function SetupSmallBenchmarks() {
  SetupBenchmark("Fannkuchredux", FannkuchBenchmark, 10, 490000);
  SetupBenchmark("Fasta", FastaBenchmark, 10000, 40779);
  SetupBenchmark("Revcomp", RevcompBenchmark, 0, 4944);
  SetupBenchmark("Binarytrees", BinarytreesBenchmark, 15, 285180);
  SetupBenchmark("Knucleotide", KnucleotideBenchmark, 0, 113680);
  SetupBenchmark("Nbody", NbodyBenchmark, 1000000, 730000);
  SetupBenchmark("Spectralnorm", SpectralnormBenchmark, 350, 57758);
  SetupBenchmark("Pidigits", PidigitsBenchmark, 1000, 1050000);
}

SetupSmallBenchmarks();

BenchmarkSuite.RunSuites({ NotifyResult: PrintResult,
                           NotifyError: PrintError,
                           NotifyScore: PrintScore });

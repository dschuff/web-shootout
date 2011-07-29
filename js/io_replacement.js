// Shootout benchmarks use 'print' and 'readline' to read/write stdin/stdout.
// We redefine print to capture the output.
// Benchmarks which use print must call InitializePrint, call print,
// and then call VerifyOutput with the appropriate argument

load("fasta_10k_ref_output.js");

var fasta_output = "";
var fasta_output_array;

var print_output;
var real_print = print;
function fake_print(s) {
  print_output.push(s);
}
function InitializePrint() {
  print_output = new Array();
  print = fake_print;
}
function CleanupPrint() {
  print = real_print;
}  
function VerifyOutput(ref_input, keep_fasta_output) {

  var output = print_output.join("\n");

  if(!ref_input) return;
  if(ref_input != output) {
    print("Error, expected\n");
    print(ref_input);
    print("got\n");
    print(output);
    throw "error";
  }
  if (keep_fasta_output) {
    fasta_output = output;
    fasta_output_array = fasta_output.split("\n");
  }
  //print(output);
}

// Several benchmarks use the output of fasta as their input.
// We replace readline with a function that reads from this reference data
var start_index = 0;
var real_readline = readline;

function readline_string() {//doesn't work?
  next = fasta_output.indexOf("\n", start_index);
  str = fasta_output.substr(start_index, next - start_index);
  start_index = next;
  return str;
}

function readline_array() {
  s = fasta_output_array[start_index];
  start_index += 1;
  return s;
}
function reset_readline_start() {
  start_index = 0;
}

function InitializeReadline() {
  readline = readline_array;
  reset_readline_start();
}

function CleanupReadline() {
  readline = real_readline;
  reset_readline_start();
}
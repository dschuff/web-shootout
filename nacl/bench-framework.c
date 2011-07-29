#include <assert.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/time.h>
#include "bench-framework.h"
#include "benchstringio.h"

/* Minimum benchmark runtime in us */
static const int kMinBenchRuntime = 1000000;
static int benchmark_count = 0;
static bench_info bench_info_list[MAX_BENCHMARKS];
static run_data bench_run_data[MAX_BENCHMARKS];

int RegisterBenchmark(char *name, bench_function entry, int time_ref, int param) {
  bench_info_list[benchmark_count].name = name;
  bench_info_list[benchmark_count].run = entry;
  bench_info_list[benchmark_count].time_ref = time_ref;
  bench_info_list[benchmark_count].param = param;
  benchmark_count++;
}

static int RunOne(bench_info *bench, run_data *data) {
  int runs;
  struct timeval start, end;
  int diff;
  /* run one iteration to warm up the cache (if v8 can JIT off the clock,
     then we can do this) */
  bench->run(bench->param);
  gettimeofday(&start, NULL);
  for (data->runs = 0; data->elapsed < kMinBenchRuntime || data->runs < 32;
       data->runs++) {
    assert(bench->run(bench->param) == 0);
    gettimeofday(&end, NULL);
    diff = (end.tv_sec - start.tv_sec) * 1000000 + (end.tv_usec - start.tv_usec);
    data->elapsed = diff;
  }
  return 0;
}

static int RunAll() {
  int i;
  for (i = 0; i < benchmark_count; i++) {
    run_data *rd = &bench_run_data[i];
    bench_info *bi = &bench_info_list[i];
    double usec_per_run;
    printf("Running %s\n", bi->name);
    RunOne(bi, rd);
    usec_per_run = (double)rd->elapsed / (double)rd->runs;
    rd->score = 100.0 * bi->time_ref / usec_per_run;
  }
}

static int PrintScores() {
  int i;
  for (i = 0; i < benchmark_count; i++) {
    printf("Benchmark %s: usec %d, iters %d, usec/run %d score %.2f\n", 
           bench_info_list[i].name,
           bench_run_data[i].elapsed,
           bench_run_data[i].runs,
           bench_run_data[i].elapsed / bench_run_data[i].runs,
           bench_run_data[i].score);
  }
}

static double GeometricMean() {
  int i;
  double log_total = 0.0;
  for (i = 0; i < benchmark_count; i++) {
    log_total += log(bench_run_data[i].score);
  }
  return pow(M_E, log_total / benchmark_count);
}

int main(int argc, char *argv[]) {
  memset(bench_info_list, 0, sizeof(bench_info_list));
  memset(bench_run_data, 0, sizeof(bench_run_data));

#ifdef ARRAYFILE
  arrayfile_stdout = arrayfile_fopen("arrayfile", "w");
  assert(arrayfile_stdout);
#endif

  RegisterBenchmark(strdup("fannkuchredux"), run_fannkuch, 500000, 10);
  RegisterBenchmark(strdup("fasta"), run_fasta, 40400, 10000);
  RegisterBenchmark(strdup("revcomp"), run_revcomp, 4100, 0);
  RegisterBenchmark(strdup("binarytrees"), run_binarytrees, 294000, 15);
  RegisterBenchmark(strdup("knucleotide"), run_knucleotide, 116000, 0);
  RegisterBenchmark(strdup("nbody"), run_nbody, 730000, 1000000);
  RegisterBenchmark(strdup("spectralnorm"), run_spectralnorm, 57471, 350);
  RegisterBenchmark(strdup("pidigits"), run_pidigits, 1000000, 1000);


  fasta_10k_ref_output_len = strlen(fasta_10k_ref_output);

  printf("%d benchmarks registered\n", benchmark_count);
  RunAll();
  PrintScores();
  printf("Aggregate score: %d\n", (int) GeometricMean());
  return 0;
}


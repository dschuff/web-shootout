#ifndef BENCHFRAMEWORK_H
#define BENCHFRAMEWORK_H

#define MAX_BENCHMARKS 8

typedef int (*bench_function)(int);
typedef int (*report_function)(char *, ...);

typedef struct _bench_info {
  char *name;
  bench_function run;
  int time_ref;
  int param;
} bench_info;

typedef struct {
  int runs;    /* number of iterations run */
  int elapsed; /* elapsed time in ms for run */
  double score;   /* score for run */
} run_data;

int RegisterBenchmark(char *name, bench_function entry, int time_ref, int param);

extern const char *fasta_10k_ref_output;
extern int fasta_10k_ref_output_len;
extern char *fasta_output;
extern int fasta_output_len;

/* Benchmark entry points */
int run_fannkuch(int p);
int run_fasta(int p);
int run_revcomp(int ignored);
int run_binarytrees(int p);
int run_knucleotide(int ignored);
int run_nbody(int p);
int run_pidigits(int p);
int run_spectralnorm(int p);

int framework_main();
void ReportStatus(const char *format, ...);

//#define memcpy(d, s, n)    __builtin_memcpy ((d), (s), (n))

#endif

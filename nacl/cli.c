/* A main function for running the benchmarks under sel_ldr */

#include <stdarg.h>
#include <stdio.h>
#include "bench-framework.h"

int main(int argc, char **argv) {
  framework_main(kBenchmarkSmall);
  framework_main(kBenchmarkLarge);
}

void ReportStatus(const char *format, ...) {
  va_list ap;
  va_start(ap, format);
  vprintf(format, ap);
  va_end(ap);
  printf("\n");
}

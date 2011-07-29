NACL_SDK ?= /ulg/native_client_sdk_0_5_984
# NACL_SVN_PATH only needed if we want to build with glibc
NACL_SVN_PATH ?= /ulg/naclgit/native_client
CC = gcc
CXX = g++
BITS ?= 32
LIB ?= newlib


ifeq ($(BITS), 64)
  NACL_CC_BASE = x86_64-nacl
  ARCH_FLAG = -m64
  PNACL_ARCH = x86-64
else
  NACL_CC_BASE = i686-nacl
  ARCH_FLAG = -m32
  PNACL_ARCH = x86
endif

ifeq ($(LIB),glibc)
  NACL_CC_PATH = $(NACL_SVN_PATH)/toolchain/linux_x86/bin
else
  NACL_CC_PATH = $(NACL_SDK)/toolchain/linux_x86/bin
endif

NACLCC = $(NACL_CC_PATH)/$(NACL_CC_BASE)-gcc
NACLCXX = $(NACL_CC_PATH)/$(NACL_CC_BASE)-g++
CCFLAGS ?= -O3 -g -mfpmath=sse -msse3 -march=nocona
CFLAGS = $(CCFLAGS) -std=gnu99
CXXFLAGS = $(CCFLAGS)
LIBS = -lm -lpthread
LIBDIR = ../third_party/libinstall/$(BITS)/lib


BENCHMARKS := fannkuchredux fasta revcomp binarytrees knucleotide nbody \
		spectralnorm pidigits
OTHER_OBJS = bench-framework benchstringio fasta_10k_ref_output

OBJS_NATIVE := $(BENCHMARKS:%=%.native.o) $(OTHER_OBJS:%=%.native.o)
OBJS_NACL := $(BENCHMARKS:%=%.nacl.o) $(OTHER_OBJS:%=%.nacl.o)
OBJS_PNACL := $(BENCHMARKS:%=%.bc) $(OTHER_OBJS:%=%.bc)

all: native

%.native.o: %.c
	$(CC) $(ARCH_FLAG) -Iinclude -c $(CFLAGS) $< -o $@
%.native.o: %.cc
	$(CXX) $(ARCH_FLAG) -Iinclude -c $(CXXFLAGS) $< -o $@
%.nacl.o: %.c
	$(NACLCC) -c -Iinclude $(CFLAGS) $< -o $@
%.nacl.o: %.cc
	$(NACLCXX) -c -Iinclude $(CXXFLAGS) $< -o $@
%.bc: %.c
	pnacl-gcc -c $(CFLAGS) $< -o $@

native: $(OBJS_NATIVE)
	$(CXX) $(ARCH_FLAG) $(OBJS_NATIVE) -o benchmarks$(BITS) $(LIBS) -lgmp

nacl: $(OBJS_NACL)
	$(NACLCXX) $(OBJS_NACL) -o benchmarks$(BITS).nexe -L$(LIBDIR) -lgmp $(LIBS)
#	$(NACLCXX) $(OBJS_NACL) -o benchmarks$(BITS).nexe -L$(LIBDIR) $(LIBS) -lgmp -ltcmalloc_minimal -lpthread

pnacl: $(OBJS_PNACL)
	pnacl-g++ $(OBJS_PNACL) -o benchmarks.pexe -ltcmalloc_minimal -lpthread
	pnacl-opt -std-link-opts -disable-internalize benchmarks.pexe -o benchmarks.pexe
	pnacl-translate -arch $(PNACL_ARCH) benchmarks.pexe -o benchmarks_pnacl.nexe

clean-native:
	rm -f $(OBJS_NATIVE) benchmarks32 benchmarks64
clean-nacl:
	rm -f $(OBJS_NACL) benchmarks$(BITS).nexe
clean-pnacl:
	rm -f $(OBJS_PNACL) *.pexe benchmarks_pnacl.nexe *.ll *-.o
clean: clean-native clean-nacl


run-native:
	./benchmarks$(BITS)
run-nacl:
	$(NACL_CC_PATH)/sel_ldr_x86_$(BITS) -a benchmarks$(BITS).nexe

.PHONY: clean-native clean-nacl clean-pnacl run-native run-nacl

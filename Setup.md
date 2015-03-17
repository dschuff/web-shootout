# Introduction #

Building and running requires several bits:
To build and run NaCl modules at the command line, use the Native Client SDK: http://code.google.com/chrome/nativeclient/
To run Javascript at the command line, use `d8`, the V8 debugger: http://code.google.com/p/v8/ (build the d8 target with scons).
To build a native version you need the GNU MP library, libgmp installed on your host system.

# Details #

  * Get the source as described on the Source checkout page
  * Edit the scons file (or scons.bat on Windows)
    1. Change the line `export NACL_SDK_ROOT=/path/to/naclsdk` to point to your NaCl SDK install
  * Build the libraries for nacl (optional, currently only works on Linux and Mac)
    1. `cd web-shootout`
    1. `./shootout_libs.sh`
    * For pnacl, also do `NACL_CC=pnacl ./shootout_libs.sh`
    1. Check out naclports (from http://code.google.com/p/naclports/) and build FFTW (after you check it out, `cd src; make fftw`)
    * Also do `make clean; NACL_PACKAGES_BITSIZE=64 make fftw` and `make clean; NACL_PACKAGES_BITSIZE=pnacl make fftw`
  * Build the benchmarks
    1. `cd web-shootout/nacl`
    1. To build NaCl versions: `make BITS=<32|64> nacl pexe arm`
    1. To run, `make run-nacl`, `make run-pnacl`
    1. To build native version with local gcc (optional, only works on Linux and Mac): `make native && make run-native`
  * To run the JS benchmark at the command line:
    1. `cd web-shootout/js`
    1. `/path/to/d8 run.js`
  * To run the tests in the browser
    1. `cd web-shootout`
    1. `python httpd.py`
    1. Point the browser to http://localhost:5103/run.html
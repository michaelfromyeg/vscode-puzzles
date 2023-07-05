#!/bin/bash

# Build the source code, and build the Docker image.
# USAGE: `bash build.sh`

pushd ..
npm run build
popd

docker image build .. -f ../Dockerfile -t michaelfromyeg/puzzles

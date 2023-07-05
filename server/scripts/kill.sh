#!/usr/bin/bash

# Kill the Docker container. Assumes only one container is currently running.
# USAGE: `bash kill.sh`

ID=$(docker ps -a -q)
docker kill $ID

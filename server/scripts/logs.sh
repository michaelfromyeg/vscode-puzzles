#!/usr/bin/bash

# Follow logs for the Docker container. Assumes only one container is currently running.
# USAGE: `bash logs.sh`

ID=$(docker ps -a -q)
docker logs $ID -f

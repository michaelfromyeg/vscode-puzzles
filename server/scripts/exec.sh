#!/bin/bash

# Access the Docker container. Assumes only one container is currently running.
# USAGE: `bash exec.sh`

ID=$(docker ps -a -q)
docker exec -it $ID /bin/bash

#!/bin/bash

# Connect to the EC2 instance. Requires the corresponding key file.
# USAGE: `bash ec2.sh`

ssh -i ../vscode-puzzles.pem ec2-user@35.160.181.207

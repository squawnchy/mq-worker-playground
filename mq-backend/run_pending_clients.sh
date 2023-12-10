#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Usage: $0 <number of clients>"
    exit 1
fi

for ((n=0;n<$1;n++))
do
    node ./client.js &
done

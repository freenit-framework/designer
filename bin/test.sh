#!/bin/sh


BIN_DIR=`dirname $0`
. "${BIN_DIR}/common.sh"
setup
"${BIN_DIR}/components.sh"

echo "Frontend"
echo "========"
env CI=true npm run test

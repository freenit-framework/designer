#!/bin/sh


BIN_DIR=`dirname $0`
. "${BIN_DIR}/common.sh"
setup
"${BIN_DIR}/components.sh"

echo "Frontend"
echo "========"
env BACKEND_URL=${BACKEND_URL} npm run dev -- --host 0.0.0.0

#!/bin/sh


BIN_DIR=`dirname $0`
. "${BIN_DIR}/common.sh"
setup

echo "Frontend"
echo "========"
env BACKEND_URL=${BACKEND_URL} ${PACKAGE_MANAGER} dev -- --host 0.0.0.0

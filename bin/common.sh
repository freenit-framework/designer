#!/bin/sh


export BIN_DIR=`dirname $0`
export PROJECT_ROOT="${BIN_DIR}/.."
export OFFLINE=${OFFLINE:=no}


setup() {
  cd ${PROJECT_ROOT}
  update=${1}
  if [ "${OFFLINE}" != "yes" -a "${update}" != "no" ]; then
    npm install
  fi
}

#!/bin/sh


export BIN_DIR=`dirname $0`
export PROJECT_ROOT="${BIN_DIR}/.."
export OFFLINE=${OFFLINE:=no}
NPM=`which npm 2>/dev/null`
YARN=`which yarn 2>/dev/null`


if [ ! -z "${NPM}" ]; then
  export PACKAGE_MANAGER="${NPM}"
else
  export PACKAGE_MANAGER="${YARN}"
fi


setup() {
  if [ -z "${PACKAGE_MANAGER}" ]; then
    echo "Install npm or yarn" >&2
    exit 1
  fi

  cd ${PROJECT_ROOT}
  update=${1}
  if [ "${OFFLINE}" != "yes" -a "${update}" != "no" ]; then
    "${PACKAGE_MANAGER}" install
  fi
}

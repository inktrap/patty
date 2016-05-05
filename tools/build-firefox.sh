#!/bin/zsh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/.."
EXT_DIR=${DIR}/
EXT_NAME=patty
MANIFEST=${DIR}/manifest.json
DEFAULT_MANIFEST=${DIR}/manifest.default
FIREFOX_MANIFEST=${DIR}/manifest.firefox
BROWSER=firefox
EXT=xpi
PORT=8888
RELEASE_DIR=release
DATE=$(date +%Y-%m-%d_%H%M%S)

if [[ ! -d $EXT_DIR ]]; then
    echo "Directory does not exist"
    exit 1
fi

if [[ ! -f $DEFAULT_MANIFEST || -z $DEFAULT_MANIFEST ]]; then
    echo "No default manifest found. Create ${DEFAULT_MANIFEST}. Goodbye."
    exit 1
fi

if [[ -f $MANIFEST ]]; then
    rm "$MANIFEST"
fi

set -x
jq -s add $FIREFOX_MANIFEST $DEFAULT_MANIFEST > $MANIFEST
set +x
OUTFILE=${DIR}/${RELEASE_DIR}/${EXT_NAME}_${BROWSER}_${DATE}.${EXT}
cd "$EXT_DIR" && zip -r "${OUTFILE}" ./* -x ./release/\* ./image/\* ./manifest.firefox ./manifest.default ./tools/\* && cd "$DIR"

if [[ $DEV == true ]]; then
    curl -4 --data-binary "@${OUTFILE}" -H 'Expect:' "http://127.0.0.1:${PORT}/"
fi
#wget -4 --post-file=${OUTFILE} http://localhost:${PORT}/


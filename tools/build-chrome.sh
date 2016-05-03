#!/bin/zsh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/.."
EXT_DIR=${DIR}/
EXT_NAME=patty
MANIFEST=${DIR}/manifest.json
DEFAULT_MANIFEST=${DIR}/${1}/manifest.default
BROWSER=chrome
EXT=zip
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
cp "$DEFAULT_MANIFEST" "$MANIFEST"

OUTFILE=${DIR}/${RELEASE_DIR}/${EXT_NAME}_${BROWSER}_${DATE}.${EXT}

cd "$EXT_DIR" && zip -r "${OUTFILE}" ./* -x ./release/\* && cd "$DIR"


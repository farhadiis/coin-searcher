#!/bin/sh
exec gosu "${SERVICE_USER}:${SERVICE_GROUP}" node ./src/index.js
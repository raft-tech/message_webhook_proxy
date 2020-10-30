#!/bin/bash
#
#   usage: ./build_n_deploy or ./build_n_deploy cache
#
#   requires: LOCAL_TAG, PROXY_APP_NAME and REPO as environment variables
#

# start the build process, default to using cache
echo "Starting Build process"
if [ -z "$1" ]; then
  docker build --no-cache -t $LOCAL_TAG .
else
  docker build -t $LOCAL_TAG .
fi

# tagging
echo "Tagging"
docker tag $LOCAL_TAG registry.heroku.com/$PROXY_APP_NAME/web

# push image
echo "Pushing"
docker push $REPO/$PROXY_APP_NAME/web

# trigger a release
echo "Realse"
heroku container:release web -a $PROXY_APP_NAME

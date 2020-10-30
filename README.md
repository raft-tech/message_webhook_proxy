# Raft Mattermost Bot Proxy

A Mattermost proxy that is deployable as a [Docker]() container to Heroku

## Setting up
Before you start, you will need to complete a few tasks.

### Create a Bot
Follow [Mattermost documentation](https://docs.mattermost.com/developer/bot-accounts.html#bot-account-creation) to cereate one.

### Create a Bot Acess Token
Create an `bot access token` and add the bot a team and channel before it will be able to post messages. When you create a bot, you will see a `Token ID`. That is **NOT** what you are looking for. Click on `Create New Token` and type in a description. This will create an `Access Token` and a warning message urging you to copy it. That is the one you are looking for.


### Getting the channel_id
The most challenging aspect is retrieving the `channel_id`. In order for the bot to be able to post messages you need the `channel_id` not `name`. To do so, use dev tools in browser and click on the `Members` button. In the network tab, you should be able to find a request similar to

```
<mattermost_url>/api/v4/users?in_channel=1oy45tbdjpej5pftygr6be7k1c&page=0&per_page=100&sort=status
```

You are looking for the value for `in_channel`. In this case, `1oy45tbdjpej5pftygr6be7k1c`. (There are many other ways to do this, including some fancy API calls).


## Running

### Localhost
```sh
#checkout code base
git clone ...
cd ...

# install dependencies
npm install

# environment variables
MM_URL="<mattermost_url>/api/v4/posts"
MM_PROXY_USERNAME="<bot_name>"
MM_PROXY_TOKEN="<bot_access_token>"

# start the server
npm start

# health test
curl localhost:3000/

# post message
curl localhost:3000/post/channel/<channel_id>/msg/<message>
```

#### Devlopment
Running in development mode with [`nodemon`]() so that the server reloads on file changes.
```sh
 npm run-script dev
```

#### Testing
Unit tests for the API endpoints is written in [`mocha`]() and levargaes the [`chai`]() and [`chaiHttp`]() node modules.
```sh
npm test
```

### Docker

#### Build
```sh
# tag and build image
LOCAL_TAG='mm_proxy_server'
docker build -t $LOCAL_TAG .

# running container locally
docker run -p 3000:3000 \
  -e MM_URL='' \
  -e MM_PROXY_USERNAME='' \
  -e MM_PROXY_TOKEN='' \
  $LOCAL_TAG
```

### Deploy to Heroku
```sh
# environment config
REPO='registry.heroku.com'
PROXY_APP_NAME='' # from heroku

# tag image
docker tag $LOCAL_TAG registry.heroku.com/$PROXY_APP_NAME/web && \

# push to repo
docker push $REPO/$PROXY_APP_NAME/web && \

# trigger a release
heroku container:release web -a $PROXY_APP_NAME

# Tail the logs:
heroku logs -a $PROXY_APP_NAME --tail
```

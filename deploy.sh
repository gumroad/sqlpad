#!/bin/bash
echo "Building new docker image."
docker build -t=sqlpad --rm=true .
docker save -o sqlpad.tar sqlpad
tar -czvf sqlpad.tar.gz sqlpad.tar

echo "Sending docker image to remote."
scp sqlpad.tar.gz $USER@$REMOTE_HOST_ADDRESS:/tmp

echo "Checking for old image"
ssh $USER@$REMOTE_HOST_ADDRESS "docker ps | grep sqlpad-instance"

if [$? -eq 0]; then
    echo "Deleting old image"
    ssh $USER@$REMOTE_HOST_ADDRESS "docker stop sqlpad-instance"
    ssh $USER@$REMOTE_HOST_ADDRESS "docker rm sqlpad-instance"
    ssh $USER@$REMOTE_HOST_ADDRESS "docker rmi sqlpad"
fi

echo "Importing image"
ssh $USER@$REMOTE_HOST_ADDRESS "cd /tmp && tar -xzvf /tmp/sqlpad.tar.gz"
ssh $USER@$REMOTE_HOST_ADDRESS "docker load < /tmp/sqlpad.tar"

if [$? -eq 0]; then
    echo "Running container"
    # These env variables come from your own machine, not the remote
    ssh $USER@$REMOTE_HOST_ADDRESS "docker run --name sqlpad-instance -p 4000:8080 -e GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID -e GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET -e PUBLIC_URL=$PUBLIC_URL -v /home/s_sqlpad/db:/sqlpad/db sqlpad"

    if [$? -eq 0]; then 
        echo "Removing temp files."
        rm sqlpad.tar
        rm sqlpad.tar.gz
        ssh $USER@$REMOTE_HOST_ADDRESS "rm /tmp/sqlpad.tar.gz"
        ssh $USER@$REMOTE_HOST_ADDRESS "rm /tmp/sqlpad.tar"
    fi
fi


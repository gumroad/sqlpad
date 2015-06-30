# !/bin/bash +ex
echo "Building new docker image."
docker build -t=sqlpad --rm=true .
docker save -o sqlpad.tar sqlpad
tar -czvf sqlpad.tar.gz sqlpad.tar

echo "Sending docker image to remote."
scp sqlpad.tar.gz $USER@$REMOTE_HOST_ADDRESS:/tmp

echo "Checking for old image"
if ssh $USER@$REMOTE_HOST_ADDRESS "docker ps | grep sqlpad-instance &>/dev/null"; then
    echo "Deleting old image"
    ssh $USER@$REMOTE_HOST_ADDRESS "docker stop sqlpad-instance"
    ssh $USER@$REMOTE_HOST_ADDRESS "docker rm sqlpad-instance"
    ssh $USER@$REMOTE_HOST_ADDRESS "docker rmi sqlpad"
fi

echo "Importing image"
ssh $USER@$REMOTE_HOST_ADDRESS "cd /tmp && tar -xzvf /tmp/sqlpad.tar.gz"


if ssh $USER@$REMOTE_HOST_ADDRESS "docker load < /tmp/sqlpad.tar"; then
    echo "Running container"
    if ssh $USER@$REMOTE_HOST_ADDRESS "docker run -d --name sqlpad-instance -p 4000:8080 \
                                                  -e GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID \
                                                  -e GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET \
                                                  -e PUBLIC_URL=$PUBLIC_URL \
                                                  -e DISABLE_USERPASS_AUTH=true \
                                                  --restart=on-failure:3 \
                                                  -v /home/s_sqlpad/db:/sqlpad/db sqlpad"; then 
        echo "Removing temp files."
        rm sqlpad.tar
        rm sqlpad.tar.gz
        ssh $USER@$REMOTE_HOST_ADDRESS "rm /tmp/sqlpad.tar.gz"
        ssh $USER@$REMOTE_HOST_ADDRESS "rm /tmp/sqlpad.tar"
    fi
fi


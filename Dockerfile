FROM ubuntu

# Download Node.js
RUN apt-get update && apt-get install -y \
    nodejs \
    npm

# Symlink nodejs to node
RUN sudo ln -s `which nodejs` /usr/bin/node 

# Add Files
RUN mkdir app
ADD . /app

# Install dependencies
RUN cd app; npm install

EXPOSE 8080

CMD ["sh", "-c", "/usr/bin/node app/server.js --db /sqlpad/db --port 8080"]

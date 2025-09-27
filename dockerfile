# base image
FROM node:current-alpine3.21

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY package.json .
RUN npm install
RUN npm install react-scripts -g

# start app
CMD ["npm", "run", "start"] 
# pull official base image
# FROM node:13.12.0-alpine

# RUN mkdir -p /august

# WORKDIR /august

# ENV PATH /august/node_modules/.bin:$PATH

# # install app dependencies
# COPY package.json ./
# COPY package-lock.json ./
# RUN npm install --silent
# RUN npm install react-scripts@3.4.1 -g --silent

# # add app
# EXPOSE 3000

# # start app
# CMD ["nodemon", "--exec", "npm", "start"]

FROM node:17-alpine

RUN mkdir -p /august

WORKDIR /august

ENV PATH /august/node_modules/.bin:$PATH

COPY package.json ./

# COPY package-lock.json ./

RUN npm install --silent

EXPOSE 3000

CMD ["nodemon", "--exec", "npm", "start"]
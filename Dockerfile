#STAGE 1
FROM node:latest AS build
# install angular cli to run ng-build
WORKDIR /usr/src/app
RUN npm i @angular/cli

# copy all file to build the app
WORKDIR /usr/src
# copy LIBS to npm/ folder
COPY npm/lbox-shared.tgz npm/lbox-auth.tgz ./npm/
# copy package.json to app/ folder
COPY LBox.App.Base/package.json LBox.App.Base/package-lock.json ./app/
# run `npm install` in app/ folder
WORKDIR /usr/src/app
RUN npm install
COPY LBox.App.Base/. .
RUN npm run build-prod

#STAGE 2
FROM nginx:latest
COPY LBox.App.Base/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/lbox-app-base /usr/share/nginx/html

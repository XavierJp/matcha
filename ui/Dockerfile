# build stage
FROM node:16.13.1-stretch as build

ARG REACT_APP_BASE_URL
ARG REACT_APP_METABASE_URL

ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL
ENV REACT_APP_METABASE_URL=$REACT_APP_METABASE_URL

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . ./
RUN yarn build

# run stage
FROM node:16.13.1-alpine
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
RUN yarn global add local-web-server
EXPOSE 3000
CMD ["yarn", "serve"]
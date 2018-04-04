#!/bin/sh

docker kill iot_mongo; docker run --restart=always --name iot_mongo -d -p 27017:27017 mongo
docker run --restart=always --link iot_mongo:mongo -p 8081:8081 -d mongo-express

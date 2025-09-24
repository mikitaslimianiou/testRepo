#!/bin/bash
set -e

cd /testRepo/app/index.js

docker compose up -d

# Get the container ID for the 'nginx' service
NGINX_CONTAINER_ID=$(docker compose ps -q nginx)

# If the container is running, reload nginx inside it
if [ -n "$NGINX_CONTAINER_ID" ]; then
  docker exec "$NGINX_CONTAINER_ID" nginx -s reload || true
fi

#!/bin/bash
set -e

cd /testRepo/app/index.js

# Run docker compose down, ignore errors if not running
docker compose down || true

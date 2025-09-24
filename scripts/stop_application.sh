#!/bin/bash
set -e

cd /absolute path to your app

# Run docker compose down, ignore errors if not running
docker compose down || true

#!/bin/bash
set -e

cd /testRepo/app

# Run docker compose down, ignore errors if not running
docker compose down || true

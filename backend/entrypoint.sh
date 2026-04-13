#!/bin/bash
set -e

echo "🚀 Démarrage de l'API SMM..."
exec gunicorn --bind 0.0.0.0:5000 --reload "app:create_app()"cd
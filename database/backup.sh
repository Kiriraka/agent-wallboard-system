#!/bin/bash

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "💾 Creating backup..."

# Backup SQLite
echo "📊 Backing up SQLite..."
cp sqlite/wallboard.db "$BACKUP_DIR/"

# Backup MongoDB
echo "🍃 Backing up MongoDB..."
mongodump --db wallboard --out "$BACKUP_DIR/mongodb" --quiet

echo ""
echo "✅ Backup completed!"
echo "📁 Location: $BACKUP_DIR"
echo ""
ls -lh "$BACKUP_DIR"
#!/bin/bash

# check if git remote exists
if ! git config remote.origin.url > /dev/null; then
    echo "⚠️  No GitHub repository linked yet!"
    echo "1. Go to https://github.com/new"
    echo "2. Name your repository 'EasyRecco'"
    echo "3. Click 'Create repository'"
    echo "4. Copy the HTTPS URL (it looks like https://github.com/YourName/EasyRecco.git)"
    echo ""
    read -p "Paste the URL here: " REPO_URL
    git remote add origin "$REPO_URL"
    git branch -M main
    echo "✅ Linked to $REPO_URL"
fi

echo "🚀 Publishing updates..."
git add .
git commit -m "Update from EasyRecco"
git push -u origin main

echo ""
echo "✅ Done! Your changes are on GitHub."
echo "If this is your first time, go to your Repository Settings -> Pages -> Source, and select 'main' branch."

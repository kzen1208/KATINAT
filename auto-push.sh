#!/bin/bash

# Auto push changes to GitHub
# Usage: ./auto-push.sh "Your commit message"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if commit message is provided
if [ -z "$1" ]
  then
    echo -e "${YELLOW}Please provide a commit message${NC}"
    echo "Usage: ./auto-push.sh \"Your commit message\""
    exit 1
fi

# Get current branch
BRANCH=$(git symbolic-ref --short HEAD)
echo -e "${GREEN}Current branch: $BRANCH${NC}"

# Add all changes
echo -e "${GREEN}Adding all changes...${NC}"
git add .

# Commit changes
echo -e "${GREEN}Committing changes with message: $1${NC}"
git commit -m "$1"

# Push changes
echo -e "${GREEN}Pushing changes to origin/$BRANCH...${NC}"
git push origin $BRANCH

echo -e "${GREEN}Done! Changes pushed to GitHub.${NC}"
echo -e "${YELLOW}GitHub Actions will automatically deploy your changes.${NC}"
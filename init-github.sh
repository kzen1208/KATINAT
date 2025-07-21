#!/bin/bash

# Initialize GitHub repository and set up auto-deployment
# Usage: ./init-github.sh [repository-name]

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default repository name
REPO_NAME=${1:-"katinat-coffee"}

echo -e "${YELLOW}Initializing GitHub repository: $REPO_NAME${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git is not installed. Please install git first.${NC}"
    exit 1
fi

# Check if .git directory exists
if [ -d ".git" ]; then
    echo -e "${YELLOW}Git repository already initialized.${NC}"
else
    # Initialize git repository
    echo -e "${GREEN}Initializing git repository...${NC}"
    git init
fi

# Check if remote origin exists
if git remote | grep -q "origin"; then
    echo -e "${YELLOW}Remote origin already exists.${NC}"
else
    # Add remote origin
    echo -e "${GREEN}Adding remote origin...${NC}"
    echo -e "${YELLOW}Please create a GitHub repository named '$REPO_NAME' if you haven't already.${NC}"
    read -p "Enter your GitHub username: " GITHUB_USERNAME
    
    if [ -z "$GITHUB_USERNAME" ]; then
        echo -e "${RED}GitHub username cannot be empty.${NC}"
        exit 1
    fi
    
    git remote add origin "https://github.com/kzen1208/KATINAT"
    echo -e "${GREEN}Remote origin added: https://github.com/$GITHUB_USERNAME/$REPO_NAME.git${NC}"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo -e "${GREEN}Creating .gitignore file...${NC}"
    cat > .gitignore << EOL
# Dependencies
node_modules/
npm-debug.log
yarn-error.log
yarn-debug.log
package-lock.json

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# OS files
.DS_Store
Thumbs.db

# IDE files
.idea/
.vscode/
*.sublime-project
*.sublime-workspace

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache
EOL
fi

# Initial commit if needed
if ! git log -1 &> /dev/null; then
    echo -e "${GREEN}Creating initial commit...${NC}"
    git add .
    git commit -m "Initial commit"
fi

# Push to GitHub
echo -e "${GREEN}Pushing to GitHub...${NC}"
echo -e "${YELLOW}You may be prompted to enter your GitHub credentials.${NC}"
git push -u origin main || git push -u origin master

echo -e "${GREEN}Done! Repository initialized and pushed to GitHub.${NC}"
echo -e "${YELLOW}You can now use ./auto-push.sh or npm run auto-update to automatically push changes.${NC}"
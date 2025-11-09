# GitHub Workflow Guide

## Repository Information
- **Repository Name**: Playbook
- **Owner**: Drfiya
- **URL**: https://github.com/Drfiya/Playbook
- **Branch**: main

## Current Status
✅ All files successfully pushed to GitHub
✅ Repository configured with proper remote
✅ Branch tracking set up

## Making Changes and Pushing to GitHub

### Step 1: Make Your Changes
Edit files as needed in the `/home/user/webapp/` directory.

### Step 2: Check Status
```bash
cd /home/user/webapp
git status
```

This shows which files have been modified.

### Step 3: Stage Changes
```bash
# Stage all changes
git add .

# Or stage specific files
git add src/data/fullChapters.js
git add README.md
```

### Step 4: Commit Changes
```bash
git commit -m "Your descriptive commit message"
```

**Good commit message examples:**
- `"Add full content for Chapter 2"`
- `"Fix bug in progress tracking"`
- `"Update chapter navigation styling"`
- `"Add new exercise for Chapter 5"`

### Step 5: Push to GitHub
```bash
git push origin main
```

## Quick Command Reference

### View Commit History
```bash
git log --oneline -10  # Last 10 commits
```

### Check Remote Status
```bash
git remote -v  # View configured remotes
```

### Pull Latest Changes (if needed)
```bash
git pull origin main
```

### Discard Local Changes
```bash
git checkout -- filename  # Discard changes to specific file
git reset --hard  # Discard ALL local changes (careful!)
```

## Common Workflows

### Adding New Chapter Content
```bash
cd /home/user/webapp

# Edit the file
# (edit src/data/fullChapters.js)

# Stage, commit, and push
git add src/data/fullChapters.js
git commit -m "Add full content for Chapter 3"
git push origin main
```

### Updating Multiple Files
```bash
cd /home/user/webapp

# Make your edits to multiple files

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Update chapter formatting and add new exercises"

# Push to GitHub
git push origin main
```

### Creating a Backup Before Major Changes
```bash
cd /home/user/webapp

# Create a new branch for experiments
git checkout -b experimental-feature

# Make your changes
# ...

# Commit changes to experimental branch
git add .
git commit -m "Testing new feature"

# Push experimental branch
git push origin experimental-feature

# Switch back to main when done
git checkout main
```

## Troubleshooting

### Push Rejected (Remote has changes)
```bash
# Pull latest changes first
git pull origin main

# Resolve any conflicts if they occur
# Then push again
git push origin main
```

### Forgot to Stage Files
```bash
# Stage the forgotten files
git add forgotten-file.js

# Amend the last commit
git commit --amend --no-edit

# Force push (only if you haven't shared this commit yet)
git push origin main --force
```

### View Changes Before Committing
```bash
git diff  # See unstaged changes
git diff --staged  # See staged changes
```

## Best Practices

1. **Commit frequently** - Small, focused commits are easier to manage
2. **Write clear commit messages** - Describe what changed and why
3. **Pull before pushing** - Always get latest changes first
4. **Test before committing** - Build and test your changes locally
5. **Don't commit sensitive data** - API keys, passwords, etc. should be in .gitignore

## Authentication

GitHub authentication is already set up via `setup_github_environment`. You don't need to enter credentials manually. The system uses secure token-based authentication.

If you encounter authentication issues, re-run:
```bash
# This is typically done automatically, but you can run manually if needed
setup_github_environment
```

## Files in Repository

Your repository now contains:
- ✅ All source code (`src/`)
- ✅ Configuration files (`package.json`, `vite.config.js`, etc.)
- ✅ Documentation (`README.md`, `CONTENT_UPDATE_GUIDE.md`)
- ✅ Build configuration (`tailwind.config.js`, `postcss.config.js`)
- ✅ Git configuration (`.gitignore`)
- ✅ PM2 configuration (`ecosystem.config.cjs`)

## Next Steps

1. Visit https://github.com/Drfiya/Playbook to see your repository
2. Make changes locally as needed
3. Follow the workflow above to push updates
4. Your code is now safely backed up and version controlled!

---

**Quick Reference Card:**
```bash
# The three essential commands for most updates:
git add .                          # Stage all changes
git commit -m "Your message"       # Commit changes
git push origin main               # Push to GitHub
```
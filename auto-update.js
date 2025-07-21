const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

// Configuration
const config = {
  watchPaths: ['./**/*.html', './**/*.css', './**/*.js', './img/**/*', './logo/**/*'],
  ignorePaths: ['node_modules', '.git', 'dist', 'build'],
  commitMessage: 'Auto update: ',
  debounceTime: 5000, // 5 seconds
};

console.log('🔍 Starting auto-update watcher...');

// Initialize watcher
const watcher = chokidar.watch(config.watchPaths, {
  ignored: new RegExp(`(${config.ignorePaths.join('|')})`),
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100
  }
});

// Track changes
let changedFiles = new Set();
let timer = null;

// Handle file changes
watcher
  .on('add', handleChange)
  .on('change', handleChange)
  .on('unlink', handleChange);

function handleChange(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  console.log(`📝 Change detected: ${relativePath}`);
  
  changedFiles.add(relativePath);
  
  // Debounce commits
  clearTimeout(timer);
  timer = setTimeout(commitChanges, config.debounceTime);
}

function commitChanges() {
  if (changedFiles.size === 0) return;
  
  const files = Array.from(changedFiles);
  const fileList = files.join(', ');
  const shortList = files.length > 3 
    ? `${files.slice(0, 3).join(', ')} and ${files.length - 3} more files` 
    : fileList;
  
  const commitMessage = `${config.commitMessage}${shortList}`;
  
  console.log(`🚀 Committing changes: ${fileList}`);
  
  exec(`./auto-push.sh "${commitMessage}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.error(`⚠️ Warning: ${stderr}`);
    }
    
    console.log(`✅ Success: ${stdout}`);
    changedFiles.clear();
  });
}

console.log('👀 Watching for file changes...');
console.log('💡 Press Ctrl+C to stop');
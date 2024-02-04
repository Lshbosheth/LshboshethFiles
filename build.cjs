#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

const commitMsg = process.argv.slice(2).join(' ');
console.log(commitMsg);
const configFile = './src-tauri/tauri.conf.json';
const configContent = fs.readFileSync(configFile, 'utf-8');
const config = JSON.parse(configContent);

// 增加 version 字段
if(commitMsg.indexOf('build') > -1) {
    config.package.version = commitMsg.split(' ')[commitMsg.split(' ').length - 1];
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "Build Version to ${config.package.version}"`, { stdio: 'inherit' });
}


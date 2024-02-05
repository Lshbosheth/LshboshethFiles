#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

const commitMsg = process.argv.slice(2).join(' ');
console.log(commitMsg);
const tauriConfigFile = './src-tauri/tauri.conf.json';
const packageFile = 'package.json';
const tauriConfigContent = fs.readFileSync(tauriConfigFile, 'utf-8');
const packageContent = fs.readFileSync(packageFile, 'utf-8');
const tauriConfig = JSON.parse(tauriConfigContent);
const packageConfig = JSON.parse(packageContent);

// 增加 version 字段
if(commitMsg.indexOf('build') > -1) {
    tauriConfig.package.version = commitMsg.split(' ')[commitMsg.split(' ').length - 1];
    packageConfig.version = commitMsg.split(' ')[commitMsg.split(' ').length - 1];
    fs.writeFileSync(tauriConfigFile, JSON.stringify(tauriConfig, null, 2));
    fs.writeFileSync(packageFile, JSON.stringify(packageConfig, null, 2));
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "Build Version to ${tauriConfig.package.version}"`, { stdio: 'inherit' });
}


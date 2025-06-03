const fs = require('fs');
const path = require('path');

const extensionPath = path.resolve(__dirname, './extensions/dict/ezyZip/Google-Dictionary-by-Google-Chrome-Web-Store.crx'); 

const capabilities = {
  browserName: 'Chrome',
  browserVersion: '137.0',
  'LT:Options': {
    name: 'NodeJS Extension Test : 137.0',
    build: 'NodeJS Extension Test: 137.0',
    project: 'NodeJS Extension Test',
    platformName: 'Windows 11',
    network: true,
    console: true,
    terminal: true,
    w3c: true,
    plugin: 'NodeJS',
    'goog:chromeOptions': {
      args: [
        '--disable-features=DisableLoadExtensionCommandLineSwitch',
        '--no-sandbox',
      ],
      extensions: [
        fs.readFileSync(extensionPath, 'base64'),
      ],
    },
  },
};

module.exports = capabilities;

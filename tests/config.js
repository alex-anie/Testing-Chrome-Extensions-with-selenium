const fs = require('fs');
const path = require('path');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('dotenv').config();

class CreateDriver {
  constructor() {
    this.USERNAME = process.env.LT_USERNAME;
    this.KEY = process.env.LT_ACCESS_KEY;
    this.GRID_HOST = 'hub.lambdatest.com/wd/hub';
    this.extensionPath = path.resolve('./extensions/Google-Dictionary-by-Google-Chrome-Web-Store.crx');
  }

  async build() {
    if (!fs.existsSync(this.extensionPath)) {
      throw new Error(`Extension file not found: ${this.extensionPath}`);
    }

    console.log(`🧩 Loading extension from: ${this.extensionPath}`);

    const chromeOptions = new chrome.Options();
    chromeOptions.addExtensions(this.extensionPath);
    chromeOptions.addArguments("--disable-features=DisableLoadExtensionCommandLineSwitch");

    const capabilities = {
      browserName: 'Chrome',
      'LT:Options': {
        name: 'Load chrome extension with selenium',
        build: 'Interacting with chrome extension with selenium',
        project: 'LambdaTest Chrome Extension Testings',
        w3c: true,
        plugin: 'NodeJS',
        customData: {
          _id: '5f46aaa69adf77cfe2bb4fd6',
          index: '0',
          guid: '9451b204-12f0-4177-8fe9-fb019b3e4bf3',
          isActive: 'False',
          picture: 'http://placehold.it/32x32',
        },
        'goog:chromeOptions': {
          args: ['--disable-features=DisableLoadExtensionCommandLineSwitch', '--no-sandbox'],
          extensions: [fs.readFileSync(this.extensionPath, 'base64')],
        },
      },
    };

    const gridUrl = `https://${this.USERNAME}:${this.KEY}@${this.GRID_HOST}`;

    return new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      // .usingServer(gridUrl)
      // .withCapabilities(capabilities)
      .build();
  }
}

module.exports = CreateDriver;

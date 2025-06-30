const fs = require('fs');
const path = require('path');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('dotenv').config();

class CreateDriver {
  constructor(extensionFilenames = []) {
    this.extensionFilenames = extensionFilenames;
    this.USERNAME = process.env.LT_USERNAME;
    this.KEY = process.env.LT_ACCESS_KEY;
    this.GRID_HOST = 'hub.lambdatest.com/wd/hub';
  }

  buildExtensions() {
    return this.extensionFilenames.map((file) =>
      fs.readFileSync(path.resolve(`./extensions/${file}`), 'base64')
    );
  }

  async initDriver() {
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments('--disable-features=DisableLoadExtensionCommandLineSwitch');

    const extensionsBase64 = this.buildExtensions();
    extensionsBase64.forEach((ext) => {
      chromeOptions.addExtensions(Buffer.from(ext, 'base64'));
    });

    const capabilities = {
      browserName: 'Chrome',
      'LT:Options': {
        name: 'Multi Extension Loader',
        build: 'Selenium-Multi-Extension',
        project: 'LambdaTest Chrome Extension Automation',
        w3c: true,
        plugin: 'NodeJS',
        'goog:chromeOptions': {
          args: ['--disable-features=DisableLoadExtensionCommandLineSwitch', '--no-sandbox'],
          extensions: extensionsBase64,
        },
      },
    };

    const gridUrl = `https://${this.USERNAME}:${this.KEY}@${this.GRID_HOST}`;
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .usingServer(gridUrl)
      .withCapabilities(capabilities)
      .build();

    return driver;
  }
}

module.exports = CreateDriver;

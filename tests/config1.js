const fs = require('fs');
const path = require('path');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

class CreateDriver {
  constructor(extensionFilenames = []) {
    this.extensionFilenames = extensionFilenames;
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

    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();

    return driver;
  }
}

module.exports = CreateDriver;

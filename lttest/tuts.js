const fs = require('fs');
const path = require('path');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('dotenv').config()
// const capabilities = require('../lambdatest.config.js')

const USERNAME = process.env.LT_USERNAME 
const KEY = process.env.LT_ACCESS_KEY
const GRID_HOST = 'hub.lambdatest.com/wd/hub';

console.log('username :', process.env.LT_USERNAME)

async function run() {
    // Path to the CRX file
    const extensionPath = path.resolve('./extensions/dict/ezyZip/Google-Dictionary-by-Google-Chrome-Web-Store.crx');

    // Check if the extension file exists
    if (!fs.existsSync(extensionPath)) {
        console.error(`❌ Extension file not found: ${extensionPath}`);
        return;
    }

    console.log(`🧩 Loading extension from: ${extensionPath}`);

    // Load chrome options
    let options = new chrome.Options();
    options.addExtensions(extensionPath);
    options.addArguments("--disable-features=DisableLoadExtensionCommandLineSwitch");

    const capabilities = {
    "browserName": "Chrome",
    // "browserVersion": "latest", #Uncomment to Specify Browser Version 
    "LT:Options": {
      name: 'Load chrome extension with selenium', // name of the test
      build: 'NodeJS Loves LambdaTest', // name of the build
      "project": "Build-With-LambdaTtest",
      "w3c": true,
      "plugin": "NodeJS",
      "customData": 
        {
          _id: "5f46aaa69adf77cfe2bb4fd6",
          index: "0",
          guid: "9451b204-12f0-4177-8fe9-fb019b3e4bf3",
          isActive: "False",
          picture: "http://placehold.it/32x32",
        },
        'goog:chromeOptions': {
              args: [
                '--disable-features=DisableLoadExtensionCommandLineSwitch',
                '--no-sandbox',
              ],
              extensions: [
                fs.readFileSync(extensionPath, 'base64'),
              ],
        },
    }
  };

  const gridUrl = 'https://' + USERNAME + ':' + KEY + '@' + GRID_HOST;

    // Initialize the WebDriver
    const driver = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .usingServer(gridUrl)
        .withCapabilities(capabilities)
        .build();

    try {
        // Open the extensions page
        await driver.get('chrome://extensions');
        await driver.sleep(3000);

        // Execute JavaScript to get extension IDs
        const ids = await driver.executeScript(() => {
            const extensions = document.querySelectorAll('extensions-item');
            return Array.from(extensions).map(ext => ext.getAttribute('id'));
        });

        console.log(`✅ Detected Extension IDs: ${ids}`);
    } catch (err) {
        console.error(`❌ Error loading extension: ${err}`);
    } finally {
        await driver.quit();
        console.log('done');
    }
}

run();
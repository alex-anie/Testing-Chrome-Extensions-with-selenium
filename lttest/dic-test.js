const fs = require('fs');
const {Builder, Browser} = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const path = require("path");

async function run() {
    const extensionPath = path.resolve('./extensions/google-dictionary');

    if (!fs.existsSync(extensionPath)) {
        console.error('❌ Extension folder not found:', extensionPath);
        return;
    }

    const manifestPath = path.join(extensionPath, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
        console.error('❌ manifest.json not found in extension folder');
        return;
    }

    console.log('🧩 Loading extension from:', extensionPath);

    const options = new chrome.Options()
        .addArguments(`--load-extension=${extensionPath}`)
        .addArguments('--no-sandbox');

    const driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(options)
        .build();

    try {
        await driver.get('chrome://extensions');
        await driver.sleep(3000);

        const ids = await driver.executeScript(() => {
            const extensions = document.querySelectorAll('extensions-item');
            return Array.from(extensions).map(ext => ext.getAttribute('id'));
        });

        console.log('✅ Detected Extension IDs:', ids);
    } catch (err) {
        console.error('❌ Error loading extension:', err);
    }
}

run();

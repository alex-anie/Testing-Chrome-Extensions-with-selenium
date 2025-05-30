const {Builder, Browser} = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const {should} = require("chai");
should();

class ExtensionTestConfig {
    static async createDriver() {
        const options = new chrome.Options();
        options.addExtensions(['./extensions/LambdaTest-Chrome-Web-Store.crx']);
        options.addArguments('--enable-extensions-api-debugging');
        options.addArguments('--extensions-on-chrome-urls');
        
        return await new Builder()
            .forBrowser(Browser.CHROME)
            .setChromeOptions(options)
            .build();
    }

    static async getExtensionId(driver) {
        try {
        await driver.get('chrome://extensions/');
        await driver.sleep(2000);

        const extensionItems = await driver.findElements(By.css('extensions-item'));

        for (let item of extensionItems) {
            // Access the shadow root
            const shadowRoot = await driver.executeScript("return arguments[0].shadowRoot", item);

            // Get the name inside the shadow root
            const nameElement = await driver.executeScript(`
                return arguments[0].querySelector('.name')?.innerText;
            `, shadowRoot);

            if (nameElement && nameElement.includes("LambdaTest")) {
                const id = await item.getAttribute('id');
                return id;
            }
        }

        return 'your-known-extension-id'; // fallback
    } catch (err) {
        console.error("Error getting extension ID: ", err);
        return 'your-known-extension-id';
    }
    }

    static async waitForExtensionLoad(driver, timeout = 10000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            try {
                const extensionLoaded = await driver.executeScript(`
                    return document.readyState === 'complete' && 
                        (window.extensionLoaded || document.querySelector('[data-extension-loaded]') !== null);
                `);
                if (extensionLoaded) return true;
            } catch (e) {
                // Continue waiting
            }
            await driver.sleep(500);
        }
        throw new Error('Extension failed to load within timeout');
    }
}

module.exports = ExtensionTestConfig;
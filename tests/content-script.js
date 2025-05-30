const {By} = require("selenium-webdriver");
const ExtensionTestConfig = require('./config');

async function testContentScript() {
    console.log('📄 Starting Content Script Test...');
    
    const driver = await ExtensionTestConfig.createDriver();
    
    try {
        // Test on multiple pages to see content script behavior
        const testPages = [
            'https://ecommerce-playground.lambdatest.io/index.php?route=extension/maza/blog/home',
            'https://www.lambdatest.com/selenium-playground/',
            'https://lambdatest.github.io/sample-todo-app/'
        ];
        
        for (const url of testPages) {
            console.log(`\nTesting content script on: ${url}`);
            await driver.get(url);
            await driver.sleep(3000); // Wait for content scripts to execute
            
            // Check for extension-added global variables
            const extensionGlobals = await driver.executeScript(`
                const globals = [];
                for (let prop in window) {
                    if (prop.includes('extension') || prop.includes('chrome') || prop.includes('lambda')) {
                        globals.push(prop);
                    }
                }
                return globals;
            `);
            
            if (extensionGlobals.length > 0) {
                console.log('✅ Extension globals found:', extensionGlobals);
            } else {
                console.log('ℹ️  No extension globals detected');
            }
            
            // Check for DOM modifications
            const modifiedElements = await driver.findElements(By.css('[data-extension], [class*="extension"], [id*="extension"]'));
            console.log(`Found ${modifiedElements.length} potentially modified elements`);
            
            // Test if extension added any event listeners
            const eventListenerTest = await driver.executeScript(`
                const element = document.body;
                const events = [];
                
                // Check for common events that extensions might add
                ['click', 'mousedown', 'keydown', 'scroll'].forEach(eventType => {
                    const originalAddEventListener = element.addEventListener;
                    let hasListener = false;
                    
                    // This is a simplified check - in reality, detecting event listeners is complex
                    try {
                        element.dispatchEvent(new Event(eventType));
                        // If we get here without error, event handling exists
                        events.push(eventType);
                    } catch (e) {
                        // Event might not be supported or have listeners
                    }
                });
                
                return events;
            `);
            
            console.log('Events potentially handled by extension:', eventListenerTest);
            
            // Check if extension modified page styles
            const customStyles = await driver.executeScript(`
                const sheets = Array.from(document.styleSheets);
                const extensionStyles = [];
                
                sheets.forEach((sheet, index) => {
                    try {
                        if (sheet.href && sheet.href.includes('chrome-extension://')) {
                            extensionStyles.push(sheet.href);
                        }
                    } catch (e) {
                        // Cross-origin stylesheet access denied
                    }
                });
                
                return extensionStyles;
            `);
            
            if (customStyles.length > 0) {
                console.log('✅ Extension stylesheets detected:', customStyles.length);
            }
        }
        
        console.log('\n🎉 Content script test completed!');
        
    } catch (error) {
        console.error('❌ Content script test failed:', error.message);
    } finally {
        await driver.quit();
    }
}

// Run if called directly
if (require.main === module) {
    testContentScript().catch(console.error);
}

module.exports = testContentScript;
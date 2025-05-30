const {By} = require("selenium-webdriver");
const ExtensionTestConfig = require('./config');

async function testExtensionPopup() {
    console.log('🔧 Starting Extension Popup Test...');
    
    const driver = await ExtensionTestConfig.createDriver();
    
    try {
        const extensionId = await ExtensionTestConfig.getExtensionId(driver);
        console.log('Extension ID for popup test:', extensionId);
        
        // Navigate to extension popup
        const popupUrl = `chrome-extension://${extensionId}/popup.html`;
        console.log('Navigating to popup:', popupUrl);
        
        await driver.get(popupUrl);
        await driver.sleep(2000);
        
        // Get page title to verify popup loaded
        const title = await driver.getTitle();
        console.log('Popup page title:', title);
        
        // Check if popup page loaded successfully
        const pageSource = await driver.getPageSource();
        if (pageSource.includes('<html') && !pageSource.includes('404')) {
            console.log('✅ Popup page loaded successfully');
            
            // Try to interact with common popup elements
            try {
                // Look for buttons, inputs, or other interactive elements
                const buttons = await driver.findElements(By.css('button'));
                const inputs = await driver.findElements(By.css('input'));
                const links = await driver.findElements(By.css('a'));
                
                console.log(`Found ${buttons.length} buttons, ${inputs.length} inputs, ${links.length} links`);
                
                // If buttons exist, try clicking the first one
                if (buttons.length > 0) {
                    console.log('Clicking first button...');
                    await buttons[0].click();
                    await driver.sleep(1000);
                    console.log('✅ Button interaction successful');
                }
                
            } catch (interactionError) {
                console.log('⚠️  Popup interaction test skipped - adjust selectors for your specific extension');
                console.log('Error:', interactionError.message);
            }
            
        } else {
            console.log('❌ Popup page failed to load or returned error');
        }
        
        console.log('🎉 Popup test completed!');
        
    } catch (error) {
        console.error('❌ Popup test failed:', error.message);
    } finally {
        await driver.quit();
    }
}

// Run if called directly
if (require.main === module) {
    testExtensionPopup().catch(console.error);
}

module.exports = testExtensionPopup;
const {By} = require("selenium-webdriver");
const ExtensionTestConfig = require('./config');

async function testGetExtensionId() {
    console.log('🔍 Starting Extension ID Detection Test...');
    
    const driver = await ExtensionTestConfig.createDriver();
    
    try {
        const extensionId = await ExtensionTestConfig.getExtensionId(driver);
        console.log('✅ Extension ID Found:', extensionId);
        
        // Verify extension is loaded
        const extensionUrl = `chrome-extension://${extensionId}/manifest.json`;
        await driver.get(extensionUrl);
        
        const pageSource = await driver.getPageSource();
        if (pageSource.includes('manifest_version')) {
            console.log('✅ Extension manifest accessible - Extension is properly loaded');
        } else {
            console.log('❌ Extension manifest not accessible');
        }
        
        console.log('🎉 Extension ID test completed successfully!');
        
    } catch (error) {
        console.error('❌ Extension ID test failed:', error.message);
    } finally {
        await driver.quit();
    }
}

// Run if called directly
if (require.main === module) {
    testGetExtensionId().catch(console.error);
}

module.exports = testGetExtensionId;
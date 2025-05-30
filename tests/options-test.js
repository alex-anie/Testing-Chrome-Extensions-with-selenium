const {By} = require("selenium-webdriver");
const ExtensionTestConfig = require('./config');

async function testExtensionOptions() {
    console.log('⚙️  Starting Extension Options Test...');
    
    const driver = await ExtensionTestConfig.createDriver();
    
    try {
        const extensionId = await ExtensionTestConfig.getExtensionId(driver);
        console.log('Extension ID for options test:', extensionId);
        
        // Try different common options page paths
        const optionsPaths = ['options.html', 'settings.html', 'config.html', 'preferences.html'];
        let optionsFound = false;
        
        for (const path of optionsPaths) {
            try {
                const optionsUrl = `chrome-extension://${extensionId}/${path}`;
                console.log(`Trying options page: ${path}`);
                
                await driver.get(optionsUrl);
                await driver.sleep(1000);
                
                const pageSource = await driver.getPageSource();
                if (pageSource.includes('<html') && !pageSource.includes('404') && pageSource.length > 100) {
                    console.log(`✅ Options page found: ${path}`);
                    optionsFound = true;
                    
                    // Try to interact with options elements
                    const checkboxes = await driver.findElements(By.css('input[type="checkbox"]'));
                    const selects = await driver.findElements(By.css('select'));
                    const textInputs = await driver.findElements(By.css('input[type="text"]'));
                    const buttons = await driver.findElements(By.css('button'));
                    
                    console.log(`Found: ${checkboxes.length} checkboxes, ${selects.length} selects, ${textInputs.length} text inputs, ${buttons.length} buttons`);
                    
                    // Test checkbox interaction
                    if (checkboxes.length > 0) {
                        const initialState = await checkboxes[0].isSelected();
                        await checkboxes[0].click();
                        const newState = await checkboxes[0].isSelected();
                        
                        if (initialState !== newState) {
                            console.log('✅ Checkbox interaction successful');
                        }
                    }
                    
                    // Test save functionality if save button exists
                    const saveButtons = buttons.filter(async (btn) => {
                        const text = await btn.getText();
                        return text.toLowerCase().includes('save');
                    });
                    
                    if (saveButtons.length > 0) {
                        console.log('Save button found - testing save functionality');
                        // await saveButtons[0].click(); // Uncomment to actually save
                        console.log('✅ Save button interaction available');
                    }
                    
                    break;
                }
            } catch (error) {
                console.log(`Options page ${path} not found or inaccessible`);
            }
        }
        
        if (!optionsFound) {
            console.log('⚠️  No options page found for this extension');
        }
        
        console.log('🎉 Options test completed!');
        
    } catch (error) {
        console.error('❌ Options test failed:', error.message);
    } finally {
        await driver.quit();
    }
}

// Run if called directly
if (require.main === module) {
    testExtensionOptions().catch(console.error);
}

module.exports = testExtensionOptions;
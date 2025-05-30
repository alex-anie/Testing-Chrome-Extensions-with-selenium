const {By, Key} = require("selenium-webdriver");
const ExtensionTestConfig = require('./config');

async function testWebPageInteraction() {
    console.log('🌐 Starting Web Page Interaction Test...');
    
    const driver = await ExtensionTestConfig.createDriver();
    
    try {
        // Navigate to test page
        console.log('Loading test page...');
        await driver.get('https://lambdatest.github.io/sample-todo-app/');
        
        // Wait for extension to potentially modify the page
        await driver.sleep(3000);
        
        // Test normal page functionality with extension loaded
        console.log('Testing normal page functionality...');
        await driver.findElement(By.id("sampletodotext")).sendKeys("Test with extension loaded", Key.RETURN);
        
        let todoText = await driver.findElement(By.xpath("//li[last()]")).getText();
        todoText.should.equal("Test with extension loaded");
        console.log('✅ Basic page functionality works with extension');
        
        // Check for extension-injected elements
        try {
            const extensionElements = await driver.findElements(By.css('[data-extension], [class*="extension"], [id*="extension"]'));
            console.log(`Found ${extensionElements.length} potential extension-injected elements`);
            
            if (extensionElements.length > 0) {
                console.log('✅ Extension appears to have modified the page');
            } else {
                console.log('ℹ️  No obvious extension modifications detected');
            }
        } catch (error) {
            console.log('⚠️  Extension element detection skipped');
        }
        
        // Test extension's effect on page load time
        const startTime = Date.now();
        await driver.get('https://httpbin.org/delay/1');
        const loadTime = Date.now() - startTime;
        console.log(`Page load time with extension: ${loadTime}ms`);
        
        // Test if extension interferes with JavaScript execution
        const jsResult = await driver.executeScript('return "JavaScript execution test";');
        jsResult.should.equal("JavaScript execution test");
        console.log('✅ JavaScript execution not interfered by extension');
        
        console.log('🎉 Web page interaction test completed!');
        
    } catch (error) {
        console.error('❌ Web page interaction test failed:', error.message);
    } finally {
        await driver.quit();
    }
}

// Run if called directly
if (require.main === module) {
    testWebPageInteraction().catch(console.error);
}

module.exports = testWebPageInteraction;
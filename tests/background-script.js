const ExtensionTestConfig = require('./config');

async function testBackgroundScript() {
    console.log('🔧 Starting Background Script Test...');
    
    const driver = await ExtensionTestConfig.createDriver();
    
    try {
        const extensionId = await ExtensionTestConfig.getExtensionId(driver);
        console.log('Extension ID for background test:', extensionId);
        
        // Try different background page paths
        const backgroundPaths = ['background.html', '_generated_background_page.html'];
        let backgroundFound = false;
        
        for (const path of backgroundPaths) {
            try {
                const backgroundUrl = `chrome-extension://${extensionId}/${path}`;
                console.log(`Trying background page: ${path}`);
                
                await driver.get(backgroundUrl);
                await driver.sleep(1000);
                
                const pageSource = await driver.getPageSource();
                if (pageSource.includes('<html') && !pageSource.includes('404')) {
                    console.log(`✅ Background page found: ${path}`);
                    backgroundFound = true;
                    
                    // Test background script functionality
                    const backgroundTest = await driver.executeScript(`
                        // Test if common background script variables/functions exist
                        const backgroundFeatures = [];
                        
                        if (typeof chrome !== 'undefined') {
                            backgroundFeatures.push('chrome API available');
                        }
                        
                        if (typeof browser !== 'undefined') {
                            backgroundFeatures.push('WebExtensions API available');
                        }
                        
                        // Check for common background script patterns
                        if (window.localStorage) {
                            backgroundFeatures.push('localStorage accessible');
                        }
                        
                        return backgroundFeatures;
                    `);
                    
                    console.log('Background script features:', backgroundTest);
                    
                    // Test background script storage
                    try {
                        await driver.executeScript(`
                            if (typeof chrome !== 'undefined' && chrome.storage) {
                                chrome.storage.local.set({testKey: 'testValue'}, function() {
                                    console.log('Background storage test completed');
                                });
                            }
                        `);
                        console.log('✅ Background storage test executed');
                    } catch (storageError) {
                        console.log('⚠️  Background storage test skipped');
                    }
                    
                    break;
                }
            } catch (error) {
                console.log(`Background page ${path} not accessible`);
            }
        }
        
        if (!backgroundFound) {
            console.log('⚠️  Background page not found - extension might use service worker');
            
            // Test for service worker background scripts (Manifest V3)
            const serviceWorkerTest = await driver.executeScript(`
                return navigator.serviceWorker ? 'Service Worker API available' : 'No Service Worker API';
            `);
            console.log('Service Worker status:', serviceWorkerTest);
        }
        
        // Test extension's background activity by checking network requests
        console.log('Testing background network activity...');
        await driver.get('https://ecommerce-playground.lambdatest.io/index.php?route=extension/maza/blog/home');
        
        // Background scripts might make network requests
        const networkActivity = await driver.executeScript(`
            return performance.getEntriesByType('resource').length;
        `);
        console.log(`Network requests detected: ${networkActivity}`);
        
        console.log('🎉 Background script test completed!');
        
    } catch (error) {
        console.error('❌ Background script test failed:', error.message);
    } finally {
        await driver.quit();
    }
}

// Run if called directly
if (require.main === module) {
    testBackgroundScript().catch(console.error);
}

module.exports = testBackgroundScript;
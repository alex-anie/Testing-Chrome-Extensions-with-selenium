const {By} = require("selenium-webdriver");
const ExtensionTestConfig = require('./config');

async function testExtensionPermissions() {
    console.log('🔐 Starting Extension Permissions Test...');
    
    const driver = await ExtensionTestConfig.createDriver();
    
    try {
        const extensionId = await ExtensionTestConfig.getExtensionId(driver);
        
        // Test 1: Check manifest permissions
        console.log('Checking extension manifest...');
        try {
            await driver.get(`chrome-extension://${extensionId}/manifest.json`);
            const manifest = await driver.getPageSource();
            
            if (manifest.includes('permissions')) {
                console.log('✅ Extension has permissions declared');
                
                // Parse permissions (basic parsing)
                const permissionMatches = manifest.match(/"permissions":\s*\[(.*?)\]/s);
                if (permissionMatches) {
                    console.log('Declared permissions found in manifest');
                }
            }
        } catch (error) {
            console.log('⚠️  Could not access manifest directly');
        }
        
        // Test 2: Network permissions
        console.log('\nTesting network permissions...');
        await driver.get('https://ecommerce-playground.lambdatest.io/index.php?route=extension/maza/blog/home');
        
        const networkTest = await driver.executeScript(`
            return new Promise((resolve) => {
                fetch('https://fakestoreapi.com/products')
                    .then(response => response.text())
                    .then(data => resolve({success: true, data: data.substring(0, 50) + '...'}))
                    .catch(error => resolve({success: false, error: error.message}));
            });
        `);
        
        if (networkTest.success) {
            console.log('✅ Network requests allowed');
        } else {
            console.log('❌ Network requests blocked:', networkTest.error);
        }
        
        // Test 3: Storage permissions
        console.log('\nTesting storage permissions...');
        const storageTest = await driver.executeScript(`
            const tests = {};
            
            // Test localStorage
            try {
                localStorage.setItem('test', 'value');
                localStorage.removeItem('test');
                tests.localStorage = 'allowed';
            } catch (e) {
                tests.localStorage = 'blocked';
            }
            
            // Test sessionStorage
            try {
                sessionStorage.setItem('test', 'value');
                sessionStorage.removeItem('test');
                tests.sessionStorage = 'allowed';
            } catch (e) {
                tests.sessionStorage = 'blocked';
            }
            
            return tests;
        `);
        
        console.log('Storage permissions:', storageTest);
        
        // Test 4: Tab permissions (if extension has access)
        console.log('\nTesting tab access permissions...');
        await driver.get('https://ecommerce-playground.lambdatest.io/index.php?route=extension/maza/blog/home');
        
        const tabTest = await driver.executeScript(`
            return {
                url: window.location.href,
                title: document.title,
                canAccessDOM: !!document.body
            };
        `);
        
        console.log('Tab access test:', tabTest);
        
        // Test 5: Cookie permissions
        console.log('\nTesting cookie permissions...');
        const cookieTest = await driver.executeScript(`
            try {
                document.cookie = 'test=value; path=/';
                const cookies = document.cookie;
                return {success: true, canSetCookies: cookies.includes('test=value')};
            } catch (e) {
                return {success: false, error: e.message};
            }
        `);
        
        console.log('Cookie permissions:', cookieTest);
        
        // Test 6: Cross-origin permissions
        console.log('\nTesting cross-origin permissions...');
        const corsTest = await driver.executeScript(`
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve({cors: 'allowed'});
                img.onerror = () => resolve({cors: 'blocked'});
                img.src = 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg';
                
                setTimeout(() => resolve({cors: 'timeout'}), 5000);
            });
        `);
        
        console.log('Cross-origin test:', corsTest);
        
        console.log('\n🎉 Permissions test completed!');
        
    } catch (error) {
        console.error('❌ Permissions test failed:', error.message);
    } finally {
        await driver.quit();
    }
}

// Run if called directly
if (require.main === module) {
    testExtensionPermissions().catch(console.error);
}

module.exports = testExtensionPermissions;
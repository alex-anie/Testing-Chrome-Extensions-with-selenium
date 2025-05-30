const testGetExtensionId = require('./get-extension-id');
const testExtensionPopup = require('./popup-test');
const testWebPageInteraction = require('./web-interaction');
const testExtensionOptions = require('./options-test');
const testContentScript = require('./content-script');
const testBackgroundScript = require('./background-script');
const testExtensionPermissions = require('./permissions-test');

async function runAllTests() {
    console.log('🚀 Starting Complete Extension Test Suite...\n');
    
    const tests = [
        { name: 'Extension ID Detection', func: testGetExtensionId },
        { name: 'Extension Popup', func: testExtensionPopup },
        { name: 'Web Page Interaction', func: testWebPageInteraction },
        { name: 'Extension Options', func: testExtensionOptions },
        { name: 'Content Script', func: testContentScript },
        { name: 'Background Script', func: testBackgroundScript },
        { name: 'Extension Permissions', func: testExtensionPermissions }
    ];
    
    const results = [];
    
    for (const test of tests) {
        console.log(`\n${'='.repeat(50)}`);
        console.log(`Running: ${test.name}`);
        console.log('='.repeat(50));
        
        try {
            await test.func();
            results.push({ name: test.name, status: 'PASSED' });
        } catch (error) {
            console.error(`Test failed: ${error.message}`);
            results.push({ name: test.name, status: 'FAILED', error: error.message });
        }
        
        // Wait between tests
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Print summary
    console.log(`\n${'='.repeat(60)}`);
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));
    
    results.forEach(result => {
        const status = result.status === 'PASSED' ? '✅' : '❌';
        console.log(`${status} ${result.name}: ${result.status}`);
        if (result.error) {
            console.log(`   Error: ${result.error}`);
        }
    });
    
    const passed = results.filter(r => r.status === 'PASSED').length;
    const total = results.length;
    
    console.log(`\n📊 Results: ${passed}/${total} tests passed`);
    console.log('🎉 Extension test suite completed!');
}

// Run if called directly
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = runAllTests;
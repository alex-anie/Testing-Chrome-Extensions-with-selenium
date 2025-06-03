const CreateDriver = require('./config');
const {By, Key} = require('selenium-webdriver');
const  {expect} = require('chai');





async function run() {
     const driverFactory = new CreateDriver();

    let driver;

    try {
      
       driver = await driverFactory.build();
        // Navigating to new page
        await driver.get('chrome-extension://mgijmajocgfcbeboacabfgobmjgjcoja/options.html');
        
        const selectElement = await driver.findElement(By.id('language-selector'));
        const desiredValue = 'ja'; // value for Japanese

        // Set the select's value via JS and dispatch the change event
        await driver.executeScript(`
        const select = arguments[0];
        select.value = '${desiredValue}';
        select.dispatchEvent(new Event('change', { bubbles: true }));
        `, selectElement);

        console.log('✅ Japanese language selected');

        // Wait for the save button to become enabled
        const saveBtn = await driver.findElement(By.id('save-btn'));

        await driver.wait(async () => {
            return await saveBtn.isEnabled();
        }, 5000, '❌ Save button did not become enabled in time');

        await driver.sleep(3000);

        await saveBtn.click();

        console.log('✅ Save button clicked');

        console.log('>> -Navigating to a new page- >>');

        // Open the extensions page
        await driver.get('chrome-extension://mgijmajocgfcbeboacabfgobmjgjcoja/browser_action.html');
        await driver.sleep(3000);

        await driver.findElement(By.id('query-field')).sendKeys("automation", Key.RETURN);
        await driver.sleep(3000);

        const str2 = await driver.findElement(By.className('headword')).getText();
        await driver.sleep(3000);

        let text2 = str2.replaceAll('·', '')
        expect(text2).to.be.a('string');
        expect(text2).to.equal('オートメーション');
        console.log("Result: ", text2)

        await driver.sleep(3000)

    } catch (err) {
        console.error(`❌ Error loading extension: ${err}`);
    } finally {
        await driver.quit();
        console.log('Execution run successfully ✅');
    }
}

run(); 
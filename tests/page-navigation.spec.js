const CreateDriver = require('./config');
const { By, Key } = require('selenium-webdriver');
const  {expect} = require('chai');

async function run() {

  const driverFactory = new CreateDriver();

  let driver;

    try {
      
      driver = await driverFactory.build();
        // Open the extensions page 
        // her the extension id is mgijmajocgfcbeboacabfgobmjgjcoja
        await driver.get('chrome-extension://mgijmajocgfcbeboacabfgobmjgjcoja/browser_action.html');
        await driver.sleep(3000);

        await driver.findElement(By.id('query-field')).sendKeys("automation", Key.RETURN);
        await driver.sleep(3000);

        const str = await driver.findElement(By.className('headword')).getText();
        await driver.sleep(3000);

        let text = str.replaceAll('·', '')
        expect(text).to.be.a('string');
        expect(text).to.equal('automation');
        console.log("Result: ", text)

        await driver.sleep(3000)

    } catch (err) {
        console.error(`❌ Error loading extension: ${err}`);
    } finally {
        await driver.quit();
        console.log('Execution run successfully ✅');
    }
}

run(); 
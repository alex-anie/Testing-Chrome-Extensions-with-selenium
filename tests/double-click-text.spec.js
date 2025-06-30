// double-click-text.spec.js
const CreateDriver = require('./config');
const { By } = require('selenium-webdriver');

async function runDoubleClickTest() {
  const driverFactory = new CreateDriver();
  let driver;

  try {
    driver = await driverFactory.build();

    // Step 1: Load the target webpage
    await driver.get('https://www.lambdatest.com/blog/cypress-select/');
    await driver.sleep(3000); // wait for page to fully load

    // Step 2: Locate the target <p> tag
    const pElement = await driver.findElement(By.css('#how-to-handle-static-dropdowns + p'));

    // Step 3: Extract innerText to find "selection"
    const text = await pElement.getText();
    const targetWord = "selection";
    const startIndex = text.indexOf(targetWord);

    if (startIndex === -1) {
      console.error(`❌ Could not find word "${targetWord}" in paragraph text.`);
      return;
    }

    // Step 4: Scroll into view
    await driver.executeScript("arguments[0].scrollIntoView(true);", pElement);
    await driver.sleep(1000);

    // Step 5: Double click on the center of the element
    const actions = driver.actions({ bridge: true });
    await actions.move({ origin: pElement }).doubleClick().perform();

    // Step 6: Wait after selection
    await driver.sleep(3000);

    console.log(`✅ Successfully double-clicked on text near "${targetWord}".`);
  } catch (err) {
    console.error(`❌ Test failed: ${err}`);
  } finally {
    if (driver) await driver.quit();
    console.log('✅ Test complete.');
  }
}

runDoubleClickTest();

const CreateDriver = require('./config');

async function runTest() {
  const driverFactory = new CreateDriver();

  let driver;
  try {
    driver = await driverFactory.build();

    await driver.get('chrome://extensions');
    await driver.sleep(3000);

  } catch (err) {
    console.error(`❌ Error loading extension: ${err}`);
  } finally {
    if (driver) {
      await driver.quit();
    }
    console.log('✅ Test complete.');
  }
}

runTest();

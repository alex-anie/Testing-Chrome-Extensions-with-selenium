const CreateDriver = require('./config1');
const { By } = require('selenium-webdriver');

const driverClass = new CreateDriver([
  'LambdaTest-Chrome-Web-Store.crx',
  'SelectorsHub-Chrome-Web-Store.crx',
  'Google-Dictionary-by-Google-Chrome-Web-Store.crx'
]);

(async () => {
  const driver = await driverClass.initDriver();

  try {
    await driver.get('chrome://extensions/');
    await driver.sleep(5000);

  } catch (err) {
    console.error('❌ Script error:', err);
  } finally {
    await driver.quit();
    console.log('🚀 Test complete.');
  }
})();

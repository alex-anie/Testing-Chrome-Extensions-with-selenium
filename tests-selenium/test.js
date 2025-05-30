const {By, Builder, Browser, until} = require('selenium-webdriver');
const assert = require("assert");

(async function firstTest() {
    let driver;

    try {
        driver = await new Builder().forBrowser(Browser.CHROME).build();

        await driver.get('https://ecommerce-playground.lambdatest.io/');

        let title = await driver.getTitle();
        assert.equal('Your Store', title);
        console.log(title);

        await driver.manage().setTimeouts({implicit: 5000});

        // Wait until the swiper element is present
        const cardSelector = 'div.swiper-slide.swiper-slide-active > div > div.image > a';

        await driver.wait(until.elementLocated(By.css(cardSelector)), 10000);
        let cardLinkTag = await driver.findElement(By.css(cardSelector));

        const cardContentSelector = 'div.swiper-slide.swiper-slide-active > div > div.caption > h4 > a';
        await driver.wait(until.elementLocated(By.css(cardContentSelector)), 10000);
        let cardContent = await driver.findElement(By.css(cardContentSelector));
        let cardTitle = await cardContent.getText();

        console.log('Card Title:', cardTitle);

        assert.ok(cardTitle.length > 0, "Card title should not be empty");

    } catch (error) {
        console.log(error);
    } finally {
        await driver.quit();
    }
})();

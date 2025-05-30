const {By, Builder, Browser} = require('selenium-webdriver');
const assert = require("assert");

(async function firstTest() {
    let driver;

    try{
        driver = await new Builder().forBrowser(Browser.CHROME).build();

        await driver.get('https://ecommerce-playground.lambdatest.io/');

    let title = await driver.getTitle();
        assert.equal('Your Store', title);
        console.log(title);

        await driver.manage().setTimeouts({implicit: 5000});

        // Interacting with Card Element
        let cardLinkTag = await driver.findElement(By.css('div.swiper-slide.swiper-slide-active > div > div.image > a'));
        let cardContent = await driver.findElement(By.css('div.swiper-slide.swiper-slide-active > div > div.caption > h4 > a'));
        let cardTitle = await cardContent.getText();
        assert('amet volutpat consequat mauris nunc congue nisi vitae suscipit tellus', cardTitle);

        //card info
        let cardInfo = await driver.findElement(By.css('div.swiper-slide.swiper-slide-active > div > div.caption > div'));
        let author = await cardInfo.findElement(By.css('div.swiper-slide.swiper-slide-active > div > div.caption > div > span.author > a')).getText();
        let comment = await cardInfo.findElement(By.className('div.swiper-slide.swiper-slide-active > div > div.caption > div > span.comment')).getText();
        let views = await cardInfo.findElement(By.className('div.swiper-slide.swiper-slide-active > div > div.caption > div > span.viewed')).getText();
        let dates = await cardInfo.findElement(By.className('timestamp')).getText();

        console.log('Author: ', author);

    }catch(error){
        console.log(error)
    }finally {
        await driver.quit();
    }
}());
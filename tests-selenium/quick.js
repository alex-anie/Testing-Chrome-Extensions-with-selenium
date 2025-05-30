const { Builder, By } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Blog post interaction', async function() {
    // this.timeout(1000);

    // let driver;

//   before(async () => {
    // driver = await new Builder().forBrowser('chrome').build();
//   });

//   after(async () => {
//     await driver.quit();
//   });

  it('should interact with card and collect information', async () => {
    let driver;


    driver = await new Builder().forBrowser('chrome').build();

    await driver.get('https://ecommerce-playground.lambdatest.io/');

     this.timeout(1000);

    // Check the title of the page
    const title = await driver.getTitle();
    expect(title).to.equal('Your Store');
    console.log('Page Title:', title);

    await driver.manage().setTimeouts({ implicit: 5000 });

    // Interacting with the first card element
    const cardLinkTag = await driver.findElement(By.css('div.swiper-slide.swiper-slide-active a'));
    const cardContent = await driver.findElement(By.css('div.swiper-slide.swiper-slide-active h4 a'));
    const cardTitle = await cardContent.getText();

    expect(cardTitle).to.be.a('string').and.not.empty;
    console.log('Card Title:', cardTitle);

    // Get card information container
    const cardInfo = await driver.findElement(By.css('div.swiper-slide.swiper-slide-active div.caption > div'));

    const author = await cardInfo.findElement(By.css('span.author a')).getText();
    const comment = await cardInfo.findElement(By.css('span.comment')).getText();
    const views = await cardInfo.findElement(By.css('span.viewed')).getText();
    const date = await cardInfo.findElement(By.css('span.timestamp')).getText();

    expect(author).to.be.a('string').and.not.empty;
    expect(comment).to.be.a('string');
    expect(views).to.be.a('string');
    expect(date).to.be.a('string');

    console.log('Author:', author);
    console.log('Comment:', comment);
    console.log('Views:', views);
    console.log('Date:', date);

  await driver.quit();
     
  });

});

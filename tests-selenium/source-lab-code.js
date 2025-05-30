const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

describe('Sign in to a form filed', function(){
  this.timeout(10000);

    let driver;

    before(async function(){
        driver = await new Builder().forBrowser("chrome").build();
    });

    after(async function(){
      if(driver){
        driver.quit();
      }
    })

    it('find and login into the form filed', async function(){
    driver = await new Builder().forBrowser("chrome").build();
    
    await driver.get("https://test-login-app.vercel.app/");

    await driver.findElement(By.id("email")).sendKeys("test3@gmail.com");
    await driver.findElement(By.id("password")).sendKeys("Password@12345");

    await driver.findElement(By.name("login")).click();

    await driver.wait(until.titleIs("Welcomepage"), 4000);
      
    const pageTitle = await driver.getTitle();
    
    assert.strictEqual(pageTitle, "Welcomepage");
      //Check if redirect to login page was successfull
    });
})
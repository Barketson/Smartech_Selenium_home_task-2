const { expect } = require("chai");
const { Builder, By, Key, until, browser } = require("selenium-webdriver");
const browserOption = {
  browser: "chrome",
};
const expectedResults = {
  yandexTitle: "Яндекс",
  avtodispetcher: '//a[@href="https://www.avtodispetcher.ru/distance/"]',
  avtodispetcherTitle: "Расчет расстояний между городами",
  property: {
    from: "Тула",
    to: "Санкт-Петербург",
    fc: "9",
    fp: "46",
    intermediate: "Великий Новгород",
  },
  data: {
    first: {
      distance: "897",
      cost: "3726",
    },
    second: {
      distance: "966",
      cost: "4002",
    },
  },
};

describe("Smartech_Selenium_home_task 2", function () {
  const driver = new Builder().forBrowser(`${browserOption.browser}`).build();
  this.timeout(120000);

  it("Open https://yandex.ru/", async function () {
    await driver.get("https://yandex.ru/");
    expect(await driver.getTitle()).to.equal(`${expectedResults.yandexTitle}`);
  });

  it("Data input and click search", async function () {
    await driver
      .findElement(By.name("text"))
      .sendKeys(`${expectedResults.avtodispetcherTitle}`, Key.RETURN);
    let url = await driver.wait(
      until.elementLocated(
        By.xpath('//a[@href="https://www.avtodispetcher.ru/distance/"]')
      ),
      5000
    );
    expect(!url).to.equal(false);
  });

  it("Link search", async function () {
    let url = await driver.wait(
      until.elementLocated(
        By.xpath('//a[@href="https://www.avtodispetcher.ru/distance/"]')
      ),
      5000
    );
    expect(!url).to.equal(false);
  });

  it("Click on avtodispetcher.ru", async function () {
    const originalWindow = await driver.getWindowHandle();
    let url = await driver.wait(
      until.elementLocated(
        By.xpath('//a[@href="https://www.avtodispetcher.ru/distance/"]')
      ),
      5000
    );
    await url.click();
    await driver.wait(
      async () => (await driver.getAllWindowHandles()).length === 2,
      10000
    );
    const windows = await driver.getAllWindowHandles();
    windows.forEach(async (handle) => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
      }
    });
    await driver.sleep(1000);
    expect(await driver.getTitle()).to.equal(
      `${expectedResults.avtodispetcherTitle}`
    );
  });

  it("Data input", async function () {
    await driver.sleep(1000);
    await driver
      .findElement(By.name("from"))
      .sendKeys(`${expectedResults.property.from}`);
    await driver
      .findElement(By.name("to"))
      .sendKeys(`${expectedResults.property.to}`);
    await driver
      .findElement(By.name("fc"))
      .sendKeys(Key.DELETE, `${expectedResults.property.fc}`);
    await driver
      .findElement(By.name("fp"))
      .sendKeys(Key.DELETE, Key.DELETE, `${expectedResults.property.fp}`);
  });

  it("Click on button 'Рассчитать'", async function () {
    await (
      await driver.findElement(
        By.xpath('//*[@id="CalculatorForm"]/div[3]/input')
      )
    ).click();
  });

  it("Check result", async function () {
    let firstEl = await driver.findElement(
      By.xpath(`//*[contains(text(), ${expectedResults.data.first.distance})]`)
    );
    let SecondEl = await driver.findElement(
      By.xpath(`//*[contains(text(), ${expectedResults.data.first.cost})]`)
    );
    expect(!(firstEl && SecondEl)).to.equal(false);
  });

  it("Click on change settings", async function () {
    await driver.findElement(By.xpath('//*[@id="triggerFormD"]/span')).click();
  });

  it("Adding an intermediate city", async function () {
    await driver.findElement(By.name("v")).sendKeys("Великий Новгород");
  });

  it("Wait 1 minute", async function () {
    await driver.sleep(60000);
  });

  it("Click on button 'Рассчитать'", async function () {
    let button = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="CalculatorForm"]/div[2]/input')),
      5000
    );
    await driver.executeScript("arguments[0].scrollIntoView(true);", button);
    await button.click();
  });

  it("Check new result", async function () {
    await driver.sleep(1000);
    let firstEl = await driver.findElement(
      By.xpath(`//*[contains(text(), ${expectedResults.data.second.distance})]`)
    );
    let SecondEl = await driver.findElement(
      By.xpath(`//*[contains(text(), ${expectedResults.data.second.cost})]`)
    );
    expect(!(firstEl && SecondEl)).to.equal(false);
  });
});

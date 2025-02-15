const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

let browser;

async function getBrowserInstance() {
  if (!browser) {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless
    });
  }
  return browser;
}

exports.handler = async function(event, context) {
  try {
    const browser = await getBrowserInstance();
    const pages = await browser.pages();
    const tabs = await Promise.all(pages.map(async page => ({
      title: await page.title(),
      url: await page.url()
    })));

    return {
      statusCode: 200,
      body: JSON.stringify(tabs)
    };
  } catch (error) {
    console.error('Error listing tabs:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

const { chromium } = require('playwright');

let browser;

async function getBrowserInstance() {
  if (!browser) {
    browser = await chromium.launch({
      headless: true  // Run in headless mode
    });
  }
  return browser;
}

exports.handler = async function(event, context) {
  try {
    const browser = await getBrowserInstance();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('about:blank');  // A blank page to list tabs

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

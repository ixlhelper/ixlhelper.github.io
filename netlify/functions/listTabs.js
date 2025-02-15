const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const fs = require('fs');

let browser;

async function getBrowserInstance() {
  if (!browser) {
    // Ensure the Chromium binary is available
    const executablePath = await chromium.executablePath;
    if (!fs.existsSync(executablePath)) {
      throw new Error('Chromium binary not found at the configured executablePath');
    }

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: executablePath,
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

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log("Navigating to http://localhost:5173...");
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  
  console.log("Waiting for video cards...");
  await page.waitForSelector('.grid-card');
  
  console.log("Clicking the first grid card...");
  await page.click('.grid-card');
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log("Done.");
  await browser.close();
})();

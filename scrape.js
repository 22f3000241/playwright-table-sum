const { chromium } = require('playwright');

async function scrape() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const seeds = [88,89,90,91,92,93,94,95,96,97];

  let grandTotal = 0;

  for (const seed of seeds) {

    const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;

    console.log("Visiting:", url);

    await page.goto(url);

    // VERY IMPORTANT (because content is dynamic)
    await page.waitForLoadState('networkidle');
    await page.waitForSelector("table");

    const numbers = await page.$$eval("table td", cells =>
      cells
        .map(td => parseFloat(td.innerText))
        .filter(n => !isNaN(n))
    );

    const pageSum = numbers.reduce((a, b) => a + b, 0);

    console.log(`Seed ${seed} sum:`, pageSum);

    grandTotal += pageSum;
  }

  console.log("FINAL TOTAL SUM:", grandTotal);

  await browser.close();
}

scrape();

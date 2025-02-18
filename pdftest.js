const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  // Launch Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Read HTML content from the file
  const htmlContent = fs.readFileSync('large.html', 'utf8');

  // Set content to the page
  await page.setContent(htmlContent);


   const pdfPrintOptions = {
      path: "output_new.pdf",
      //format: 'letter',
      width: 7.5*300,
      height: 10*300,
      margin: {
        top: '0.125in',  // 10in (height) - 7.25in (text margin)
        right: '0.125in',  // 7.5in (width) - 9.75in (text margin)
        bottom: '0.125in',
        left: '0.125in',
      },
      printBackground: true,
      cache: false, // Disable caching
      timeout: 3600000
      
    };
	
  // Generate PDF from the content
  await page.pdf(pdfPrintOptions);

  // Close the browser
  await browser.close();
})();

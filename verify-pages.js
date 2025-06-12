const puppeteer = require('puppeteer');

async function verifyPDFPages() {
    console.log('🔍 Verifying PDF page count...');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        
        await page.goto('http://localhost:8000', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Count pages in the HTML
        const pageCount = await page.evaluate(() => {
            return document.querySelectorAll('.page').length;
        });
        
        console.log(`📄 Found ${pageCount} pages in HTML`);
        
        // Get page titles for verification
        const pageTitles = await page.evaluate(() => {
            const pages = document.querySelectorAll('.page');
            return Array.from(pages).map((page, index) => {
                const headline = page.querySelector('.headline, h1, h2');
                return `Page ${index + 1}: ${headline ? headline.textContent.trim() : page.className}`;
            });
        });
        
        console.log('\n📋 Page Structure:');
        pageTitles.forEach(title => console.log(`  ${title}`));
        
        await browser.close();
        
        if (pageCount === 10) {
            console.log('\n✅ VERIFIED: All 10 pages found!');
        } else {
            console.log(`\n❌ ERROR: Expected 10 pages, found ${pageCount}`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error);
        await browser.close();
    }
}

verifyPDFPages();

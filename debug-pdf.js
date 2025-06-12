const puppeteer = require('puppeteer');

async function debugPDF() {
    console.log('🔍 Starting debug PDF generation...');
    
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run'
            ]
        });

        const page = await browser.newPage();
        
        console.log('📱 Setting viewport...');
        await page.setViewport({
            width: 390,
            height: 844,
            deviceScaleFactor: 2
        });
        
        console.log('🌐 Loading page...');
        await page.goto('http://localhost:8000', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        console.log('📄 Generating PDF...');
        await page.pdf({
            path: 'debug-test.pdf',
            format: 'A4',
            orientation: 'portrait',
            printBackground: true
        });
        
        await browser.close();
        console.log('✅ Debug PDF generated successfully!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

debugPDF();

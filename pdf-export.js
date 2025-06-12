const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
    console.log('🚀 Starting PDF generation...');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--single-process'
        ]
    });

    try {
        // Generate 9:16 Portrait PDF
        console.log('📱 Generating 9:16 Portrait PDF...');
        await generatePortraitPDF(browser);
        
        // Generate 16:9 Landscape PDF  
        console.log('🖥️ Generating 16:9 Landscape PDF...');
        await generateLandscapePDF(browser);
        
        console.log('✅ PDF generation completed successfully!');
    } catch (error) {
        console.error('❌ Error generating PDFs:', error);
    } finally {
        await browser.close();
    }
}

async function generatePortraitPDF(browser) {
    const page = await browser.newPage();
    
    // Set viewport for 9:16 ratio (mobile portrait)
    await page.setViewport({
        width: 390,  // iPhone 12 Pro width
        height: 844, // iPhone 12 Pro height
        deviceScaleFactor: 2
    });
    
    // Navigate to the brochure
    await page.goto('http://localhost:8000', {
        waitUntil: 'networkidle0',
        timeout: 30000
    });
    
    // Wait for animations to complete
    await page.waitForTimeout(2000);
    
    // Add PDF-specific styles
    await page.addStyleTag({
        content: `
            @media print {
                * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                .page {
                    page-break-after: always;
                    page-break-inside: avoid;
                    min-height: 100vh;
                    width: 100vw;
                    margin: 0;
                    padding: 1rem;
                    box-sizing: border-box;
                }
                
                .page:last-child {
                    page-break-after: auto;
                }
                
                .page-navigation {
                    display: none !important;
                }
                
                .neural-network {
                    animation: none !important;
                }
                
                .scroll-indicator {
                    display: none !important;
                }
                
                /* Optimize text for print */
                .headline {
                    font-size: 1.8rem !important;
                    line-height: 1.3 !important;
                }
                
                .subheadline {
                    font-size: 1rem !important;
                }
                
                /* Ensure QR codes are visible */
                .qr-code img,
                .showcase-qr img {
                    -webkit-print-color-adjust: exact !important;
                }
                
                /* Expert photo */
                .expert-photo {
                    -webkit-print-color-adjust: exact !important;
                }
                
                /* Optimize flow diagram for mobile */
                .flow-step {
                    max-width: 280px !important;
                    margin-bottom: 0.5rem !important;
                }
                
                .flow-arrow {
                    margin: 0.3rem auto !important;
                    width: 40px !important;
                    height: 40px !important;
                }
                
                /* Showcase grid for mobile */
                .showcase-grid {
                    grid-template-columns: 1fr !important;
                    gap: 1rem !important;
                }
                
                .showcase-item {
                    padding: 1rem !important;
                }
                
                .showcase-qr img {
                    width: 80px !important;
                    height: 80px !important;
                }
            }
        `
    });
    
    // Generate PDF
    const pdf = await page.pdf({
        format: 'A4',
        width: '210mm',
        height: '297mm',
        margin: {
            top: '0mm',
            right: '0mm',
            bottom: '0mm',
            left: '0mm'
        },
        printBackground: true,
        displayHeaderFooter: false,
        preferCSSPageSize: true
    });
    
    // Save PDF
    fs.writeFileSync(path.join(__dirname, 'Twin-AI-Brochure-9-16.pdf'), pdf);
    console.log('✅ 9:16 Portrait PDF saved as: Twin-AI-Brochure-9-16.pdf');
    
    await page.close();
}

async function generateLandscapePDF(browser) {
    const page = await browser.newPage();
    
    // Set viewport for 16:9 ratio (desktop landscape)
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1
    });
    
    // Navigate to the brochure
    await page.goto('http://localhost:8000', {
        waitUntil: 'networkidle0',
        timeout: 30000
    });
    
    // Wait for animations to complete
    await page.waitForTimeout(2000);
    
    // Add PDF-specific styles for landscape
    await page.addStyleTag({
        content: `
            @media print {
                * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                .page {
                    page-break-after: always;
                    page-break-inside: avoid;
                    min-height: 100vh;
                    width: 100vw;
                    margin: 0;
                    padding: 2rem;
                    box-sizing: border-box;
                }
                
                .page:last-child {
                    page-break-after: auto;
                }
                
                .page-navigation {
                    display: none !important;
                }
                
                .neural-network {
                    animation: none !important;
                }
                
                .scroll-indicator {
                    display: none !important;
                }
                
                /* Desktop optimizations */
                .headline {
                    font-size: 2.5rem !important;
                }
                
                .subheadline {
                    font-size: 1.3rem !important;
                }
                
                /* Ensure images are high quality */
                img {
                    -webkit-print-color-adjust: exact !important;
                    image-rendering: -webkit-optimize-contrast !important;
                }
                
                /* Flow diagram desktop layout */
                .flow-diagram {
                    flex-direction: row !important;
                    gap: 2rem !important;
                    align-items: center !important;
                }
                
                .flow-step {
                    max-width: 250px !important;
                }
                
                .flow-arrow {
                    transform: none !important;
                    font-size: 2rem !important;
                    width: auto !important;
                    height: auto !important;
                    margin: 0 1rem !important;
                    background: none !important;
                    border: none !important;
                    border-radius: 0 !important;
                }
                
                .flow-arrow::before {
                    content: '→' !important;
                    font-size: 2rem !important;
                    position: static !important;
                    transform: none !important;
                }
                
                /* Showcase grid desktop layout */
                .showcase-grid {
                    grid-template-columns: repeat(3, 1fr) !important;
                    gap: 2rem !important;
                }
                
                .showcase-qr img {
                    width: 120px !important;
                    height: 120px !important;
                }
                
                /* Expert section desktop layout */
                .expert-section {
                    grid-template-columns: 1fr 2fr !important;
                    gap: 3rem !important;
                    text-align: left !important;
                }
                
                .expert-image {
                    text-align: center !important;
                }
            }
        `
    });
    
    // Generate PDF
    const pdf = await page.pdf({
        format: 'A4',
        orientation: 'landscape',
        margin: {
            top: '0mm',
            right: '0mm',
            bottom: '0mm',
            left: '0mm'
        },
        printBackground: true,
        displayHeaderFooter: false,
        preferCSSPageSize: true
    });
    
    // Save PDF
    fs.writeFileSync(path.join(__dirname, 'Twin-AI-Brochure-16-9.pdf'), pdf);
    console.log('✅ 16:9 Landscape PDF saved as: Twin-AI-Brochure-16-9.pdf');
    
    await page.close();
}

// Run the PDF generation
generatePDF().catch(console.error);

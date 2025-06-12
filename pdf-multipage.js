const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateMultiPagePDF() {
    console.log('🚀 Starting Multi-Page PDF generation...');
    
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

    try {
        // Generate Portrait PDF (9:16)
        console.log('📱 Generating 9:16 Portrait PDF...');
        await generatePortraitPDF(browser);
        
        // Generate Landscape PDF (16:9)
        console.log('🖥️ Generating 16:9 Landscape PDF...');
        await generateLandscapePDF(browser);
        
        console.log('✅ Multi-page PDF generation completed!');
        console.log('📁 Files created:');
        console.log('   📱 Twin-AI-Brochure-9-16-MultiPage.pdf (Portrait - 10 pages)');
        console.log('   🖥️  Twin-AI-Brochure-16-9-MultiPage.pdf (Landscape - 10 pages)');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await browser.close();
    }
}

async function generatePortraitPDF(browser) {
    const page = await browser.newPage();
    
    // Set mobile viewport for 9:16
    await page.setViewport({
        width: 390,
        height: 844,
        deviceScaleFactor: 2
    });
    
    await page.goto('http://localhost:8000', {
        waitUntil: 'networkidle0',
        timeout: 30000
    });
    
    await page.waitForTimeout(3000);
    
    // Add CSS to force page breaks and make all elements visible
    await page.addStyleTag({
        content: `
            /* Hide navigation */
            .page-navigation, .scroll-indicator {
                display: none !important;
            }
            
            /* Force page breaks - CRITICAL for multi-page PDF */
            .page {
                page-break-after: always !important;
                page-break-inside: avoid !important;
                break-after: page !important;
                break-inside: avoid !important;
                min-height: 100vh !important;
                height: 100vh !important;
                width: 100vw !important;
                margin: 0 !important;
                padding: 1rem !important;
                box-sizing: border-box !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                overflow: hidden !important;
                position: relative !important;
            }
            
            /* Remove page break from last page */
            .page:last-child {
                page-break-after: auto !important;
                break-after: auto !important;
            }
            
            /* Make all elements visible */
            [data-scroll], .reveal-text, .flow-step, .benefit, .group, 
            .showcase-item, .pain-point, .showcase-stats {
                opacity: 1 !important;
                transform: translateY(0) !important;
                transition: none !important;
                animation: none !important;
            }
            
            /* Force colors to print */
            * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* Backgrounds */
            .page-1, .page-2, .page-5, .page-7, .page-9 {
                background: linear-gradient(135deg, #0a0a0a 0%, #3a4095 100%) !important;
                color: white !important;
            }
            
            .page-3, .page-6, .page-10 {
                background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%) !important;
                color: #333 !important;
            }
            
            .page-4, .page-8 {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
                color: #333 !important;
            }
            
            /* Mobile optimizations for 9:16 */
            .headline {
                font-size: 1.8rem !important;
                line-height: 1.3 !important;
                margin-bottom: 1.5rem !important;
            }
            
            .subheadline {
                font-size: 1rem !important;
                margin-bottom: 2rem !important;
            }
            
            .content {
                max-width: 95% !important;
                margin: 0 auto !important;
                padding: 0 0.5rem !important;
            }
            
            /* Page layout optimizations */
            .page {
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                text-align: center !important;
                padding: 1rem !important;
            }
            
            /* Grid layouts optimized for mobile */
            .pain-points-grid {
                grid-template-columns: 1fr !important;
                gap: 1rem !important;
            }
            
            .benefits-grid {
                grid-template-columns: 1fr !important;
                gap: 1.5rem !important;
            }
            
            .target-groups {
                grid-template-columns: 1fr !important;
                gap: 1.5rem !important;
            }
            
            .benefit, .pain-point, .group {
                padding: 1.5rem !important;
                border-radius: 15px !important;
            }
            
            /* Demo section mobile stack */
            .product-demo {
                grid-template-columns: 1fr !important;
                gap: 1rem !important;
            }
            
            .demo-arrow {
                transform: rotate(90deg) !important;
                font-size: 2rem !important;
                order: 2 !important;
            }
            
            .demo-before {
                order: 1 !important;
            }
            
            .demo-after {
                order: 3 !important;
            }
            
            /* FIX: Flow diagram mobile - EXACTLY MATCH WEB VERSION */
            .flow-diagram {
                flex-direction: column !important;
                gap: 0 !important;
                align-items: center !important;
                width: 100% !important;
                display: flex !important;
            }
            
            .flow-step {
                min-width: auto !important;
                width: 100% !important;
                max-width: 300px !important;
                margin: 0 auto 0.5rem auto !important;
                order: 0 !important;
                background: white !important;
                padding: 1.5rem !important;
                border-radius: 20px !important;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
                text-align: center !important;
            }
            
            /* CRITICAL: Use exact same order as web CSS */
            .flow-step:nth-child(1) {
                order: 1 !important; /* Yêu cầu của bạn */
                margin-bottom: 0 !important;
            }
            
            .flow-arrow:nth-child(2) {
                order: 2 !important; /* First arrow */
            }
            
            .central-agent {
                order: 3 !important; /* Agent Chính ở giữa */
                transform: scale(1) !important;
                width: 100% !important;
                max-width: 320px !important;
                margin: 0.5rem auto !important;
                background: linear-gradient(135deg, #24a6ff, #1c7dde) !important;
                color: white !important;
            }
            
            .flow-arrow:nth-child(4) {
                order: 4 !important; /* Second arrow */
            }
            
            .flow-step:nth-child(5) {
                order: 5 !important; /* Kết quả Tối ưu */
                margin-top: 0 !important;
            }
            
            /* Arrow styling exactly like web mobile version */
            .flow-arrow {
                position: relative !important;
                background: rgba(36, 166, 255, 0.1) !important;
                border-radius: 50% !important;
                width: 60px !important;
                height: 60px !important;
                margin: 1rem auto !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-weight: bold !important;
                border: 2px solid #24a6ff !important;
                transform: none !important;
                font-size: 0 !important; /* Hide the original arrow */
            }
            
            .flow-arrow::before {
                content: '↓' !important;
                font-size: 2rem !important;
                color: #24a6ff !important;
                transform: none !important;
                position: absolute !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
            }
            
            /* Showcase grid mobile */
            .showcase-grid {
                grid-template-columns: 1fr !important;
                gap: 1rem !important;
            }
            
            .showcase-qr img {
                width: 80px !important;
                height: 80px !important;
            }
            
            /* Hide browser scroll */
            body {
                overflow: hidden !important;
            }
            
            .brochure-container {
                overflow: visible !important;
                height: auto !important;
            }
        `
    });
    
    // Force all elements to visible state
    await page.evaluate(() => {
        const elements = document.querySelectorAll('[data-scroll], .reveal-text, .flow-step, .benefit, .group, .showcase-item, .pain-point, .showcase-stats');
        elements.forEach(el => {
            el.classList.add('visible');
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    });
    
    await page.waitForTimeout(2000);
    
    // Generate PDF with page breaks
    await page.pdf({
        path: 'Twin-AI-Brochure-9-16-MultiPage.pdf',
        format: 'A4',
        orientation: 'portrait',
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
            top: '0mm',
            bottom: '0mm',
            left: '0mm',
            right: '0mm'
        },
        displayHeaderFooter: false
    });
    
    await page.close();
}

async function generateLandscapePDF(browser) {
    const page = await browser.newPage();
    
    // Set desktop viewport for 16:9
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1
    });
    
    await page.goto('http://localhost:8000', {
        waitUntil: 'networkidle0',
        timeout: 30000
    });
    
    await page.waitForTimeout(3000);
    
    // Add CSS for landscape layout
    await page.addStyleTag({
        content: `
            /* Hide navigation */
            .page-navigation, .scroll-indicator {
                display: none !important;
            }
            
            /* Force page breaks - CRITICAL for multi-page PDF */
            .page {
                page-break-after: always !important;
                page-break-inside: avoid !important;
                break-after: page !important;
                break-inside: avoid !important;
                min-height: 100vh !important;
                height: 100vh !important;
                width: 100vw !important;
                margin: 0 !important;
                padding: 2rem !important;
                box-sizing: border-box !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                overflow: hidden !important;
                position: relative !important;
            }
            
            /* Remove page break from last page */
            .page:last-child {
                page-break-after: auto !important;
                break-after: auto !important;
            }
            
            /* Make all elements visible */
            [data-scroll], .reveal-text, .flow-step, .benefit, .group, 
            .showcase-item, .pain-point, .showcase-stats {
                opacity: 1 !important;
                transform: translateY(0) !important;
                transition: none !important;
                animation: none !important;
            }
            
            /* Force colors to print */
            * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* Backgrounds */
            .page-1, .page-2, .page-5, .page-7, .page-9 {
                background: linear-gradient(135deg, #0a0a0a 0%, #3a4095 100%) !important;
                color: white !important;
            }
            
            .page-3, .page-6, .page-10 {
                background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%) !important;
                color: #333 !important;
            }
            
            .page-4, .page-8 {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
                color: #333 !important;
            }
            
            /* Desktop optimizations for 16:9 */
            .headline {
                font-size: 2.5rem !important;
                line-height: 1.2 !important;
                margin-bottom: 2rem !important;
            }
            
            .subheadline {
                font-size: 1.2rem !important;
                margin-bottom: 1.5rem !important;
            }
            
            .content {
                max-width: 90% !important;
                margin: 0 auto !important;
                padding: 0 1rem !important;
            }
            
            /* Optimize page layout for landscape */
            .page {
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                text-align: center !important;
            }
            
            /* Flow diagram desktop - horizontal layout */
            .flow-diagram {
                flex-direction: row !important;
                gap: 1.5rem !important;
                align-items: center !important;
                justify-content: center !important;
                flex-wrap: wrap !important;
                max-width: 100% !important;
            }
            
            .flow-step {
                max-width: 200px !important;
                min-height: 250px !important;
                padding: 1.5rem !important;
                flex: 0 0 auto !important;
                background: white !important;
                border-radius: 20px !important;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
                text-align: center !important;
            }
            
            .central-agent {
                transform: scale(1.1) !important;
                background: linear-gradient(135deg, #24a6ff, #1c7dde) !important;
                color: white !important;
                order: 0 !important;
            }
            
            .flow-arrow {
                transform: none !important;
                font-size: 2rem !important;
                width: auto !important;
                height: auto !important;
                background: none !important;
                border: none !important;
                margin: 0 1rem !important;
                color: #24a6ff !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            .flow-arrow::before {
                content: '→' !important;
                font-size: 2rem !important;
                color: #24a6ff !important;
                position: static !important;
                transform: none !important;
            }
            
            /* Two-column layout for content sections */
            .expert-section {
                grid-template-columns: 1fr 2fr !important;
                gap: 3rem !important;
                text-align: left !important;
                align-items: center !important;
                max-width: 90% !important;
            }
            
            .target-groups {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 2rem !important;
                max-width: 90% !important;
            }
            
            .benefits-grid {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 2rem !important;
                max-width: 90% !important;
            }
            
            .pain-points-grid {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 2rem !important;
                max-width: 90% !important;
            }
            
            /* Showcase grid desktop */
            .showcase-grid {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 2rem !important;
                max-width: 90% !important;
            }
            
            .showcase-qr img {
                width: 100px !important;
                height: 100px !important;
            }
            
            /* Demo section side-by-side */
            .product-demo {
                grid-template-columns: 1fr auto 1fr !important;
                gap: 2rem !important;
                max-width: 90% !important;
                align-items: center !important;
            }
            
            .demo-arrow {
                transform: none !important;
                font-size: 3rem !important;
                order: 2 !important;
            }
            
            /* Hide browser scroll */
            body {
                overflow: hidden !important;
            }
            
            .brochure-container {
                overflow: visible !important;
                height: auto !important;
            }
        `
    });
    
    // Force all elements to visible state
    await page.evaluate(() => {
        const elements = document.querySelectorAll('[data-scroll], .reveal-text, .flow-step, .benefit, .group, .showcase-item, .pain-point, .showcase-stats');
        elements.forEach(el => {
            el.classList.add('visible');
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    });
    
    await page.waitForTimeout(2000);
    
    // Generate PDF with page breaks
    await page.pdf({
        path: 'Twin-AI-Brochure-16-9-MultiPage.pdf',
        format: 'A4',
        orientation: 'landscape',
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
            top: '0mm',
            bottom: '0mm',
            left: '0mm',
            right: '0mm'
        },
        displayHeaderFooter: false
    });
    
    await page.close();
}

// Run the generation
generateMultiPagePDF().catch(console.error);

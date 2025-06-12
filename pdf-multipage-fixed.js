const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateMultiPagePDF() {
    console.log('🚀 Starting Multi-Page PDF generation with ALL FIXES...');
    
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
        console.log('   📱 Twin-AI-Brochure-9-16-MultiPage-FIXED.pdf (Portrait - 10 pages)');
        console.log('   🖥️  Twin-AI-Brochure-16-9-MultiPage-FIXED.pdf (Landscape - 10 pages)');
        
    } catch (error) {
        console.error('❌ Error:', error);
        console.error('Stack trace:', error.stack);
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

    // Inject mobile-specific styles for 9:16 PDF
    await page.addStyleTag({
        content: `
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
            
            /* Grid layouts optimized for mobile with better sizing */
            .pain-points-grid {
                grid-template-columns: 1fr !important;
                gap: 1rem !important;
                max-width: 90% !important;
            }
            
            .benefits-grid {
                grid-template-columns: 1fr !important;
                gap: 1.2rem !important;
                max-width: 90% !important;
            }
            
            .target-groups {
                grid-template-columns: 1fr !important;
                gap: 1.2rem !important;
                max-width: 90% !important;
            }
            
            .showcase-grid {
                grid-template-columns: 1fr !important;
                gap: 1.5rem !important;
                max-width: 90% !important;
            }
            
            /* Expert section mobile */
            .expert-section {
                grid-template-columns: 1fr !important;
                gap: 1.5rem !important;
                text-align: center !important;
                max-width: 90% !important;
            }
            
            .expert-photo img {
                width: 200px !important;
                height: 200px !important;
                border-radius: 50% !important;
            }
            
            /* Product demo mobile - FIXED LAYOUT */
            .product-demo {
                display: flex !important;
                flex-direction: column !important;
                gap: 1.5rem !important;
                max-width: 95% !important;
                align-items: center !important;
                margin: 0 auto !important;
            }
            
            .demo-arrow {
                transform: rotate(90deg) !important;
                font-size: 2rem !important;
                order: 2 !important;
                color: #24a6ff !important;
                margin: 0.5rem 0 !important;
            }
            
            .demo-before {
                order: 1 !important;
                width: 100% !important;
                max-width: 350px !important;
            }
            
            .demo-after {
                order: 3 !important;
                width: 100% !important;
                max-width: 350px !important;
            }
            
            .demo-screen {
                width: 100% !important;
                padding: 1rem !important;
                min-height: 250px !important;
                font-size: 0.8rem !important;
                box-sizing: border-box !important;
                overflow: hidden !important;
                border-radius: 15px !important;
            }
            
            .chat-input {
                font-size: 0.75rem !important;
                padding: 0.8rem !important;
                margin-bottom: 1rem !important;
            }
            
            .chat-output h4 {
                font-size: 1rem !important;
                margin-bottom: 0.8rem !important;
            }
            
            .output-section {
                margin-bottom: 1rem !important;
            }
            
            .output-section h5 {
                font-size: 0.85rem !important;
                margin-bottom: 0.5rem !important;
                color: #24a6ff !important;
            }
            
            .output-section ul {
                padding-left: 1.5rem !important;
                margin: 0 !important;
            }
            
            .output-section li {
                font-size: 0.7rem !important;
                line-height: 1.3 !important;
                margin-bottom: 0.3rem !important;
                position: relative !important;
            }
            
            /* FIX: Flow diagram mobile - PERFECTLY CENTERED */
            .flow-diagram {
                flex-direction: column !important;
                gap: 0 !important;
                align-items: center !important;
                width: 100% !important;
                display: flex !important;
                justify-content: center !important;
                margin: 0 auto !important;
            }
            
            .flow-step {
                min-width: auto !important;
                width: 90% !important;
                max-width: 280px !important;
                margin: 0 auto 0.5rem auto !important;
                order: 0 !important;
                background: white !important;
                padding: 1.2rem !important;
                border-radius: 20px !important;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
                text-align: center !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            /* Flowchart icon and arrow fixes for PDF */
            .flow-arrow {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 1.5rem !important;
                color: #24a6ff !important;
                background: none !important;
                border: none !important;
                margin: 0.5rem 0 !important;
                width: 40px !important;
                height: 40px !important;
                position: static !important;
            }
            
            .flow-arrow::before {
                content: '↓' !important;
                font-size: 1.5rem !important;
                color: #24a6ff !important;
                position: static !important;
                transform: none !important;
            }
            
            /* Target groups mobile optimization */
            .group {
                width: 90% !important;
                max-width: 280px !important;
                margin: 0 auto 1rem auto !important;
                text-align: center !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
            }
            
            .group h3 {
                text-align: center !important;
                margin: 1rem 0 !important;
            }
            
            .group ul {
                text-align: left !important;
                width: 100% !important;
                padding-left: 0 !important;
                list-style: none !important;
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
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 1.5rem !important;
                color: #24a6ff !important;
                background: none !important;
                border: none !important;
                margin: 0.5rem 0 !important;
                width: 40px !important;
                height: 40px !important;
                position: static !important;
            }
            
            /* Ensure Font Awesome icons display properly in PDF */
            .fas, .fab {
                font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands", Arial, sans-serif !important;
                font-weight: 900 !important;
                display: inline-block !important;
            }
            
            /* Fallback emoji icons for PDF if font fails */
            .fa-comment::before { content: "💬" !important; }
            .fa-brain::before { content: "🧠" !important; }
            .fa-trophy::before { content: "🏆" !important; }
            .fa-chess-king::before { content: "♔" !important; }
            .fa-users::before { content: "👥" !important; }
            .fa-graduation-cap::before { content: "🎓" !important; }
            .fa-clock::before { content: "⏰" !important; }
            .fa-lightbulb::before { content: "💡" !important; }
            .fa-target::before { content: "🎯" !important; }
            .fa-check::before, .fa-check-circle::before { content: "✅" !important; }
            .fa-list-ul::before { content: "•" !important; }
            .fa-chart-bar::before, .fa-chart-line::before { content: "📊" !important; }
            .fa-bolt::before { content: "⚡" !important; }
            .fa-cogs::before, .fa-gear::before { content: "⚙️" !important; }
            .fa-user-tie::before { content: "👔" !important; }
            .fa-user-astronaut::before { content: "👨‍🚀" !important; }
            .fa-user-md::before { content: "👨‍⚕️" !important; }
            .fa-rocket::before { content: "🚀" !important; }
            .fa-star::before { content: "⭐" !important; }
            .fa-circle::before { content: "●" !important; }
            
            /* CRITICAL FIX: Force all list items to use emoji check marks */
            .group li, .benefits-grid li {
                position: relative !important;
                padding-left: 2rem !important;
                list-style: none !important;
                margin-bottom: 0.5rem !important;
            }
            
            .group li::before, 
            .benefits-grid li::before {
                content: "✅" !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                font-size: 1em !important;
                line-height: 1.3 !important;
                color: #24a6ff !important;
                font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif !important;
            }
            
            /* For product demo output bullets */
            .output-section li {
                position: relative !important;
                padding-left: 1.5rem !important;
                list-style: none !important;
            }
            
            .output-section li::before { 
                content: "•" !important; 
                position: absolute !important;
                left: 0 !important;
                color: #24a6ff !important; 
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
    
    // Generate PDF with optimized portrait settings
    await page.pdf({
        path: 'Twin-AI-Brochure-9-16-MultiPage-FIXED.pdf',
        format: 'A4',
        orientation: 'portrait',
        printBackground: true,
        margin: {
            top: '0.2in',
            bottom: '0.2in',
            left: '0.2in',
            right: '0.2in'
        },
        preferCSSPageSize: false,
        displayHeaderFooter: false
    });
    
    await page.close();
    console.log('✅ Portrait 9:16 PDF generated successfully!');
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

    // Inject desktop-specific styles for 16:9 PDF
    await page.addStyleTag({
        content: `
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
                margin-bottom: 1.5rem !important;
            }
            
            .subheadline {
                font-size: 1.2rem !important;
                margin-bottom: 1rem !important;
            }
            
            .content {
                max-width: 90% !important;
                margin: 0 auto !important;
                padding: 1rem !important;
            }
            
            /* Optimize page layout for exact 1920x1080 landscape */
            .page {
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                text-align: center !important;
                padding: 1rem !important;
                width: 1920px !important;
                height: 1080px !important;
                box-sizing: border-box !important;
            }
            
            /* Flow diagram desktop - optimized for exact landscape dimensions */
            .flow-diagram {
                flex-direction: row !important;
                gap: 1.2rem !important;
                align-items: center !important;
                justify-content: center !important;
                flex-wrap: nowrap !important;
                max-width: 90% !important;
                margin: 0 auto !important;
            }
            
            .flow-step {
                max-width: 160px !important;
                min-height: 180px !important;
                padding: 1rem !important;
                flex: 0 0 auto !important;
                background: white !important;
                border-radius: 15px !important;
                box-shadow: 0 5px 20px rgba(0,0,0,0.1) !important;
                text-align: center !important;
                font-size: 0.8rem !important;
            }
            
            .central-agent {
                transform: scale(1.05) !important;
                background: linear-gradient(135deg, #24a6ff, #1c7dde) !important;
                color: white !important;
                order: 0 !important;
                max-width: 180px !important;
            }
            
            .flow-arrow {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 1.5rem !important;
                color: #24a6ff !important;
                background: none !important;
                border: none !important;
                margin: 0 0.5rem !important;
                width: 40px !important;
                height: 40px !important;
                position: static !important;
            }
            
            .flow-arrow::before {
                content: '→' !important;
                font-size: 1.5rem !important;
                color: #24a6ff !important;
                position: static !important;
                transform: none !important;
            }
            
            /* Multi-column layout optimized for 1920x1080 */
            .expert-section {
                grid-template-columns: 1fr 2fr !important;
                gap: 2rem !important;
                text-align: left !important;
                align-items: center !important;
                max-width: 85% !important;
            }
            
            .target-groups {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 1.2rem !important;
                max-width: 85% !important;
            }
            
            .benefits-grid {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 1.2rem !important;
                max-width: 85% !important;
            }
            
            .pain-points-grid {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 1.2rem !important;
                max-width: 85% !important;
            }
            
            /* Showcase grid optimized for landscape */
            .showcase-grid {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 1.2rem !important;
                max-width: 85% !important;
            }
            
            .showcase-qr img {
                width: 70px !important;
                height: 70px !important;
            }
            
            .showcase-item {
                padding: 1rem !important;
            }
            
            .showcase-info h3 {
                font-size: 1rem !important;
            }
            
            .showcase-info p {
                font-size: 0.85rem !important;
            }
            
            /* CRITICAL FIX: Demo section completely optimized for 16:9 landscape */
            .product-demo {
                display: grid !important;
                grid-template-columns: 1fr auto 1fr !important;
                gap: 1.5rem !important;
                max-width: 95% !important;
                align-items: flex-start !important;
                margin: 0 auto !important;
                height: auto !important;
                overflow: visible !important;
            }
            
            .demo-before, .demo-after {
                width: 100% !important;
                max-width: 400px !important;
                margin: 0 auto !important;
            }
            
            .demo-arrow {
                transform: none !important;
                font-size: 2rem !important;
                order: 2 !important;
                margin-top: 2rem !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                color: #24a6ff !important;
                grid-column: 2 !important;
                grid-row: 1 !important;
            }
            
            .demo-screen {
                padding: 1rem !important;
                min-height: 280px !important;
                max-height: 400px !important;
                font-size: 0.7rem !important;
                width: 100% !important;
                box-sizing: border-box !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                border-radius: 15px !important;
                background: white !important;
                border: 2px solid #e9ecef !important;
            }
            
            .demo-before {
                grid-column: 1 !important;
                grid-row: 1 !important;
            }
            
            .demo-after {
                grid-column: 3 !important;
                grid-row: 1 !important;
            }
            
            .demo-before h3, .demo-after h3 {
                font-size: 1.1rem !important;
                margin-bottom: 1rem !important;
                text-align: center !important;
            }
            
            .chat-input {
                font-size: 0.65rem !important;
                padding: 0.6rem !important;
                margin-bottom: 0.8rem !important;
                border-radius: 10px !important;
                border: 1px solid #ddd !important;
                background: #f8f9fa !important;
            }
            
            .chat-output h4 {
                font-size: 0.8rem !important;
                margin-bottom: 0.6rem !important;
                color: #24a6ff !important;
            }
            
            .output-section {
                margin-bottom: 0.8rem !important;
            }
            
            .output-section h5 {
                font-size: 0.7rem !important;
                margin-bottom: 0.3rem !important;
                color: #1c7dde !important;
                font-weight: bold !important;
            }
            
            .output-section ul {
                padding-left: 1.2rem !important;
                margin: 0 !important;
            }
            
            .output-section li {
                font-size: 0.6rem !important;
                line-height: 1.2 !important;
                margin-bottom: 0.2rem !important;
                position: relative !important;
            }
            
            /* Hide browser scroll */
            body {
                overflow: hidden !important;
            }
            
            .brochure-container {
                overflow: visible !important;
                height: auto !important;
            }
            
            /* Ensure Font Awesome icons display properly in PDF */
            .fas, .fab {
                font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands", Arial, sans-serif !important;
                font-weight: 900 !important;
                display: inline-block !important;
            }
            
            /* Fallback emoji icons for PDF if font fails */
            .fa-comment::before { content: "💬" !important; }
            .fa-brain::before { content: "🧠" !important; }
            .fa-trophy::before { content: "🏆" !important; }
            .fa-chess-king::before { content: "♔" !important; }
            .fa-users::before { content: "👥" !important; }
            .fa-graduation-cap::before { content: "🎓" !important; }
            .fa-clock::before { content: "⏰" !important; }
            .fa-lightbulb::before { content: "💡" !important; }
            .fa-target::before { content: "🎯" !important; }
            .fa-check::before, .fa-check-circle::before { content: "✅" !important; }
            .fa-list-ul::before { content: "•" !important; }
            .fa-chart-bar::before, .fa-chart-line::before { content: "📊" !important; }
            .fa-bolt::before { content: "⚡" !important; }
            .fa-cogs::before, .fa-gear::before { content: "⚙️" !important; }
            .fa-user-tie::before { content: "👔" !important; }
            .fa-user-astronaut::before { content: "👨‍🚀" !important; }
            .fa-user-md::before { content: "👨‍⚕️" !important; }
            .fa-rocket::before { content: "🚀" !important; }
            .fa-star::before { content: "⭐" !important; }
            .fa-circle::before { content: "●" !important; }
            
            /* CRITICAL FIX: Force all list items to use emoji check marks in landscape too */
            .group li, .benefits-grid li {
                position: relative !important;
                padding-left: 1.5rem !important;
                list-style: none !important;
                margin-bottom: 0.3rem !important;
            }
            
            .group li::before, 
            .benefits-grid li::before {
                content: "✅" !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                font-size: 0.9em !important;
                line-height: 1.2 !important;
                color: #24a6ff !important;
                font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif !important;
            }
            
            /* For product demo output bullets */
            .output-section li {
                position: relative !important;
                padding-left: 1rem !important;
                list-style: none !important;
            }
            
            .output-section li::before { 
                content: "•" !important; 
                position: absolute !important;
                left: 0 !important;
                color: #24a6ff !important; 
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
    
    // Generate PDF with optimized landscape settings
    await page.pdf({
        path: 'Twin-AI-Brochure-16-9-MultiPage-FIXED.pdf',
        format: 'A4',
        orientation: 'landscape',
        printBackground: true,
        margin: {
            top: '0.2in',
            bottom: '0.2in',
            left: '0.2in',
            right: '0.2in'
        },
        preferCSSPageSize: false,
        displayHeaderFooter: false
    });
    
    await page.close();
    console.log('✅ Landscape 16:9 PDF generated successfully!');
}

// Run the generation
generateMultiPagePDF().catch(console.error);

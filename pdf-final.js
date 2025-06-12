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
            
            /* Grid layouts optimized for mobile with better sizing */
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
                gap: 1rem !important; /* Reduced gap for tighter fit */
            }
            
            .benefit, .pain-point, .group {
                padding: 1rem !important; /* Reduced padding for mobile */
                border-radius: 15px !important;
                margin-bottom: 1rem !important;
            }
            
            /* Page 7 specific fixes - Target Groups mobile sizing */
            .group {
                min-height: auto !important;
                padding: 1rem !important;
                font-size: 0.9rem !important;
            }
            
            .group-icon {
                width: 40px !important;
                height: 40px !important;
                font-size: 1rem !important;
                margin-bottom: 1rem !important;
            }
            
            .group h3 {
                font-size: 1.1rem !important;
                margin-bottom: 1rem !important;
            }
            
            .group li {
                font-size: 0.85rem !important;
                padding: 0.2rem 0 !important;
                line-height: 1.3 !important;
            }
            
            /* Page 9 specific fixes - Social Proof mobile sizing */
            .showcase-grid {
                grid-template-columns: 1fr !important;
                gap: 1rem !important;
                margin-bottom: 2rem !important;
            }
            
            .showcase-item {
                padding: 1rem !important;
                min-height: auto !important;
            }
            
            .showcase-qr img {
                width: 60px !important;
                height: 60px !important;
            }
            
            .showcase-info h3 {
                font-size: 1rem !important;
                margin-bottom: 0.5rem !important;
            }
            
            .showcase-info p {
                font-size: 0.8rem !important;
                margin-bottom: 0.8rem !important;
                line-height: 1.3 !important;
            }
            
            .showcase-tag {
                font-size: 0.7rem !important;
                padding: 0.2rem 0.6rem !important;
            }
            
            .showcase-stats {
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 1rem !important;
                padding: 1rem !important;
                margin-top: 1.5rem !important;
            }
            
            .stat-number {
                font-size: 1.5rem !important;
            }
            
            .stat-label {
                font-size: 0.8rem !important;
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
            .step-icon, .group-icon, .benefit-icon {
                width: 50px !important;
                height: 50px !important;
                background: linear-gradient(135deg, #24a6ff, #1c7dde) !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                margin: 0 auto 1rem auto !important;
                font-size: 1.2rem !important;
                color: white !important;
                flex-shrink: 0 !important;
            }
            .central-agent .step-icon {
                background: rgba(255,255,255,0.2) !important;
            }
            
            /* Ensure all content is centered properly */
            .page-7 .content, .page-8 .content {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                width: 100% !important;
                text-align: center !important;
            }
            
            .target-groups, .product-demo {
                width: 100% !important;
                max-width: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
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
                padding-left: 1rem !important;
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
            /* For group list ticks, force separation */
            .group li::before { content: "✓  " !important; font-size: 1.1em !important; color: #24a6ff !important; left: 0 !important; position: absolute !important; }
            /* For product demo output bullets */
            .output-section li::before { content: "•  " !important; color: #24a6ff !important; left: 0 !important; position: absolute !important; }
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
        path: 'Twin-AI-Brochure-9-16-FINAL.pdf',
        format: 'A4',
        orientation: 'portrait',
        printBackground: true,
        preferCSSPageSize: false,  // Use PDF format for consistent sizing
        margin: {
            top: '3mm',
            bottom: '3mm',
            left: '3mm', 
            right: '3mm'
        },
        displayHeaderFooter: false
    });
    
    await page.close();
}

async function generateLandscapePDF(browser) {
    const page = await browser.newPage();
    
    // Set proper 16:9 viewport for 1920x1080
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
            
            /* Desktop optimizations for exact 16:9 landscape (1920x1080) */
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
            
            /* Demo section optimized for landscape */
            .product-demo {
                grid-template-columns: 1fr auto 1fr !important;
                gap: 2rem !important;
                max-width: 90% !important;
                align-items: flex-start !important;
                margin: 0 auto !important;
            }
            
            .demo-arrow {
                transform: none !important;
                font-size: 1.8rem !important;
                order: 2 !important;
                margin-top: 3rem !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            
            .demo-screen {
                padding: 1.2rem !important;
                min-height: 200px !important;
                font-size: 0.75rem !important;
                width: 100% !important;
                box-sizing: border-box !important;
                overflow: hidden !important;
            }
            
            .demo-before h3, .demo-after h3 {
                font-size: 1.1rem !important;
                margin-bottom: 1rem !important;
            }
            
            .chat-input {
                font-size: 0.7rem !important;
                padding: 0.8rem !important;
            }
            
            .chat-output h4 {
                font-size: 0.9rem !important;
                margin-bottom: 0.8rem !important;
            }
            
            .output-section h5 {
                font-size: 0.75rem !important;
                margin-bottom: 0.4rem !important;
            }
            
            .output-section li {
                font-size: 0.65rem !important;
                line-height: 1.2 !important;
                padding: 0.1rem 0 !important;
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
            /* For group list ticks, force separation */
            .group li::before { content: "✓  " !important; font-size: 1.1em !important; color: #24a6ff !important; left: 0 !important; position: absolute !important; }
            /* For product demo output bullets */
            .output-section li::before { content: "•  " !important; color: #24a6ff !important; left: 0 !important; position: absolute !important; }
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
    
    // Generate PDF with proper 16:9 landscape format (1920x1080)
    await page.pdf({
        path: 'Twin-AI-Brochure-16-9-FINAL.pdf',
        width: '1920px',  // Exact 16:9 dimensions
        height: '1080px',
        printBackground: true,
        preferCSSPageSize: false,
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

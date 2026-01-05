import asyncio
from playwright.async_api import async_playwright
import json

# URL to target (The Aggregator)
URL = "https://mcd-menu.my/beef-burger/" 

async def main():
    async with async_playwright() as p:
        # Launch browser (headless=True is faster)
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print(f"🕵️  Visiting: {URL}")
        await page.goto(URL, timeout=60000)
        
        # Wait a moment for any lazy loading
        await page.wait_for_timeout(2000)

        # STRATEGY: Get the full visible text of the body
        # We don't look for specific classes. We just grab everything.
        full_text = await page.inner_text("body")
        
        print("✅ Captured Page Text!")
        
        # Save raw text to file for Cursor to read
        with open("raw_burger_data.txt", "w", encoding="utf-8") as f:
            f.write(full_text)
            
        print("💾 Saved to 'raw_burger_data.txt'. Drag this file into Cursor!")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
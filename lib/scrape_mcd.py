"""
McDonald's Malaysia Nutrition Data Scraper

Installation Instructions:
1. Install playwright:
   pip install playwright

2. Install playwright browsers:
   playwright install chromium

3. Run the script:
   python scrape_mcd.py
"""

import asyncio
import json
import re
from playwright.async_api import async_playwright, Page
from typing import Optional, Dict, List


async def extract_nutrition_value(page: Page, label: str) -> Optional[str]:
    """
    Extract nutrition value for a given label from the page.
    
    Args:
        page: Playwright page object
        label: The nutrition label to search for (e.g., "Protein", "Carbs")
    
    Returns:
        The extracted value or None if not found
    """
    try:
        # Try multiple selectors and text patterns
        text_content = await page.content()
        
        # Pattern 1: Look for "Label: Value" or "Label Value"
        pattern1 = re.compile(rf'{label}[:\s]+([0-9.]+\s*[a-zA-Z]*)', re.IGNORECASE)
        match1 = pattern1.search(text_content)
        if match1:
            return match1.group(1).strip()
        
        # Pattern 2: Look for elements containing the label
        elements = await page.query_selector_all(f'text=/{label}/i')
        for element in elements[:3]:  # Check first 3 matches
            parent = await element.evaluate_handle('el => el.parentElement')
            parent_text = await parent.evaluate('el => el.textContent')
            # Extract number after the label
            pattern = re.compile(rf'{label}[:\s]*([0-9.]+\s*[a-zA-Z]*)', re.IGNORECASE)
            match = pattern.search(parent_text)
            if match:
                return match.group(1).strip()
        
        return None
    except Exception as e:
        print(f"  Warning: Error extracting {label}: {e}")
        return None


async def extract_calories(page: Page) -> Optional[str]:
    """Extract calories value (looks for 'kcal')"""
    try:
        text_content = await page.content()
        
        # Look for patterns like "500 kcal" or "500kcal"
        pattern = re.compile(r'([0-9]+)\s*kcal', re.IGNORECASE)
        match = pattern.search(text_content)
        if match:
            return f"{match.group(1)} kcal"
        
        return None
    except Exception as e:
        print(f"  Warning: Error extracting calories: {e}")
        return None


async def scrape_item_page(page: Page, url: str) -> Dict:
    """
    Scrape nutrition data from a single item page.
    
    Args:
        page: Playwright page object
        url: URL of the item page
    
    Returns:
        Dictionary containing the scraped data
    """
    print(f"\n📝 Scraping: {url}")
    
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(1000)  # Wait for dynamic content
        
        # Extract item name (try multiple selectors)
        item_name = None
        try:
            # Try H1 first
            h1 = await page.query_selector('h1')
            if h1:
                item_name = await h1.inner_text()
        except:
            pass
        
        if not item_name:
            try:
                # Try title tag
                item_name = await page.title()
            except:
                pass
        
        # Extract nutrition data
        calories = await extract_calories(page)
        protein = await extract_nutrition_value(page, "Protein")
        carbs = await extract_nutrition_value(page, "Carbohydrate|Carbs")
        fat = await extract_nutrition_value(page, "Fat")
        salt = await extract_nutrition_value(page, "Salt|Sodium")
        sugar = await extract_nutrition_value(page, "Sugar")
        
        data = {
            "item_name": item_name,
            "url": url,
            "calories": calories,
            "protein": protein,
            "carbohydrates": carbs,
            "fat": fat,
            "salt": salt,
            "sugar": sugar
        }
        
        print(f"  ✓ Extracted: {item_name}")
        return data
        
    except Exception as e:
        print(f"  ✗ Error scraping {url}: {e}")
        return {
            "item_name": None,
            "url": url,
            "error": str(e)
        }


async def get_menu_item_links(page: Page, base_url: str) -> List[str]:
    """
    Get all menu item links from the main menu page.
    
    Args:
        page: Playwright page object
        base_url: Base URL of the website
    
    Returns:
        List of full URLs to menu items
    """
    print("🔍 Finding menu item links...")
    
    try:
        # Get all links on the page
        links = await page.query_selector_all('a[href*="/menu/"]')
        
        menu_links = set()
        for link in links:
            href = await link.get_attribute('href')
            if href and '/menu/' in href:
                # Construct full URL if necessary
                if href.startswith('http'):
                    full_url = href
                elif href.startswith('/'):
                    full_url = base_url.rstrip('/') + href
                else:
                    full_url = base_url.rstrip('/') + '/' + href
                
                # Filter out the main menu page itself
                if full_url != base_url and not full_url.endswith('/menu') and not full_url.endswith('/menu/'):
                    menu_links.add(full_url)
        
        menu_links = list(menu_links)
        print(f"  ✓ Found {len(menu_links)} unique menu item links")
        return menu_links
        
    except Exception as e:
        print(f"  ✗ Error finding menu links: {e}")
        return []


async def main():
    """Main scraping function"""
    
    print("=" * 60)
    print("McDonald's Malaysia Nutrition Data Scraper")
    print("=" * 60)
    
    menu_url = "https://www.mcdonalds.com.my/menu"
    base_url = "https://www.mcdonalds.com.my"
    
    async with async_playwright() as p:
        # Launch browser
        print("\n🚀 Launching browser...")
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        page = await context.new_page()
        
        try:
            # Load main menu page
            print(f"\n📄 Loading main menu page: {menu_url}")
            await page.goto(menu_url, wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(2000)  # Wait for dynamic content
            
            # Get all menu item links
            menu_links = await get_menu_item_links(page, base_url)
            
            if not menu_links:
                print("\n⚠️  No menu links found. The website structure may have changed.")
                return
            
            # Limit to first 5 for testing
            test_links = menu_links[:5]
            print(f"\n📊 Scraping first {len(test_links)} items (testing mode)...")
            
            # Scrape each item
            results = []
            for i, link in enumerate(test_links, 1):
                print(f"\n[{i}/{len(test_links)}]")
                item_data = await scrape_item_page(page, link)
                results.append(item_data)
                
                # Be polite - add delay between requests
                if i < len(test_links):
                    print("  ⏳ Waiting 2 seconds...")
                    await page.wait_for_timeout(2000)
            
            # Print results as JSON
            print("\n" + "=" * 60)
            print("RESULTS (JSON)")
            print("=" * 60)
            print(json.dumps(results, indent=2, ensure_ascii=False))
            
            # Save to file
            output_file = "mcd_nutrition_data.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            print(f"\n💾 Data saved to: {output_file}")
            
        except Exception as e:
            print(f"\n❌ Error: {e}")
            
        finally:
            await browser.close()
            print("\n✅ Done!")


if __name__ == "__main__":
    asyncio.run(main())


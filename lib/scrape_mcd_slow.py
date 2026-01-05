import asyncio
from playwright.async_api import async_playwright
import re
import json
import random

# Target the aggregator
BASE_URL = "https://mcd-menu.my/"

async def main():
    async with async_playwright() as p:
        # headless=True is faster, but sometimes headless=False helps data load if they block bots
        # Let's stick to True first.
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Set a massive timeout (90 seconds) for slow internet/servers
        page.set_default_timeout(90000)
        
        print(f"🐢 Starting 'Slow & Steady' Scrape of: {BASE_URL}")
        await page.goto(BASE_URL)
        
        # 1. Get all links again (Broad sweep)
        links = await page.eval_on_selector_all("a", """
            elements => elements.map(e => e.href).filter(href => href.includes('mcd-menu.my/') && !href.includes('contact') && !href.includes('about'))
        """)
        links = list(set(links))
        print(f"✅ Found {len(links)} links. Getting ready...")

        all_items = []

        # 2. The Loop (With "Human" behavior)
        for i, link in enumerate(links):
            # No limit this time. We go for all of them.
            
            try:
                print(f"   [{i+1}/{len(links)}] Visiting: {link}")
                await page.goto(link)
                
                # --- TRICK 1: SCROLL ---
                # Scroll to bottom to trigger any lazy-loaded tables
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                
                # --- TRICK 2: WAIT ---
                # Wait 4-5 seconds for the ads to finish and the table to pop in
                await page.wait_for_timeout(random.randint(4000, 6000))
                
                # Get text
                text = await page.inner_text("body")
                
                # --- EXTRACTION ---
                item = {
                    "source": "McDonald's",
                    "category": "Fast Food",
                    "verified": True
                }
                
                # Name
                title = await page.title()
                item["name_en"] = title.replace(" - MCD Menu", "").strip()
                item["name_bm"] = item["name_en"]

                # Detect Subcategory from Name
                name_lower = item["name_en"].lower()
                if "burger" in name_lower or "mac" in name_lower: item["subcategory"] = "Burgers"
                elif "chicken" in name_lower or "ayam" in name_lower: item["subcategory"] = "Chicken"
                elif "tea" in name_lower or "latte" in name_lower or "coke" in name_lower or "drink" in name_lower: item["subcategory"] = "Drinks"
                elif "sundae" in name_lower or "mcflurry" in name_lower or "pie" in name_lower: item["subcategory"] = "Dessert"
                elif "fries" in name_lower or "corn" in name_lower or "hash brown" in name_lower: item["subcategory"] = "Sides"
                else: item["subcategory"] = "Menu Item"

                # Calories
                cal_match = re.search(r"Calories\s*(\d+)\s*kcal", text, re.IGNORECASE)
                item["calories_kcal"] = int(cal_match.group(1)) if cal_match else None

                if item["calories_kcal"]:
                    # Weight (Serving)
                    weight_match = re.search(r"Serving\s*\((\d+)g\)", text, re.IGNORECASE)
                    if weight_match:
                        item["serving_grams"] = int(weight_match.group(1))
                        item["serving_description"] = f"1 serving ({weight_match.group(1)}g)"
                    else:
                        item["serving_grams"] = 150 # Default safe fallback
                        item["serving_description"] = "1 serving"

                    # Macros
                    prot_match = re.search(r"Protein\s*(\d+\.?\d*)g", text, re.IGNORECASE)
                    item["protein_g"] = float(prot_match.group(1)) if prot_match else None
                    
                    carb_match = re.search(r"Carbohydrates\s*(\d+\.?\d*)g", text, re.IGNORECASE)
                    item["carbs_g"] = float(carb_match.group(1)) if carb_match else None
                    
                    fat_match = re.search(r"Fats\s*(\d+\.?\d*)g", text, re.IGNORECASE)
                    item["total_fat_g"] = float(fat_match.group(1)) if fat_match else None
                    
                    # Sodium (Salt * 400)
                    salt_match = re.search(r"Salt\s*(\d+\.?\d*)g", text, re.IGNORECASE)
                    if salt_match:
                        item["sodium_mg"] = int(float(salt_match.group(1)) * 400)
                    else:
                        item["sodium_mg"] = None
                    
                    # Sugar
                    sugar_match = re.search(r"Sugar\s*(\d+\.?\d*)g", text, re.IGNORECASE)
                    item["sugar_g"] = float(sugar_match.group(1)) if sugar_match else None

                    all_items.append(item)
                    print(f"      ---> Captured: {item['name_en']} ({item['calories_kcal']} kcal)")
                else:
                    print("      ⚠️ No Calories found (Page might not have loaded table yet)")

            except Exception as e:
                print(f"      ❌ Timeout/Error: {e}")

        # Save
        with open("mcd_slow_full.json", "w") as f:
            json.dump(all_items, f, indent=2)
            
        print(f"\n🎉 DONE! Saved {len(all_items)} items to 'mcd_slow_full.json'.")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
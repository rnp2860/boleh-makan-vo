import asyncio
from playwright.async_api import async_playwright
import re
import json

# Target the static aggregator site
BASE_URL = "https://mcd-menu.my/"

async def main():
    async with async_playwright() as p:
        # Launch browser (headless=True is faster)
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print(f"🕵️  Scanning Menu: {BASE_URL}")
        await page.goto(BASE_URL)
        
        # 1. Find all links that look like food items
        # Filter for links containing '/menu/' or typical item slugs, avoiding admin links
        links = await page.eval_on_selector_all("a", """
            elements => elements.map(e => e.href).filter(href => href.includes('mcd-menu.my/') && !href.includes('contact') && !href.includes('about'))
        """)
        
        # Remove duplicates
        links = list(set(links))
        print(f"✅ Found {len(links)} potential items. Starting Scrape...")

        all_items = []

        # 2. Loop through each link
        for i, link in enumerate(links):
            # Safety limit: remove the next line if you want to scrape ALL 50+ items
            if i > 50: break 
            
            try:
                print(f"   Reading [{i+1}/{len(links)}]: {link}")
                await page.goto(link, timeout=10000)
                
                # Get the whole text for Regex parsing
                text = await page.inner_text("body")
                
                # --- 3. EXTRACTION LOGIC (The Brain) ---
                item = {
                    "source": "McDonald's",        # ✅ FIXED: Was 'brand'
                    "category": "Fast Food",       # ✅ FIXED: Required column
                    "subcategory": "Menu Item",    # Optional context
                    "verified": True
                }
                
                # NAME
                title = await page.title()
                clean_name = title.replace(" - MCD Menu", "").strip()
                item["name_en"] = clean_name
                item["name_bm"] = clean_name       # ✅ FIXED: Required (Copy English)

                # SERVING WEIGHT (Crucial Fix)
                # Looks for "Per Serving (101g)" or just "101g" near the table
                weight_match = re.search(r"Serving\s*\((\d+)g\)", text, re.IGNORECASE)
                if weight_match:
                    item["serving_grams"] = int(weight_match.group(1))
                    item["serving_description"] = f"1 serving ({weight_match.group(1)}g)"
                else:
                    # Fallback if weight is missing (prevents SQL error)
                    item["serving_grams"] = 100 
                    item["serving_description"] = "1 serving"

                # NUTRIENTS
                # Calories
                cal_match = re.search(r"Calories\s*(\d+)\s*kcal", text, re.IGNORECASE)
                item["calories_kcal"] = int(cal_match.group(1)) if cal_match else None

                # Protein
                prot_match = re.search(r"Protein\s*(\d+\.?\d*)g", text, re.IGNORECASE)
                item["protein_g"] = float(prot_match.group(1)) if prot_match else None

                # Carbs
                carb_match = re.search(r"Carbohydrates\s*(\d+\.?\d*)g", text, re.IGNORECASE)
                item["carbs_g"] = float(carb_match.group(1)) if carb_match else None

                # Fat (Total)
                fat_match = re.search(r"Fats\s*(\d+\.?\d*)g", text, re.IGNORECASE)
                item["total_fat_g"] = float(fat_match.group(1)) if fat_match else None # ✅ FIXED: Was 'fat_g'

                # Sodium (Convert from Salt)
                salt_match = re.search(r"Salt\s*(\d+\.?\d*)g", text, re.IGNORECASE)
                if salt_match:
                    salt_g = float(salt_match.group(1))
                    item["sodium_mg"] = int(salt_g * 400) # ✅ Logic: Salt * 400 = Sodium
                else:
                    item["sodium_mg"] = None

                # Sugar
                sugar_match = re.search(r"Sugar\s*(\d+\.?\d*)g", text, re.IGNORECASE)
                item["sugar_g"] = float(sugar_match.group(1)) if sugar_match else None

                # Only save if we found Calories (Valid Item)
                if item["calories_kcal"]:
                    all_items.append(item)
                    print(f"      ---> Captured: {item['name_en']} ({item['calories_kcal']} kcal)")
                
            except Exception as e:
                print(f"      ❌ Failed: {e}")

        # 4. Save to JSON
        with open("mcd_final_data.json", "w") as f:
            json.dump(all_items, f, indent=2)
            
        print(f"\n🎉 DONE! Saved {len(all_items)} items to 'mcd_final_data.json'.")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
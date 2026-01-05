import asyncio
from playwright.async_api import async_playwright
import re

# Target: FatSecret Singapore (Generic Hawker Food)
BASE_URL = "https://www.fatsecret.com.sg/calories-nutrition/search?q="

# The "Missing Link" List: Items we want that aren't in Fast Food PDFs
SEARCH_TERMS = [
    "Nasi Lemak", "Roti Canai", "Teh Tarik", "Char Kway Teow", 
    "Chicken Rice", "Laksa", "Mee Goreng", "Satay", 
    "Roti Prata", "Curry Puff", "Wanton Mee"
]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print(f"🕵️  Scraping FatSecret for Local Hawker Food...")
        
        sql_statements = []

        for term in SEARCH_TERMS:
            print(f"   🔎 Searching: {term}...")
            await page.goto(f"{BASE_URL}{term}")
            
            # Extract first 3 results to get a "Range"
            results = await page.eval_on_selector_all("table.generic.searchResult td.borderBottom", """
                elements => elements.slice(0, 3).map(e => {
                    const title = e.querySelector('a.prominent').innerText;
                    const details = e.querySelector('div.smallText').innerText;
                    return {title, details};
                })
            """)

            for res in results:
                # Parse the text: "1 portion - Calories: 500kcal | Fat: 20g | Carbs: 50g | Prot: 15g"
                try:
                    name = res['title'].replace("'", "''")
                    details = res['details']
                    
                    # Regex Extraction
                    cal = re.search(r"Calories:\s*(\d+)", details)
                    fat = re.search(r"Fat:\s*(\d+\.?\d*)g", details)
                    carb = re.search(r"Carbs:\s*(\d+\.?\d*)g", details)
                    prot = re.search(r"Protein:\s*(\d+\.?\d*)g", details)
                    
                    if cal:
                        sql = f"""
                        INSERT INTO malaysian_foods (
                            name_en, name_bm, source, category, subcategory, verified, calories_kcal, 
                            protein_g, carbs_g, total_fat_g, serving_description
                        ) VALUES (
                            '{name} (Generic)', '{name} (Generic)', 'FatSecret', 'Hawker Food', 'Local', false,
                            {cal.group(1)},
                            {prot.group(1) if prot else 'NULL'},
                            {carb.group(1) if carb else 'NULL'},
                            {fat.group(1) if fat else 'NULL'},
                            '1 serving'
                        );
                        """
                        sql_statements.append(sql.strip())
                        print(f"      ✅ Captured: {name} ({cal.group(1)} kcal)")
                        
                except Exception as e:
                    print(f"      ❌ Error parsing {res['title']}: {e}")

        # Save to file
        with open("hawker_food_dump.sql", "w") as f:
            f.write("\n".join(sql_statements))
            
        print("\n🎉 DONE! SQL saved to 'hawker_food_dump.sql'")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
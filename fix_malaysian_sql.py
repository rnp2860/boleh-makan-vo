import re
import sys
import os

def fix_sql_arrays(input_path):
    # Setup filenames
    base, ext = os.path.splitext(input_path)
    output_path = f"{base}_fixed{ext}"

    print(f"🔧 Reading: {input_path}")
    
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"❌ Error: Could not find file at {input_path}")
        return

    # -------------------------------------------------------
    # 1. FIX ARRAYS: Change ['tag'] to ARRAY['tag']
    # -------------------------------------------------------
    pattern_array = re.compile(r"(?<!ARRAY)\[\s*'")
    content, count_array = pattern_array.subn("ARRAY['", content)
    
    # -------------------------------------------------------
    # 2. FIX APOSTROPHES: Double them up for SQL (' -> '')
    # -------------------------------------------------------
    # We use a specific list to be safe. 
    # Logic: "Nando's" is NOT found inside "Nando''s", so this is safe to run repeatedly.
    
    brands_to_fix = [
        "Domino's", 
        "McDonald's", 
        "Wendy's", 
        "Nando's", 
        "Kenny Rogers'", 
        "Chef's", 
        "Mum's", 
        "Grandma's",
        "Atuk's",
        "Opah's",
        "Carl's Jr",
        "Chili's",
        "Friday's",
        "Let's",
        "Baker's"
    ]
    
    count_apos = 0
    for brand in brands_to_fix:
        # Check if the unescaped brand exists
        if brand in content:
            # Calculate the escaped version (e.g., Nando''s)
            escaped_brand = brand.replace("'", "''")
            # Replace all occurrences
            content = content.replace(brand, escaped_brand)
            count_apos += 1
            print(f"   - Fixed apostrophe in: {brand}")

    # -------------------------------------------------------
    # 3. SAVE AND REPORT
    # -------------------------------------------------------
    print(f"✅ Fixed {count_array} missing ARRAY[] keywords.")
    if count_apos > 0:
        print(f"✅ Fixed apostrophes for {count_apos} brand/word types.")
    else:
        print("ℹ️  No unescaped apostrophes found (or already fixed).")

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"💾 Saved fixed file to: {output_path}")

if __name__ == "__main__":
    # Handle command line args or manual input
    if len(sys.argv) > 1:
        file_to_fix = sys.argv[1]
    else:
        # If running without args, clean up input just in case
        file_to_fix = input("Enter SQL file path: ")
    
    file_to_fix = file_to_fix.strip().strip("'").strip('"')
    fix_sql_arrays(file_to_fix)
import re

with open("src/map.ts", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update type LayerId
old_type = "'pass' | 'smallcity'"
new_type = "'capital' | 'city' | 'fort' | 'harbor' | 'battle'"
content = content.replace(old_type, new_type)
print("1. LayerId type: updated" if old_type in content else "1. LayerId type: already updated?")
# Check after replacement
if "'capital'" not in content:
    print("   WARNING: capital not found in LayerId!")

# 2. Update DEFAULT_ON_LAYERS
old_default = "new Set(['block','waterway','mountain'])"
new_default = "new Set(['capital','city','fort'])"
if old_default in content:
    content = content.replace(old_default, new_default)
    print("2. DEFAULT_ON_LAYERS: updated")
else:
    print("2. DEFAULT_ON_LAYERS: NOT FOUND, trying partial match...")
    # Try finding just the Set part
    idx = content.find("DEFAULT_ON_LAYERS")
    if idx >= 0:
        print(f"   Found at {idx}: ...{content[idx:idx+80]}...")

# 3. Add new LAYER_DEFS entries before block
new_entries = (
    "{ id:'capital', label:'都城', type:'point', color:'#C0392B',"
    " icon:'<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\">"
    "<polygon points=\"12,2 22,22 2,22\" fill=\"rgba(192,57,43,0.15)\" stroke=\"#C0392B\" stroke-width=\"1.5\"/>"
    "</svg>' },"
    "{ id:'city', label:'府州', type:'point', color:'#2C3E50',"
    " icon:'<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\">"
    "<rect x=\"3\" y=\"6\" width=\"18\" height=\"12\" rx=\"1\" fill=\"rgba(44,62,80,0.12)\" stroke=\"#2C3E50\" stroke-width=\"1.5\"/>"
    "</svg>' },"
    "{ id:'fort', label:'关隘', type:'point', color:'#A0522D',"
    " icon:'<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\">"
    "<line x1=\"7\" y1=\"7\" x2=\"17\" y2=\"17\" stroke=\"#A0522D\" stroke-width=\"3\" stroke-linecap=\"round\"/>"
    "<line x1=\"17\" y1=\"7\" x2=\"7\" y2=\"17\" stroke=\"#A0522D\" stroke-width=\"3\" stroke-linecap=\"round\"/>"
    "</svg>' },"
    "{ id:'harbor', label:'港口', type:'point', color:'#006666',"
    " icon:'<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\">"
    "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"rgba(0,102,102,0.15)\" stroke=\"#006666\" stroke-width=\"1.5\"/>"
    "</svg>' },"
    "{ id:'battle', label:'战场', type:'point', color:'#D4AC0D',"
    " icon:'<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\">"
    "<rect x=\"5\" y=\"5\" width=\"14\" height=\"14\" fill=\"rgba(212,172,13,0.15)\" stroke=\"#D4AC0D\" stroke-width=\"1.5\" transform=\"rotate(45,12,12)\"/>"
    "</svg>' },"
)

insert_marker = "{ id:'block', label:'"
idx = content.find(insert_marker)
if idx >= 0:
    content = content[:idx] + new_entries + content[idx:]
    print("3. LAYER_DEFS: added 5 new entries")
else:
    print("3. LAYER_DEFS insert point NOT FOUND!")

# 4. Remove pass and smallcity LAYER_DEFS entries
# Find pass entry
pass_marker = "{ id:'pass', label:'"
idx = content.find(pass_marker)
if idx >= 0:
    # Find the matching closing } of the object
    depth = 0
    end = idx
    for i in range(idx, len(content)):
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    # Also remove trailing comma if present
    while end < len(content) and content[end] in ' ,':
        end += 1
    content = content[:idx] + content[end:]
    print("4. Removed pass LAYER_DEFS entry")
else:
    print("4. pass entry NOT FOUND")

# Find smallcity entry (position may have changed)
smallcity_marker = "{ id:'smallcity', label:'"
idx = content.find(smallcity_marker)
if idx >= 0:
    # Remove preceding comma
    start = idx
    while start > 0 and content[start-1] in ' ,':
        start -= 1
    depth = 0
    end = idx
    for i in range(idx, len(content)):
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    while end < len(content) and content[end] in ' ,':
        end += 1
    content = content[:start] + content[end:]
    print("5. Removed smallcity LAYER_DEFS entry")
else:
    print("5. smallcity entry NOT FOUND")

with open("src/map.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("\nAll done!")

import re

with open("src/map.ts", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Change labels
content = content.replace("label:'府州'", "label:'府城'")
content = content.replace("label:'港口'", "label:'渡口'")
content = content.replace("label:'战场'", "label:'战役'")
print("Labels updated")

# 2. Update capital icon (都城) - double circle ◎
old_capital_icon = (
    "{ id:'capital', label:'都城', type:'point', color:'#C0392B',"
    " icon:'<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\">"
    "<polygon points=\"12,2 22,22 2,22\" fill=\"rgba(192,57,43,0.15)\" stroke=\"#C0392B\" stroke-width=\"1.5\"/>"
    "</svg>' },"
)
new_capital_icon = (
    "{ id:'capital', label:'都城', type:'point', color:'#C0392B',"
    " icon:'<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\">"
    "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#C0392B\" stroke-width=\"2\"/>"
    "<circle cx=\"12\" cy=\"12\" r=\"5\" fill=\"none\" stroke=\"#C0392B\" stroke-width=\"1.5\"/>"
    "</svg>' },"
)
if old_capital_icon in content:
    content = content.replace(old_capital_icon, new_capital_icon)
    print("Capital icon updated")
else:
    print("ERROR: Capital icon not found!")

# 3. Update city icon (府城) - circle with dot ⊙
old_city_icon = (
    "{ id:'city', label:'府州', type:'point', color:'#2C3E50',"
    " icon:'<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\">"
    "<rect x=\"3\" y=\"6\" width=\"18\" height=\"12\" rx=\"1\" fill=\"rgba(44,62,80,0.12)\" stroke=\"#2C3E50\" stroke-width=\"1.5\"/>"
    "</svg>' },"
)
new_city_icon = (
    "{ id:'city', label:'府城', type:'point', color:'#2C3E50',"
    " icon:'<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\">"
    "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#2C3E50\" stroke-width=\"1.5\"/>"
    "<circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"#2C3E50\"/>"
    "</svg>' },"
)
# The label was already changed above, so look for the new label
old_city_icon = old_city_icon.replace("label:'府州'", "label:'府城'")
if old_city_icon in content:
    content = content.replace(old_city_icon, new_city_icon)
    print("City icon updated")
else:
    print("ERROR: City icon not found!")
    # Try finding partial match
    idx = content.find("label:'府城'")
    if idx >= 0:
        print(f"Found 府城 at {idx}: ...{content[idx:idx+200]}...")

# 4. Update fort icon (关隘) - red X ✕
old_fort_icon = (
    "{ id:'fort', label:'关隘', type:'point', color:'#A0522D',"
    " icon:'<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\">"
    "<line x1=\"7\" y1=\"7\" x2=\"17\" y2=\"17\" stroke=\"#A0522D\" stroke-width=\"3\" stroke-linecap=\"round\"/>"
    "<line x1=\"17\" y1=\"7\" x2=\"7\" y2=\"17\" stroke=\"#A0522D\" stroke-width=\"3\" stroke-linecap=\"round\"/>"
    "</svg>' },"
)
new_fort_icon = (
    "{ id:'fort', label:'关隘', type:'point', color:'#C0392B',"
    " icon:'<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\">"
    "<line x1=\"5\" y1=\"5\" x2=\"19\" y2=\"19\" stroke=\"#C0392B\" stroke-width=\"3\" stroke-linecap=\"round\"/>"
    "<line x1=\"19\" y1=\"5\" x2=\"5\" y2=\"19\" stroke=\"#C0392B\" stroke-width=\"3\" stroke-linecap=\"round\"/>"
    "</svg>' },"
)
if old_fort_icon in content:
    content = content.replace(old_fort_icon, new_fort_icon)
    print("Fort icon updated")
else:
    print("ERROR: Fort icon not found!")

# 5. Update battle icon (战役) - crossed swords ⚔
old_battle_icon = (
    "{ id:'battle', label:'战场', type:'point', color:'#D4AC0D',"
    " icon:'<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\">"
    "<rect x=\"5\" y=\"5\" width=\"14\" height=\"14\" fill=\"rgba(212,172,13,0.15)\" stroke=\"#D4AC0D\" stroke-width=\"1.5\" transform=\"rotate(45,12,12)\"/>"
    "</svg>' },"
)
new_battle_icon = (
    "{ id:'battle', label:'战役', type:'point', color:'#D4AC0D',"
    " icon:'<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\">"
    "<line x1=\"6\" y1=\"4\" x2=\"14\" y2=\"15\" stroke=\"#D4AC0D\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>"
    "<line x1=\"18\" y1=\"4\" x2=\"10\" y2=\"15\" stroke=\"#D4AC0D\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>"
    "</svg>' },"
)
old_battle_icon = old_battle_icon.replace("label:'战场'", "label:'战役'")
if old_battle_icon in content:
    content = content.replace(old_battle_icon, new_battle_icon)
    print("Battle icon updated")
else:
    print("ERROR: Battle icon not found!")

# 6. Update harbor icon (渡口) - anchor ⚓
old_harbor_icon = (
    "{ id:'harbor', label:'港口', type:'point', color:'#006666',"
    " icon:'<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\">"
    "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"rgba(0,102,102,0.15)\" stroke=\"#006666\" stroke-width=\"1.5\"/>"
    "</svg>' },"
)
new_harbor_icon = (
    "{ id:'harbor', label:'渡口', type:'point', color:'#006666',"
    " icon:'<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\">"
    "<circle cx=\"12\" cy=\"6\" r=\"3\" fill=\"none\" stroke=\"#006666\" stroke-width=\"1.5\"/>"
    "<line x1=\"12\" y1=\"9\" x2=\"12\" y2=\"20\" stroke=\"#006666\" stroke-width=\"2\"/>"
    "<path d=\"M5 14L12 19L19 14\" fill=\"none\" stroke=\"#006666\" stroke-width=\"2\" stroke-linecap=\"round\"/>"
    "<line x1=\"5\" y1=\"11\" x2=\"19\" y2=\"11\" stroke=\"#006666\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>"
    "</svg>' },"
)
old_harbor_icon = old_harbor_icon.replace("label:'港口'", "label:'渡口'")
if old_harbor_icon in content:
    content = content.replace(old_harbor_icon, new_harbor_icon)
    print("Harbor icon updated")
else:
    print("ERROR: Harbor icon not found!")

with open("src/map.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("\nAll done!")

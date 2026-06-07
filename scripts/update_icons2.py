import re

with open("src/map.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Update city icon - use ⊙ character
old_city = (
    "{ id:'city', label:'府城', type:'point', color:'#2C3E50',"
    " icon:'<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\">"
    "<circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#2C3E50\" stroke-width=\"1.5\"/>"
    "<circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"#2C3E50\"/>"
    "</svg>' },"
)
new_city = (
    "{ id:'city', label:'府城', type:'point', color:'#2C3E50',"
    " icon:'<span style=\"font-size:20px;line-height:1;\">\u2299</span>' },"
)
if old_city in content:
    content = content.replace(old_city, new_city)
    print("City icon updated to \u2299")
else:
    print("ERROR: City not found")

# Update battle icon - use ⚔ character
old_battle = (
    "{ id:'battle', label:'战役', type:'point', color:'#D4AC0D',"
    " icon:'<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\">"
    "<line x1=\"6\" y1=\"4\" x2=\"14\" y2=\"15\" stroke=\"#D4AC0D\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>"
    "<line x1=\"18\" y1=\"4\" x2=\"10\" y2=\"15\" stroke=\"#D4AC0D\" stroke-width=\"2.5\" stroke-linecap=\"round\"/>"
    "</svg>' },"
)
new_battle = (
    "{ id:'battle', label:'战役', type:'point', color:'#D4AC0D',"
    " icon:'<span style=\"font-size:20px;line-height:1;\">\u2694</span>' },"
)
if old_battle in content:
    content = content.replace(old_battle, new_battle)
    print("Battle icon updated to \u2694")
else:
    print("ERROR: Battle not found")

with open("src/map.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")

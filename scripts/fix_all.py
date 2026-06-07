import json

# 1. Fix sync-cities.json - set all fontSize to 14
with open("public/sync-cities.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for layer in data:
    for feat in data[layer].get("features", []):
        props = feat.get("properties", {})
        if "fontSize" in props:
            props["fontSize"] = 14

with open("public/sync-cities.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False)
print("sync-cities.json: all fontSize -> 14")

# 2. Fix map.ts - add font-family to lblH span
with open("src/map.ts", "r", encoding="utf-8") as f:
    c = f.read()

# Add font-family to the span style in lblH
old = "text-shadow:0 0 6px rgba(255,255,255,0.7), 0 0 2px rgba(255,255,255,0.9);'"
new = "text-shadow:0 0 6px rgba(255,255,255,0.7), 0 0 2px rgba(255,255,255,0.9);font-family:'YingLuoChangAn','Noto Serif SC',serif;'"
c = c.replace(old, new)
print("lblH: font-family added")

# 3. Fix iconAnchor for pure text icons (city/battle) - adjust alignment
# City (府城) icon has panelSize and iconSize from getIc/panI
# DivIcon anchor is [iconSize[0]/2, iconSize[1]] which puts bottom-center at point
# For text icons we want center at point: anchor should be [s[0]/2, s[0]/2]
# Need to find getIc function and modify

# For divIcon, the anchor [s[0]/2, s[1]] means: horizontal center, vertical bottom
# We want: horizontal center, vertical center for text symbols
# Change iconAnchor for city and battle to center vertically

# Find getIc function and add special handling
old_getic = "function getIc(def:LayerDef):L.Icon|L.DivIcon{var s=def.iconSize||[24,24];if(def.image)return L.icon({iconUrl:def.image,iconSize:s,iconAnchor:[s[0]/2,s[1]],popupAnchor:[0,-s[1]]});return L.divIcon({html:def.icon||'',className:'',iconSize:s,iconAnchor:[s[0]/2,s[1]]})}"

new_getic = "function getIc(def:LayerDef):L.Icon|L.DivIcon{var s=def.iconSize||[24,24];if(def.image)return L.icon({iconUrl:def.image,iconSize:s,iconAnchor:[s[0]/2,s[1]],popupAnchor:[0,-s[1]]});var ay=s[1]/2;return L.divIcon({html:def.icon||'',className:'',iconSize:s,iconAnchor:[s[0]/2,ay],popupAnchor:[0,-ay]})}"

if old_getic in c:
    c = c.replace(old_getic, new_getic)
    print("getIc: iconAnchor centered vertically")
else:
    print("getIc NOT FOUND!")
    idx = c.find("function getIc")
    if idx >= 0:
        print(f"Found at {idx}: ...{c[idx:idx+200]}...")

with open("src/map.ts", "w", encoding="utf-8") as f:
    f.write(c)
print("map.ts updated")

import json

# 1. Update sync-cities.json colors
with open("public/sync-cities.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Harbor -> #3F6B78
for f in data.get("harbor", {}).get("features", []):
    f["properties"]["fontColor"] = "#3F6B78"

# Waterway -> #5A7D8C
for f in data.get("waterway", {}).get("features", []):
    f["properties"]["fontColor"] = "#5A7D8C"

# Battle -> #A06B00
for f in data.get("battle", {}).get("features", []):
    f["properties"]["fontColor"] = "#A06B00"

# Passage -> #9f572b + bgOpacity 100 (no text box)
for f in data.get("passage", {}).get("features", []):
    f["properties"]["fontColor"] = "#9f572b"
    f["properties"]["bgOpacity"] = 100

with open("public/sync-cities.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False)
print("sync-cities.json colors updated")

# 2. Update map.ts LAYER_DEFS colors
with open("src/map.ts", "r", encoding="utf-8") as f:
    c = f.read()

# Harbor: #006666 -> #3F6B78
c = c.replace("color:'#006666', icon:'<svg", "color:'#3F6B78', icon:'<svg")
print("Harbor color updated")

# Waterway: #3498db -> #5A7D8C
c = c.replace("color:'#3498db', weight:3", "color:'#5A7D8C', weight:3")
print("Waterway color updated")

# Battle: #D4AC0D -> #A06B00
c = c.replace("color:'#D4AC0D', icon:'<span", "color:'#A06B00', icon:'<span")
print("Battle color updated")

# Passage: #f39c12 -> #9f572b
c = c.replace("color:'#f39c12', weight:2.5", "color:'#9f572b', weight:2.5")
print("Passage color updated")

with open("src/map.ts", "w", encoding="utf-8") as f:
    f.write(c)
print("map.ts updated")

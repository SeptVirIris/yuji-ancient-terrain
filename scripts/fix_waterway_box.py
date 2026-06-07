import json

with open("public/sync-cities.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Set bgOpacity: 100 for waterway too (remove text box)
for f in data.get("waterway", {}).get("features", []):
    f["properties"]["bgOpacity"] = 100

# Verify a passage feature
pf = data["passage"]["features"][0]
wf = data["waterway"]["features"][0]
print(f"Passage sample: {pf['properties']}")
print(f"Waterway sample: {wf['properties']}")

with open("public/sync-cities.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False)
print("\nWaterway bgOpacity set to 100")

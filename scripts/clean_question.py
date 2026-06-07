import json

with open("public/sync-cities.json", "r", encoding="utf-8") as f:
    data = json.load(f)

total_removed = 0
for layer in data:
    features = data[layer].get("features", [])
    before = len(features)
    data[layer]["features"] = [f for f in features if "?" not in f.get("properties", {}).get("name", "")]
    after = len(data[layer]["features"])
    removed = before - after
    if removed > 0:
        total_removed += removed
        print(f"{layer}: removed {removed} (was {before}, now {after})")

with open("public/sync-cities.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False)

print(f"\nTotal removed: {total_removed}")

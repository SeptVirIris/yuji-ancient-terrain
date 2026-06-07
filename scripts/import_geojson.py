import sys, json

# Read from stdin (GeoJSON piped from PowerShell)
src = json.loads(sys.stdin.read())

with open("public/sync-cities.json", "r", encoding="utf-8") as f:
    sync = json.load(f)

for layer in ["capital","city","fort","harbor","battle","block","waterway","mountain","passage"]:
    if layer not in sync:
        sync[layer] = {"type":"FeatureCollection","features":[]}

added = {k: 0 for k in sync}
kept = {k: len(sync[k]["features"]) for k in sync}

symbol_map = {
    "capital": "capital", "county": "city", "province": "city",
    "guanai": "fort", "chengshi": "fort", "zhanchang": "battle", "harbor": "harbor",
}

passage_colors = {"#808080", "#2F4F4F", "#FFD700", "#4169E1", "#1E90FF", "#228B22"}
waterway_colors = {"#CCFFFF", "#00BBBB"}
mountain_colors = {"#A0522D", "#4B0082", "#800080"}

existing_names = {}
for layer in sync:
    existing_names[layer] = set()
    for f in sync[layer]["features"]:
        name = f.get("properties", {}).get("name", "")
        if name:
            existing_names[layer].add(name)

for feature in src.get("features", []):
    props = feature.get("properties", {})
    geom = feature.get("geometry", {})
    geom_type = geom.get("type", "")
    
    if geom_type == "Point":
        symbol = props.get("marker-symbol", "")
        target_layer = symbol_map.get(symbol)
        if not target_layer:
            continue
        name = props.get("title", "")
        if not name:
            continue
        if name in existing_names[target_layer]:
            continue
        
        new_feat = {
            "type": "Feature",
            "properties": {
                "name": name,
                "fontSize": 9 if target_layer == "city" else 12,
                "fontColor": "#000000",
                "bgOpacity": 100,
                "fontWeight": 400 if target_layer == "city" else 700
            },
            "geometry": {"type": "Point", "coordinates": geom["coordinates"]}
        }
        if target_layer == "capital":
            new_feat["properties"]["fontSize"] = 14
            new_feat["properties"]["fontWeight"] = 700
        
        sync[target_layer]["features"].append(new_feat)
        added[target_layer] += 1
        existing_names[target_layer].add(name)
        
    elif geom_type == "LineString":
        stroke = props.get("stroke", "")
        name = props.get("title", "")
        if not name:
            continue
        
        if stroke in passage_colors:
            target_layer = "passage"
        elif stroke in waterway_colors:
            target_layer = "waterway"
        elif stroke in mountain_colors:
            target_layer = "mountain"
        else:
            stroke_opacity = props.get("stroke-opacity", "")
            if str(stroke_opacity) == "0.1":
                target_layer = "mountain"
            else:
                target_layer = "passage"
        
        if name in existing_names[target_layer]:
            continue
        
        new_feat = {
            "type": "Feature",
            "properties": {"name": name},
            "geometry": {"type": "LineString", "coordinates": geom["coordinates"]}
        }
        if "description" in props:
            new_feat["properties"]["description"] = props["description"]
        
        sync[target_layer]["features"].append(new_feat)
        added[target_layer] += 1
        existing_names[target_layer].add(name)

print("=== 导入结果 ===")
for layer in ["capital","city","fort","harbor","battle","block","waterway","mountain","passage"]:
    print("  {}: 原有{} + 新增{} = 总计{}".format(layer, kept[layer], added[layer], len(sync[layer]["features"])))

with open("public/sync-cities.json", "w", encoding="utf-8") as f:
    json.dump(sync, f, ensure_ascii=False)

print("\nDone!")

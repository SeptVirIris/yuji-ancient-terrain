with open("src/map.ts", "r", encoding="utf-8") as f:
    c = f.read()

# 1. Update lblH to add map-label class to the span
old_lbl = "return'<span style=\"font-size:'+(fs||14)+'px;color:'+(fc||'#f0e6d3')+';font-weight:'+(fw||700)+';text-shadow:0 0 6px rgba(255,255,255,0.7), 0 0 2px rgba(255,255,255,0.9);font-family:YingLuoChangAn,Noto Serif SC,serif;'+(op!==undefined?'opacity:'+op+';':'')+'\">'+n+'</span>'"
new_lbl = "return'<span class=\"map-label\" style=\"font-size:'+(fs||14)+'px;color:'+(fc||'#3D2F1F')+';font-weight:'+(fw||700)+';font-family:YingLuoChangAn,Noto Serif SC,serif;'+(op!==undefined?'opacity:'+op+';':'')+'\">'+n+'</span>'"

if old_lbl in c:
    c = c.replace(old_lbl, new_lbl)
    print("lblH updated: map-label class, default color #3D2F1F, removed inline text-shadow")
else:
    print("lblH NOT FOUND")

# 2. Update bTT className
old_btt = "className:(bgOp===100?\"no-bg\":\"yuji-label\")"
new_btt = "className:(bgOp===100?\"no-bg map-label\":\"map-label\")"
if old_btt in c:
    c = c.replace(old_btt, new_btt)
    print("bTT className updated to map-label")
else:
    print("bTT NOT FOUND")

# 3. Update switchB for city color on imagery basemap
# Find the existing city color switching code
old_switch = "['smallcity','pass'].forEach(function(k){featureGroups[k]&&featureGroups[k].eachLayer(function(l:any){"
new_switch = "['city','smallcity','pass'].forEach(function(k){featureGroups[k]&&featureGroups[k].eachLayer(function(l:any){"

if old_switch in c:
    c = c.replace(old_switch, new_switch)
    print("switchB: added city to color switching")
else:
    print("switchB city: NOT FOUND")
    # Try to find it
    idx = c.find("smallcity','pass']")
    if idx >= 0:
        print(f"Found at {idx}: ...{c[idx:idx+200]}...")

with open("src/map.ts", "w", encoding="utf-8") as f:
    f.write(c)
print("Done")

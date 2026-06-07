with open("src/map.ts", "r", encoding="utf-8") as f:
    c = f.read()

# Find the switchB city color code and update it to also change DivIcon
old = "['city','smallcity','pass'].forEach(function(k){featureGroups[k]&&featureGroups[k].eachLayer(function(l:any){var p=l.feature?.properties;if(p){var tt=l.getTooltip();if(tt){var n=p.name||LAYER_DEFS.find(function(d){return d.id===k})?.label||'';p.fontColor=cityColor;tt.setContent(lblH(n,p.fontSize,cityColor,p.opacity))}}})})"

new = "['city','smallcity','pass'].forEach(function(k){featureGroups[k]&&featureGroups[k].eachLayer(function(l:any){var p=l.feature?.properties;if(p){var tt=l.getTooltip();if(tt){var n=p.name||LAYER_DEFS.find(function(d){return d.id===k})?.label||'';p.fontColor=cityColor;tt.setContent(lblH(n,p.fontSize,cityColor,p.opacity))};if(k==='city'&&l instanceof L.Marker){var ic=l.getIcon();if(ic&&ic.options&&ic.options.html){l.setIcon(L.divIcon({html:ic.options.html,className:'',iconSize:[20,20],iconAnchor:[10,10],popupAnchor:[0,-10]}))}}}})})"

if old in c:
    c = c.replace(old, new)
    print("switchB: city icon update added")
else:
    print("switchB NOT FOUND")

with open("src/map.ts", "w", encoding="utf-8") as f:
    f.write(c)
print("Done")

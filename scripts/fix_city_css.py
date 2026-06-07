with open("src/map.ts", "r", encoding="utf-8") as f:
    c = f.read()

# 1. Add class to city icon span for CSS targeting
old = "icon:'<span style=\"font-size:15px;line-height:1;\">\u2299</span>' }"
new = "icon:'<span class=\"city-icon\" style=\"font-size:15px;line-height:1;\">\u2299</span>' }"
if old in c:
    c = c.replace(old, new)
    print("City icon: class added")
else:
    print("City icon NOT FOUND")

# 2. Revert the complex switchB change and keep it simple
old_switch = "['city','smallcity','pass'].forEach(function(k){featureGroups[k]&&featureGroups[k].eachLayer(function(l:any){var p=l.feature?.properties;if(p){var tt=l.getTooltip();if(tt){var n=p.name||LAYER_DEFS.find(function(d){return d.id===k})?.label||'';p.fontColor=cityColor;tt.setContent(lblH(n,p.fontSize,cityColor,p.opacity))};if(k==='city'&&l instanceof L.Marker){var ic=l.getIcon();if(ic&&ic.options&&ic.options.html){l.setIcon(L.divIcon({html:ic.options.html,className:'',iconSize:[20,20],iconAnchor:[10,10],popupAnchor:[0,-10]}))}}}})})"
new_switch = "['city','smallcity','pass'].forEach(function(k){featureGroups[k]&&featureGroups[k].eachLayer(function(l:any){var p=l.feature?.properties;if(p){var tt=l.getTooltip();if(tt){var n=p.name||LAYER_DEFS.find(function(d){return d.id===k})?.label||'';p.fontColor=cityColor;tt.setContent(lblH(n,p.fontSize,cityColor,p.opacity))}}})})"
if old_switch in c:
    c = c.replace(old_switch, new_switch)
    print("switchB: simplified")
else:
    # Try without the complex part
    old_switch = "['city','smallcity','pass'].forEach(function(k){featureGroups[k]&&featureGroups[k].eachLayer(function(l:any){"
    if old_switch in c:
        print("switchB: city already in list (no icon update needed)")

with open("src/map.ts", "w", encoding="utf-8") as f:
    f.write(c)
print("Done")

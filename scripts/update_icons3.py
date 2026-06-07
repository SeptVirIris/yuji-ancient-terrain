with open("src/map.ts", "r", encoding="utf-8") as f:
    c = f.read()

# City icon: find end of SVG and replace
old = "icon:'<svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"#2C3E50\" stroke-width=\"1.5\"/><circle cx=\"12\" cy=\"12\" r=\"3\" fill=\"#2C3E50\"/></svg>'"
new = "icon:'<span style=\"font-size:15px;line-height:1;\">\u2299</span>'"

if old in c:
    c = c.replace(old, new)
    print("City updated")
else:
    print("City NOT FOUND, searching...")
    idx = c.find("label:'府城'")
    print(f"Found at {idx}: {c[idx:idx+250]}")

# Battle icon  
old = "icon:'<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\"><line x1=\"6\" y1=\"4\" x2=\"14\" y2=\"15\" stroke=\"#D4AC0D\" stroke-width=\"2.5\" stroke-linecap=\"round\"/><line x1=\"18\" y1=\"4\" x2=\"10\" y2=\"15\" stroke=\"#D4AC0D\" stroke-width=\"2.5\" stroke-linecap=\"round\"/></svg>'"
new = "icon:'<span style=\"font-size:20px;line-height:1;\">\u2694</span>'"

if old in c:
    c = c.replace(old, new)
    print("Battle updated")
else:
    print("Battle NOT FOUND")

with open("src/map.ts", "w", encoding="utf-8") as f:
    f.write(c)
print("Done")

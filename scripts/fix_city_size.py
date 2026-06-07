with open("src/map.ts", "r", encoding="utf-8") as f:
    c = f.read()
# Only change city icon (府城 ⊙), reduce from 20px to 16px
c = c.replace(
    "label:'府城', type:'point', color:'#2C3E50', icon:'<span style=\"font-size:20px;line-height:1;\">\u2299</span>' }",
    "label:'府城', type:'point', color:'#2C3E50', icon:'<span style=\"font-size:15px;line-height:1;\">\u2299</span>' }"
)
with open("src/map.ts", "w", encoding="utf-8") as f:
    f.write(c)
print("Done")

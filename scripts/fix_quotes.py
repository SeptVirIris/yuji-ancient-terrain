with open("src/map.ts", "r", encoding="utf-8") as f:
    c = f.read()

# Fix the font-family - remove single quotes that break JS string
old = "font-family:'YingLuoChangAn','Noto Serif SC',serif;'"
new = "font-family:YingLuoChangAn,Noto Serif SC,serif;'"
c = c.replace(old, new)
print("Fixed font-family quotes")

with open("src/map.ts", "w", encoding="utf-8") as f:
    f.write(c)
print("Done")

with open("src/map.ts", "r", encoding="utf-8") as f:
    c = f.read()
c = c.replace("font-size:20px", "font-size:16px")
with open("src/map.ts", "w", encoding="utf-8") as f:
    f.write(c)
print("Done")

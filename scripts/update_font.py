with open("src/map.ts", "r", encoding="utf-8") as f:
    c = f.read()

# 1. Change default font size in lblH from 13 to 14
c = c.replace("(fs||13)", "(fs||14)")
print("lblH font size: 13->14")

# 2. Change tooltip offset from [0,-18] to [0,-6] (no arrow, less offset)
c = c.replace("offset:[0,-18]", "offset:[0,-6]")
print("Tooltip offset: -18 -> -6")

with open("src/map.ts", "w", encoding="utf-8") as f:
    f.write(c)
print("Done")

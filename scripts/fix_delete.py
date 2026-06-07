with open("src/main.ts", "r", encoding="utf-8") as f:
    c = f.read()

# Find loadSyncData and add localStorage check
old = "async function loadSyncData(){try{var resp=await fetch(import.meta.env.BASE_URL+'sync-cities.json');var data=await resp.json();localStorage.setItem('yuji-layer-data',JSON.stringify(data));console.log"
new = "async function loadSyncData(){if(localStorage.getItem('yuji-layer-data'))return;try{var resp=await fetch(import.meta.env.BASE_URL+'sync-cities.json');var data=await resp.json();localStorage.setItem('yuji-layer-data',JSON.stringify(data));console.log"

if old in c:
    c = c.replace(old, new)
    print("Updated loadSyncData: skip if localStorage exists")
else:
    print("ERROR: loadSyncData not found!")
    idx = c.find("loadSyncData")
    if idx >= 0:
        print(f"Found at {idx}: ...{c[idx:idx+200]}...")

with open("src/main.ts", "w", encoding="utf-8") as f:
    f.write(c)
print("Done")

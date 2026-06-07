with open("src/main.ts", "r", encoding="utf-8") as f:
    c = f.read()

# Match the actual multiline format
old = """async function loadSyncData() {
  try {
    var resp = await fetch(import.meta.env.BASE_URL + 'sync-cities.json')
    var data = await resp.json()
    localStorage.setItem('yuji-layer-data', JSON.stringify(data))"""

new = """async function loadSyncData() {
  if(localStorage.getItem('yuji-layer-data')) return
  try {
    var resp = await fetch(import.meta.env.BASE_URL + 'sync-cities.json')
    var data = await resp.json()
    localStorage.setItem('yuji-layer-data', JSON.stringify(data))"""

if old in c:
    c = c.replace(old, new)
    print("Updated loadSyncData")
else:
    print("NOT FOUND")

with open("src/main.ts", "w", encoding="utf-8") as f:
    f.write(c)
print("Done")

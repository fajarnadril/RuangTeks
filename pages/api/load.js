
export default async function handler(req, res) {
  try {
    const response = await fetch("https://raw.githubusercontent.com/fajarbinus/RuangTeks/main/data.json");
    const raw = await response.text();
    console.log("RAW CONTENT:", raw);
    const data = JSON.parse(raw);
    res.status(200).json(data);
  } catch (err) {
    console.error("LOAD ERROR", err);
    res.status(500).json({ error: "Failed to load text" });
  }
}

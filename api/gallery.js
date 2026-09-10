const { upstashCommand } = require("./_upstash");

const LIST_KEY = "math_reels_gallery";
const MAX_ITEMS = 5;

module.exports = async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      const raw = await upstashCommand(["LRANGE", LIST_KEY, "0", String(MAX_ITEMS - 1)]);
      const toRemove = (raw || []).filter(entry => {
        try { return JSON.parse(entry).caption === "diagnostic-test"; } catch (e) { return false; }
      });
      for (const entry of toRemove) {
        await upstashCommand(["LREM", LIST_KEY, "0", entry]);
      }
      res.status(200).json({ removed: toRemove.length });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  try {
    const raw = await upstashCommand(["LRANGE", LIST_KEY, "0", String(MAX_ITEMS - 1)]);

    const items = (raw || [])
      .map(entry => {
        try { return JSON.parse(entry); } catch (e) { return null; }
      })
      .filter(Boolean);

    res.status(200).json({ items });
  } catch (err) {
    res.status(200).json({ items: [] });
  }
};

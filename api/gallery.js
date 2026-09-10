const { upstashCommand } = require("./_upstash");

const LIST_KEY = "math_reels_gallery";
const MAX_ITEMS = 5;

module.exports = async function handler(req, res) {
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

const { Credential } = require("../../common/model");

module.exports = async (req, res, next) => {
  const apiKey = req.get("API-Key");
  const exist = await Credential.exists({ apiKey });

  if (!exist) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    next();
  }
};

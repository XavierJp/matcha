const express = require("express");
const config = require("config");
const logger = require("../common/logger");
const bodyParser = require("body-parser");
const logMiddleware = require("./middlewares/logMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const tryCatch = require("./middlewares/tryCatchMiddleware");
const corsMiddleware = require("./middlewares/corsMiddleware");
const packageJson = require("../../package.json");

const login = require("./routes/login");
const user = require("./routes/user");
const password = require("./routes/password");
const formulaire = require("./routes/formulaire");
const entreprise = require("./routes/entreprise");
const esSearch = require("./routes/esSearch");

module.exports = async (components) => {
  const { db } = components;
  const app = express();

  app.use(bodyParser.json());
  // Parse the ndjson as text for ES proxy
  app.use(bodyParser.text({ type: "application/x-ndjson" }));

  app.use(corsMiddleware());
  app.use(logMiddleware());

  app.use("/api/user", user(components));
  app.use("/api/login", login(components));
  app.use("/api/password", password(components));
  app.use("/api/formulaire", formulaire(components));
  app.use("/api/entreprise", entreprise());
  app.use("/api/es/search", esSearch());

  app.get(
    "/api",
    tryCatch(async (req, res) => {
      let mongodbStatus;
      await db
        .collection("formulaires")
        .stats()
        .then(() => {
          mongodbStatus = true;
        })
        .catch((e) => {
          mongodbStatus = false;
          logger.error("Healthcheck failed", e);
        });

      return res.json({
        name: `Serveur MNA - ${config.appName}`,
        version: packageJson.version,
        env: config.env,
        healthcheck: {
          mongodb: mongodbStatus,
        },
      });
    })
  );

  app.use(errorMiddleware());

  return app;
};

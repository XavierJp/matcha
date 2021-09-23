const config = require("config");
const express = require("express");
const bodyParser = require("body-parser");
const swaggerDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const logger = require("../common/logger");
const packageJson = require("../../package.json");
const swaggerSchema = require("../common/model/swaggerSchema");
const logMiddleware = require("./middlewares/logMiddleware");
const tryCatch = require("./middlewares/tryCatchMiddleware");
const corsMiddleware = require("./middlewares/corsMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const apiMiddleware = require("./middlewares/apiKeyAuthMiddleware");

const user = require("./routes/user");
const login = require("./routes/login");
const esSearch = require("./routes/esSearch");
const password = require("./routes/password");
const formulaire = require("./routes/formulaire");
const entreprise = require("./routes/entreprise");
const externalAPI = require("./routes/api");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Matcha",
      version: "1.0.0",
      description: `Vous trouverez ici la définition de l'api Matcha<br/><br/>
      <h3><strong>${config.publicUrl}/api/v1</strong></h3><br/>
      Contact:
      `,
      contact: {
        name: "Mission Nationale pour l'apprentissage",
        url: "https://mission-apprentissage.gitbook.io/general/",
        email: "matcha@apprentissage.beta.gouv.fr",
      },
    },
    servers: [
      {
        url: `${config.publicUrl}/api/v1/formulaire`,
      },
    ],
  },
  apis: ["./src/http/routes/api.js"],
};

const swaggerSpecification = swaggerDoc(swaggerOptions);

swaggerSpecification.components = {
  schemas: swaggerSchema,
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "api-key",
    },
  },
};

module.exports = async (components) => {
  const { db } = components;
  const app = express();

  app.use(bodyParser.json());
  // Parse the ndjson as text for ES proxy
  app.use(bodyParser.text({ type: "application/x-ndjson" }));

  app.use(corsMiddleware());
  app.use(logMiddleware());

  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecification));

  app.use("/api/user", user(components));
  app.use("/api/login", login(components));
  app.use("/api/password", password(components));
  app.use("/api/formulaire", formulaire(components));
  app.use("/api/entreprise", entreprise());
  app.use("/api/es/search", esSearch());
  app.use("/api/v1/formulaire", apiMiddleware, externalAPI(components));

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

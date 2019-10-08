import express from "express";
import consola from "consola";
import axios from "axios";
import bodyParser from "body-parser";
const { Nuxt, Builder } = require("nuxt");

// Import and Set Nuxt.js options
const config = require("../nuxt.config.js");
const app = express();
config.dev = process.env.NODE_ENV !== "production";

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;

  app.use(bodyParser.json());

  const router = express.Router();

  router.post("/subscribe", async (req, res) => {
    // axios seems to be omitting payload properties with emoty values
    // so instead of an object, we send the querystring
    const data = Object.keys(req.body)
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(req.body[k])}`)
      .join("&");

    const mailchimpResp = await axios.post(
      "https://grakn.us8.list-manage.com/subscribe/post-json?u=b27e8984466b0dc642a917ba5&amp;id=3f1ff0278f&c=?",
      data
    );

    let response = mailchimpResp.data.slice(2, -1);
    response = JSON.parse(response);
    const result = response.result;
    // mailchimp's error messages are indexed. removing the indexing
    const message = response.msg.replace(/\d* - /g, "");
    res.json({ result, message });
  });

  app.use(router);

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}
start();

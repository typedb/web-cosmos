const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (
    !req.secure &&
    req.get("x-forwarded-proto") !== "https" &&
    process.env.NODE_ENV === "production"
  ) {
    return res.redirect("https://" + req.get("host") + req.url);
  }
  next();
}
app.use(requireHTTPS);

app.use(express.static("public"));

//make way for some custom css, js and images
app.use("/css", express.static(__dirname + "/dist/css"));
app.use("/js", express.static(__dirname + "/dist/js"));
app.use("/img", express.static(__dirname + "/dist/img"));
app.use("/icons", express.static(__dirname + "/dist/icons"));
app.use("/fonts", express.static(__dirname + "/dist/fonts"));

const homePath = path.join(__dirname, "/dist/index-post.html");
app.get("/", function(req, res) {
  res.sendFile(homePath);
});

const speakersPath = path.join(__dirname, "/dist/speakers.html");
app.get("/speakers", function(req, res) {
  res.sendFile(speakersPath);
});

const sessionsPath = path.join(__dirname, "/dist/sessions.html");
app.get("/sessions", function(req, res) {
  res.sendFile(sessionsPath);
});

const schedulePath = path.join(__dirname, "/dist/schedule.html");
app.get("/schedule", function(req, res) {
  res.sendFile(schedulePath);
});

const termsPath = path.join(__dirname, "/dist/terms.html");
app.get("/terms", function(req, res) {
  res.sendFile(termsPath);
});

const cocPath = path.join(__dirname, "/dist/code-of-conduct.html");
app.get("/code-of-conduct", function(req, res) {
  res.sendFile(cocPath);
});

const privacyPath = path.join(__dirname, "/dist/privacy-policy.html");
app.get("/privacy-policy", function(req, res) {
  res.sendFile(privacyPath);
});

// promo pages

const thankyouPath = path.join(__dirname, "/dist/thank-you.html");
app.get("/thankyou", function(req, res) {
  res.sendFile(thankyouPath);
});

const enterprisePromoPath = path.join(__dirname, "/dist/promo-enterprise.html");
app.get("/promo/enterprise", function(req, res) {
  res.sendFile(enterprisePromoPath);
});

const studentPromoPath = path.join(__dirname, "/dist/promo-student.html");
app.get("/promo/student", function(req, res) {
  res.sendFile(studentPromoPath);
});

// const communityPromoPath = path.join(__dirname, "/dist/promo-community.html");
// app.get("/promo/community", function(req, res) {
//   res.sendFile(communityPromoPath);
// });

app.post("/thankyou", function(req, res) {
  res.redirect("/thankyou?source=" + req.query.source);
});

// end of promo pages

// eventbrite endpoints
app.get("/generate-discount-code", async function(req, res) {
  const token = process.env.TOKEN_EVENTBRITE;
  try {
    const ebResp = await axios.post(
      "https://www.eventbriteapi.com/v3/organizations/296913036651/discounts/",
      {
        discount: {
          type: "access",
          code: makeCode(10),
          event_id: "58504110369",
          quantity_available: 1,
          percent_off: 100
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    const code = ebResp.data.code;
    res.json({
      status: 200,
      code
    });
  } catch (err) {
    console.log(err.response);
    res.json({
      status: err.response.status
    });
  }
});
// end of eventbrite endpoints

function makeCode(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const notFoundPath = path.join(__dirname, "/dist/404.html");
app.get("*", function(req, res) {
  res.sendFile(notFoundPath);
});

var server = app.listen(process.env.PORT || 3000, function() {
  var port = server.address().port;
  console.log("Server started at http://localhost:%s", port);
});

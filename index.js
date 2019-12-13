var express = require("express");
var app = express();
var path = require("path");

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

const homePath = path.join(__dirname, "/dist/index.html");
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

const enterprisePromoPath = path.join(__dirname, "/dist/promo-enterprise.html");
app.get("/promo/enterprise", function(req, res) {
  res.sendFile(enterprisePromoPath);
});

// const studentPromoPath = path.join(__dirname, "/dist/promo-student.html");
// app.get("/promo/student", function(req, res) {
//   res.sendFile(studentPromoPath);
// });

// const communityPromoPath = path.join(__dirname, "/dist/promo-community.html");
// app.get("/promo/community", function(req, res) {
//   res.sendFile(communityPromoPath);
// });

// end of promo pages

const notFoundPath = path.join(__dirname, "/dist/404.html");
app.get("*", function(req, res) {
  res.sendFile(notFoundPath);
});

var server = app.listen(process.env.PORT || 3000, function() {
  var port = server.address().port;
  console.log("Server started at http://localhost:%s", port);
});

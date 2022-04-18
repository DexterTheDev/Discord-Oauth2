const express = require('express');
const app = express();

const Oauth2 = new (require("./oauth2"))({
    callback: "http://localhost:3000/callback",
    clientID: "",
    clientSecret: "",
    scopes: ["identify"]
})
app
    .use(require("express-session")({
        cookie: { maxAge: 50000000 },
        secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
        resave: false,
        saveUninitialized: false,
    }))
    .use(async (req, res, next) => { req.user = (await Oauth2.getUser(req)); next() })
    .get("/login", (req, res) => Oauth2.authorize(res))
    .get("/callback", async (req, res) => Oauth2.getToken(req, req.query.code).then(() => res.redirect("/")))
    .get("/", (req, res) => res.send(req.user))
    .get("/logout", (req, res) => req.session.destroy(() => {
        res.redirect("/");
    }))
    .listen(3000, () => console.log(`Oauth2 is connected...`));

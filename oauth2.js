const fetch = require("node-fetch");
let AuthOptions = {};

class Oauth2 {
    constructor(options = {}) { AuthOptions = options }

    authorize(res) {
        return res.redirect(`https://discord.com/oauth2/authorize?response_type=code&redirect_uri=${AuthOptions.callback}&scope=${AuthOptions.scopes.join(" ")}&client_id=${AuthOptions.clientID}`);
    }

    async getUser(req) {
        const resp = await fetch(`https://discord.com/api/users/@me`,
            {
                method: 'GET',
                headers: {
                    "authorization": `${req.session.token_type} ${req.session.access_token}`
                }
            });

        return await resp?.json() ?? null
    }

    async getToken(req, code) {
        const resp = await fetch(`https://discordapp.com/api/oauth2/token`,
            {
                method: 'POST',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    client_id: AuthOptions.clientID,
                    client_secret: AuthOptions.clientSecret,
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: AuthOptions.callback,
                    scope: AuthOptions.scopes.join(" ")
                })
            });

        const json = await resp?.json();

        req.session.access_token = json.access_token;
        req.session.token_type = json.token_type;

        return this.getUser(req);
    }
}

module.exports = Oauth2;

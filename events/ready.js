require("dotenv").config();
const register = require("../modules/register");
const cmds = require("../modules/cmds");
const {
    Permissions
} = require('discord.js')

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
      cmds(client); register(client);
    console.log(
      `\x1b[31m%s\x1b[0m`,
      `[STATUS]`,
      `Logged in as ${client.user.tag}`
    );
    client.user.setPresence({ activities: [{ name: 'Visual Studio Code' }], status: 'online', type: 'watching' });
  },
};

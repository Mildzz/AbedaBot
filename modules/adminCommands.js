const {Collection} = require("discord.js");
const fs = require("fs");

module.exports = async (client) => {
  client.adminCommands = new Collection();

  const commandFiles = fs
    .readdirSync("./adminCommands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`../adminCommands/${file}`);

    client.adminCommands.set(command.data.name, command, command.data.layer);
  }
};

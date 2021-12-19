const {Collection} = require("discord.js");
const fs = require("fs");

module.exports = async (client) => {
  client.staffCommands = new Collection();

  const commandFiles = fs
    .readdirSync("./staffCommands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`../staffCommands/${file}`);

    client.staffCommands.set(command.data.name, command, command.data.layer);
  }
};

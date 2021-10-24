require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

module.exports = async () => {
  const commands = [];
  const commandFiles = fs
    .readdirSync(`./commands/`)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({
    version: "9",
  }).setToken(process.env.TOKEN);

  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");

      // await rest.put(
      //     Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID),
      //     { body: commands },
      // );

      await rest.put(Routes.applicationCommands(process.env.clientID), {
        body: commands,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  })();
};

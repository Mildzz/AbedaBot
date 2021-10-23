const GuildConfig = require("../schemas/GuildConfigSchema");

module.exports = {
  name: "guildCreate",
  async execute(guild) {
    try {
      await GuildConfig.create({
        guildId: guild.id,
      });
      console.log(`Bot has joined \`${guild.name}\`. Saved to DB.`);
    } catch (e) {
      console.log(e);
    }
  },
};

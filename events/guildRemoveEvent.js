const {MessageEmbed} = require("discord.js");
module.exports = {
  name: "guildDelete",
  async execute(guild) {
    try {
      const Database = require("better-sqlite3");
      const db = new Database("guildconf.db");
      db.exec(`DELETE FROM guilds WHERE guildId = ${guild.id}`);
    } catch (e) {
      console.log(e);
    }

    const leaveEmbed = new MessageEmbed()
      .setTitle('Guild Left')
      .setDescription(`Left "${guild.name}" with ${guild.members.cache.size} members.`)
      .setFooter(`Owner: ${guild.ownerId}`, guild.iconURL())
      .setColor(0xd84343)

    guild.client.guilds.cache.get('886114589102714890').channels.cache.get('913578547451408414').send({embeds: [leaveEmbed]})

  },
};

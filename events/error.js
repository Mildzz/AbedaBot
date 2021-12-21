const {MessageEmbed} = require("discord.js");

module.exports = {
  name: "error",
  async execute(error, client) {

    const errorEmbed = new MessageEmbed()
      .setTitle('An error has occurred')
      .setDescription(error)
      .setColor(0xd84343)

    client.guilds.cache.get('886114589102714890')?.channels.cache.get('913578918156595211').send({embeds: [errorEmbed]})
  },
};

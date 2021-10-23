module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        if (reaction.message.partial) await reaction.message.fetch()
        if (reaction.partial) await reaction.fetch()
        if (user.bot) return
        if (!reaction.message.guild) return
        if (reaction.message.channel.id === '886434431060041748') {
            if (reaction.emoji.id === '886438232156413992') {
                await reaction.message.guild.members.cache.get(user.id).roles.add('886438940402384896') // announcements
            }
            if (reaction.emoji.id === '886438132675932191') {
                reaction.message.channel.guild.members.cache.get(user.id).roles.add('886438962481233941') // giveaways
            }
            if (reaction.emoji.id === '886438162589683722') {
                reaction.message.channel.guild.members.cache.get(user.id).roles.add('886438979849842718') // updates
            }
        }
         if (reaction.message.channel.id === '886114589102714894') {
            if (reaction.emoji.id === '886484165971816468') {
                reaction.message.channel.guild.members.cache.get(user.id).roles.add('886155234869669908') // rules
            }
        }
    }
}
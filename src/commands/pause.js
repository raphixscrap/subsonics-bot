const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Met en pause la musique jouée !"),

    async execute(client, interaction) {

        if(!interaction.member.voice.channel) return interaction.reply({content:"Vous devez rejoindre un salon vocal !", ephemeral: true})
   
        let player = client.manager.players.get(interaction.guild.id)

        if(player) {

            if(player.playing) {
                
                const embed = new EmbedBuilder()
                .setColor(0x03ff2d)
                .setTitle('Pause !')
                .setDescription("**Ok, une entracte est demandée par " + interaction.member.user.username + "**")
                .setTimestamp();

            
                interaction.reply({embeds: [embed]})
     
                player.pause(true)
            } else {
                interaction.reply("**Aucune musique n'est actuellement jouée !**")

            }

        } else {

            interaction.reply("**Aucune musique n'est actuellement jouée !**")
        }

    }
}
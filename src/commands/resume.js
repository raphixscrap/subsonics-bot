const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Remet la musique qui était en pause !"),

    async execute(client, interaction) {

        if(!interaction.member.voice.channel) return interaction.reply({content:"Vous devez rejoindre un salon vocal !", ephemeral: true})
   
        let player = client.manager.players.get(interaction.guild.id)

        if(player) {

            if(!player.playing) {

                const embed = new EmbedBuilder()
                .setColor(0x03ff2d)
                .setTitle('C\'est reparti !')
                .setDescription("**Ok, Fin de l'entracte, c'est reparti et c'est demandée par " + interaction.member.user.username + "**")
                .setTimestamp();

            
                interaction.reply({embeds: [embed]})
               
                player.pause(false)
               
            } else {
                interaction.reply("**Aucune musique n'est actuellement jouée !**")

            }

        } else {

            interaction.reply("**Aucune musique n'est actuellement jouée !**")
        }

    }
}
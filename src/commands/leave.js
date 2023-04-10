const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Player } = require("erela.js");

module.exports = {

    data:new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Faire partir le meilleur groupe du monde !"),

    async execute(client, interaction) {

        if(!interaction.member.voice.channel) return interaction.reply({content:"Vous devez rejoindre un salon vocal !", ephemeral: true})
   
        let player = client.manager.players.get(interaction.guild.id)
        

        if(player) {

            player.destroy()

            const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('C\'est tout pour nous !')
            .setDescription("**Le meilleur groupe du monde est parti ... !**")
            .setTimestamp();

        
            interaction.reply({embeds: [embed]})
           

        } else {

            interaction.reply("**Aucune musique n'est actuellement jouée !**")
        }

    }


}
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("state")
    .setDescription("Affiche l'état du lecteur !"),

    async execute(client, interaction) {

        if(!interaction.member.voice.channel) return interaction.reply({content:"Vous devez rejoindre un salon vocal !", ephemeral: true})
   
        let player = client.manager.players.get(interaction.guild.id)

        if(player) {

            const date = new Date(player.queue.current.duration)

            var gMinute = date.getMinutes()
            var gSecondes = date.getSeconds()


            if(date.getMinutes() <= 9) {
                gMinute = "0" + date.getMinutes()
            }

            if(date.getSeconds() <= 9) {
                gSecondes = "0" + date.getSeconds()
            }

  

            let embed = new EmbedBuilder()
            .setColor(0x32a875)
            .setTitle('Information sur la musique !')
            .addFields({name:"Titre", value: player.queue.current.title},
                       {name:"Auteur", value: player.queue.current.author},
                       {name:"URL", value: player.queue.current.uri},
                       {name:"Temps", value: gMinute  + ":" + gSecondes})
            .setTimestamp();

            interaction.reply({embeds: [embed]})

        } else {

            interaction.reply("**Aucune musique n'est actuellement jouée !**")
        }

    }
}
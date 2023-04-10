const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("dictator")
    .setDescription("Active ou désactive le mode dictateur !"),

    async execute(client, interaction) {

        console.log(interaction.member._roles)

        if(interaction.member._roles.includes("397725956598530050") == true | interaction.member.user.id == "486943594893017119") {
            if(client.dictator == true) {
                client.dictator = false;
    
                const embed = new EmbedBuilder()
                .setColor(0x3b3b3b)
                .setTitle('Mode Dictateur Inactif !')
                .setDescription("Le pouvoir du peuple est restauré !")
                .setTimestamp();
    
            
                interaction.reply({embeds: [embed]})
            } else {
    
                const embed = new EmbedBuilder()
                .setColor(0xfff200)
                .setTitle('Mode Dictateur Actif!')
                .setDescription("Notre bon roi a désormais le seul droit sur la musique !")
                .setTimestamp();
        
               
                interaction.reply({embeds: [embed]})
    
                client.dictator = true;
            }

        } else {

            const embed = new EmbedBuilder()
            .setColor(0xff0303)
            .setTitle('Erreur : Mode Dictateur')
            .setTimestamp();
            const song_show = {name: "Tu n'as pas la permission de faire cela !", value: "Verbotten !"}
                
            embed.addFields(song_show)
            interaction.reply({embeds: [embed]})


        }

       

       
    
    }
}
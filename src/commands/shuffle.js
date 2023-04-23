const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("mix")
    .setDescription("Mélange la liste de lecture !"),

    async execute(client, interaction) {

        if(client.dictator == true ) {

            if((interaction.member._roles.includes("397725956598530050") == true | interaction.member.user.id == "486943594893017119")) {

                makeAction()
            } else {

                const embed = new EmbedBuilder()
                .setColor(0xff0303)
                .setTitle('Mode Dictateur')
                .setTimestamp();
                const song_show = {name: "Le mode dictateur est actif !", value: "Demande au grand roi !"}
                    
                embed.addFields(song_show)
                interaction.reply({embeds: [embed]})
            }
            
        } else {

            makeAction();
        }

        async function makeAction() {

        if(!interaction.member.voice.channel) return interaction.reply({content:"Vous devez rejoindre un salon vocal !", ephemeral: true})
   
        let player = client.manager.players.get(interaction.guild.id)

        if(player) {

        
                
                const embed = new EmbedBuilder()
                .setColor(0xfff200)
                .setTitle('On mélange !')
                .setDescription("Toutes les musiques de la liste de lecture ont été mélangés !")
                .setTimestamp();
        
               
                interaction.reply({embeds: [embed]})
    
         

        
                player.queue.shuffle()
           

        } else {

            
            interaction.reply("**Aucune musique n'est actuellement jouée !**")
      
        }
        }
    }
}
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Active ou désactive la répétition de la liste de lecture !"),

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

            if(player.queueRepeat == false) {
                
                const embed = new EmbedBuilder()
                .setColor(0xfff200)
                .setTitle('Loop Actif!')
                .setDescription("On recommence !")
                .setTimestamp();
        
               
                interaction.reply({embeds: [embed]})
    
         

        
                player.setQueueRepeat(true)
            } else {

                const embed = new EmbedBuilder()
                .setColor(0x3b3b3b)
                .setTitle('Loop inactif!')
                .setDescription("Ca suffit ! Terminez votre concert !")
                .setTimestamp();
        
            
                interaction.reply({embeds: [embed]})


                player.setQueueRepeat(false)

            }

        } else {

            
            interaction.reply("**Aucune musique n'est actuellement jouée !**")
      
        }
        }
    }
}
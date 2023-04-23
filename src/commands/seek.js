const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Définie la position du player dans la musique !")
    .addIntegerOption(option => option.setName("duration").setDescription("En seconde")),

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
        let duration = interaction.options.getInteger("duration")

        if(player) {

                try {

                    const embed = new EmbedBuilder()
                    .setColor(0xfff200)
                    .setTitle('On avance ou recule ?')
                    .setTimestamp();
            
                   
                    interaction.reply({embeds: [embed]})
                    
                    duration = duration ** 3
                    player.seek(duration)
    
            
            

                } catch (error) {

                    console.log(error)
                    interaction.reply("**Aucune musique n'est actuellement jouée !**")
                }
                
               
           

        } else {

            
            interaction.reply("**Aucune musique n'est actuellement jouée !**")
      
        }
        }
    }
}
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Permet de passer à la musique suivante !"),

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

        let embed = new EmbedBuilder()
                .setColor(0xe033ff)
                .setTitle('Liste de lecture')
                .setDescription("Les musiques vont défiler dans cet ordre !")
                .setTimestamp();
                
                let player = client.manager.players.get(interaction.guild.id)
               

                if(!player) {

                    embed = new EmbedBuilder()
                    .setColor(0xff0303)
                    .setTitle('Erreur : Skip')
                    .setTimestamp();
                    const song_show = {name: "Aucune chanson n'est dans la queue", value: "Changement impossible !"}
                        
                    embed.addFields(song_show)
                    interaction.reply({embeds: [embed]})
                } else {

                    console.log("------------------------QUEUE.JS---------------------")
                    console.log(client.manager.players.get(interaction.guild.id).queue)
                    let queue = client.manager.players.get(interaction.guild.id).queue;
                 

                    if(queue.length == 0){

                        embed = new EmbedBuilder()
                        .setColor(0xff0303)
                        .setTitle('Erreur : Skip')
                        .setTimestamp();
                        const song_show = {name: "Aucune chanson n'est dans la queue", value: "Changement impossible !"}
                            
                        embed.addFields(song_show)
                        interaction.reply({embeds: [embed]})
                    } else {
                    
                        player.stop()

                        embed = new EmbedBuilder()
                        .setColor(0x03ff2d)
                        .setTitle('On change de morceau !!!')
                        .setDescription("**Ok, On est reparti avec "+ player.queue[0].title +" et c'est demandée par " + interaction.member.user.username + "**")
                        .setTimestamp();

                    
                        interaction.reply({embeds: [embed]})
                        
                    }
                }

            }
    }
}
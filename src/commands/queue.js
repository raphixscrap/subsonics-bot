const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Affiche le ping du bot !")
    .addStringOption(option => option.setName("action").setDescription("Que veux tu faire avec la queue ?").setRequired(true).addChoices(
        {name: "Afficher", value: "show"},
        {name: "Supprimer", value: "delete"}
    )).addIntegerOption(option => option.setName("number").setDescription("Numéro de la place dans la liste de lecture")),
    

    async execute(client, interaction) {
      
        if(!interaction.member.voice.channel) return interaction.reply({content:"Vous devez rejoindre un salon vocal !", ephemeral: true})
   
        
    

            const choice = interaction.options.getString("action")

            if(choice == "show") {
                const embed = new EmbedBuilder()
                .setColor(0xe033ff)
                .setTitle('Liste de lecture')
                .setDescription("Les musiques vont défiler dans cet ordre !")
                .setTimestamp();
                
                let player = client.manager.players.get(interaction.guild.id)
               

                if(!player) {

                    const song_show = {name: "Aucune chanson n'est dans la queue", value: "Tu peux en ajouter avec /play"}
                        
                    embed.addFields(song_show)
                    interaction.reply({embeds: [embed]})
                } else {

                    console.log("------------------------QUEUE.JS---------------------")
                    console.log(client.manager.players.get(interaction.guild.id).queue)
                    let queue = client.manager.players.get(interaction.guild.id).queue;
                 

                    if(queue.length == 0){

                        const song_show = {name: "Aucune chanson n'est dans la queue", value: "Tu peux en ajouter avec /play"}
                        
                        embed.addFields(song_show)
                        interaction.reply({embeds: [embed]})
                    } else {
                    

                    for(song of queue) {

                        const song_show = {name: queue.indexOf(song) + " - " + song.title, value: song.author}
                        
                        embed.addFields(song_show)
                    }
    
                    await interaction.reply({embeds: [embed]})
                    }
                }

               
            } else if(choice == "delete") {
                
                let embed = new EmbedBuilder()
                .setColor(0xe033ff)
                .setTitle('Liste de lecture')
                .setDescription("Les musiques vont défiler dans cet ordre !")
                .setTimestamp();
                
                let player = client.manager.players.get(interaction.guild.id)
               
                if(!player) {

                    embed = new EmbedBuilder()
                    .setColor(0xff0303)
                    .setTitle('Erreur : Liste de lecture')
                    .setTimestamp();
                    const song_show = {name: "Aucune chanson n'est dans la queue", value: "Supression impossible"}
                        
                    embed.addFields(song_show)
                    interaction.reply({embeds: [embed]})
                } else {

                    console.log("------------------------QUEUE.JS---------------------")
                    console.log(client.manager.players.get(interaction.guild.id).queue)
                    let queue = client.manager.players.get(interaction.guild.id).queue;
                 

                    if(queue.length == 0){

                        embed = new EmbedBuilder()
                        .setColor(0xff0303)
                        .setTitle('Erreur : Liste de lecture')
                        .setTimestamp();
                        const song_show = {name: "Aucune chanson n'est dans la queue", value: "Supression impossible"}
                            
                        embed.addFields(song_show)
                        interaction.reply({embeds: [embed]})
                    } else {
                        
                        const number = interaction.options.getInteger("number")

                        console.log(number)

                        if(number != null) {
                            try {
                                queue.splice(number, 1)

                                embed = new EmbedBuilder()
                                .setColor(0xe033ff)
                                .setTitle('Supressipn : Liste de lecture')
                                .setDescription("La musique a été retiré de la liste de lecture !")
                                .setTimestamp();

                                interaction.reply({embeds: [embed]})

                            } catch(error)  {

                                embed = new EmbedBuilder()
                                .setColor(0xff0303)
                                .setTitle('Erreur : Liste de lecture')
                                .setTimestamp();
                                const song_show = {name: "Le numéro correspondant n'est pas disponible", value: "Supression impossible"}
                                    
                                embed.addFields(song_show)
                                interaction.reply({embeds: [embed]})
                            }
                          
                        } else {

                           

                            embed = new EmbedBuilder()
                            .setColor(0xff0303)
                            .setTitle('Erreur : Liste de lecture')
                            .setTimestamp();
                            const song_show = {name: "Un numéro est nécéssaire", value: "Supression impossible"}
                                
                            embed.addFields(song_show)
                            interaction.reply({embeds: [embed]})
                        }

                       
                    
                        
                    }
                }
         
            } else {

                await interaction.reply("**La commande a été mal éxécutée !**")
            }
    
    }
}
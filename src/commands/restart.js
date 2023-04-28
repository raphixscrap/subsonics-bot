const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const log = require("../sublog")

const { Manager } = require("erela.js")


module.exports = {

    data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Redémarre le bot !"),

    async execute(client, interaction) {

        

        if(interaction.member._roles.includes("397725956598530050") == true | interaction.member._roles.includes("397724656548970508") == true| interaction.member._roles.includes("397725128198455299") == true| interaction.member._roles.includes("397725552968204288") == true | interaction.member.user.id == "486943594893017119") {
            const embed = new EmbedBuilder()
            .setColor(0xffffff)
            .setTitle('Redémarrage du bot !')
            .setDescription("Vérifie le redémarrage avec /play et si cela ne fonctionne pas, SPAM <@486943594893017119> !!!")
            .setTimestamp();

        
            interaction.reply({embeds: [embed]})

            let player = client.manager.players.get(interaction.guild.id)

            if(player) {
    
                player.destroy()

            }
            
            const nodes = [
                {
                  host: "omega.raphix.fr",
                  password: "raphixlavalink",
                  port: 2333,
                  secure: false
                }
              ];

              
              client.manager.createNode(nodes)
            

        } else {

            const embed = new EmbedBuilder()
            .setColor(0xff0303)
            .setTitle('Erreur : Redémarrage du BOT')
            .setTimestamp();
            const song_show = {name: "Tu n'as pas la permission de faire cela !", value: "Verbotten !"}
                
            embed.addFields(song_show)
            interaction.reply({embeds: [embed]})


        }
        process.emit("discordDoing")
    
    }
}

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Affiche le ping du bot !"),

    async execute(client, interaction) {


        const embed = new EmbedBuilder()
        .setColor(0xb0f542)
        .setTitle('Résultat du ping')
        .setDescription("**Ping :** " + client.ws.ping + " ms")
        .setTimestamp();

       
        interaction.reply({embeds: [embed]})
    
    }
}
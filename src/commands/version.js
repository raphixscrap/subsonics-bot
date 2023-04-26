const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const packageJson = require('../../package.json');
const log = require("../sublog")

module.exports = {

    data: new SlashCommandBuilder()
    .setName("version")
    .setDescription("Affiche le ping du bot !"),

    async execute(client, interaction) {

        process.emit("discordDoing")
        
        const uptime = process.uptime();
        const minutes = Math.floor(uptime / 60);
        const seconds = Math.floor(uptime % 60);

        const embed = new EmbedBuilder()
        .setColor(0xb0f542)
        .setTitle('Les Subsonics')
        .addFields({name: "Version ", value: packageJson.version},{name:"Uptime", value: minutes + " minutes et " + seconds + " secondes"})
        .setTimestamp();

       
        interaction.reply({embeds: [embed]})
    
    }
}
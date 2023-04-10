const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder,  Embed } = require("discord.js");

module.exports = {

    data:new SlashCommandBuilder()
    .setName("play")
    .setDescription("Lire une musique depuis youtube")
    .addStringOption(option => option.setName("nom_ou_lien").setDescription("Le nom de la musique recherchée !").setRequired(true)),

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

        const song_name = interaction.options.getString("nom_ou_lien")

       if(!interaction.member.voice.channel) return interaction.reply({content:"Vous devez rejoindre un salon vocal !", ephemeral: true})
   
        let player = client.manager.players.get(interaction.guild.id)

        if(!player) { 
            
            player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            });

            player.connect();
        }

        const songs = await client.manager.search(song_name)

        if(!player.playing) {
            
            client.manager.players.get(interaction.guild.id).queue.add(songs.tracks[0])
            player.play()

            const embed = await new EmbedBuilder()
            .setColor(0x15e6ed)
            .setTitle('**Lecture de **' + songs.tracks[0].title)
            .setDescription('**Demandé par **' + interaction.member.user.username)
            .addFields({name: "Auteur", value: songs.tracks[0].author},
                       {name: "URL", value:songs.tracks[0].uri})
            .setThumbnail(songs.tracks[0].thumbnail)
            .setTimestamp();
            
            try {

                interaction.reply({embeds: [embed]})
            } catch(error) {

                interaction.reply({embeds: [embed]})
            }
                


            
           
            
        } else {

            const embed = await new EmbedBuilder()
            .setColor(0x15e6ed)
            .setTitle('**Ajout dans la liste de lecture **' + songs.tracks[0].title)
            .setDescription('**Demandé par **' + interaction.member.user.username)
            .addFields({name: "Auteur", value: songs.tracks[0].author},
                       {name: "URL", value:songs.tracks[0].uri})
            .setThumbnail(songs.tracks[0].thumbnail)
            .setTimestamp();
    
            client.manager.players.get(interaction.guild.id).queue.add(songs.tracks[0])
            console.log("------------------------PLAY.JS---------------------")
            console.log(player.queue)
            console.log("--------------------------------------------")
            try {

                interaction.reply({embeds: [embed]})
            } catch(error) {

                interaction.reply({embeds: [embed]})
            }


        }

        }
    }
}
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {

    data:new SlashCommandBuilder()
    .setName("help")
    .setDescription("Faire partir le meilleur groupe du monde !"),

    async execute(client, interaction) {

        

            const embed = new EmbedBuilder()
            .setColor(0x03ff2d)
            .setTitle('Comment assister au concert ?')
            .setDescription("**Eh ! Tu as eu ton ticket ? Tant mieux ! Voici la liste des commandes à utiliser dans le salon <#664355637685256203>**")
            .addFields({name: "/play <nom>", value: "Cette commande te permet de lire depuis Youtube, n'importe quel musique !"},
                       {name: "/leave", value: "Si tu ne veux plus du meilleur groupe du monde (faire partir le bot), cette commande les fera partir aussi vite qu'ils sont arrivés !"},
                       {name: "/pause", value: "Besoin d'un entracte ? Cette commande te permettera de mettre le morceau en cours, en pause !"},
                       {name: "/resume", value: "Fin de l'entracte ? Cette commande te permettera de mettre le morceau qui était en pause, en cours !"},
                       {name: "/queue <afficher/supprimer>", value: "Permet d'afficher ou de supprimer les titres de la liste de lecture."},
                       {name: "/state", value: "Donne l'état de la musique"},
                       {name: "/skip", value: "Passer à la chanson suivante."},
                       {name: "/back", value: "Revenir à la chanson précédente."})
            .setTimestamp()
            .setThumbnail("https://static.wikia.nocookie.net/codelyoko/images/9/95/Subdigitals.jpg/revision/latest/scale-to-width-down/180?cb=20120105180510&path-prefix=fr");
        

        
            interaction.reply({embeds: [embed]})
        
    }


}
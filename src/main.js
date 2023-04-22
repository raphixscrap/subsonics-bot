let tryTime = 0;

if ("ENV" in process.env) {
    if(process.env.ENV == "TEST") {
      process.exit(0)
  
    }
  

} 

function startApp() {

const { Client, GatewayIntentBits, Collection } = require("discord.js")
const { REST, Routes } = require("discord.js")
const fs = require("node:fs")
const config = require("./config.json")
const path = require("path")
const { Manager } = require("erela.js")

const client = new Client({
    intents:[GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers]
})

client.commands = new Collection()
client.dictator = false;

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandsPath = path.join(__dirname , 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command)
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(config.token);

// and deploy your commands!
(async () => {
	try {

        
        

		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(config.clientID, config.guildID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

// Command Slash


// Client Event

client.once("ready", () => {

    console.log("Le meilleur groupe de musique est prêt !")
    client.manager.init(client.user.id);

    const commandManager = client.application.commands;

    if (!commandManager) {
            console.log('Command manager not available.');
            
    } else {

            commandManager.set([]);
    }
})

client.on("voiceStateUpdate", (oldMember, newMember) => {

    console.log(oldMember, newMember)

})

client.on("interactionCreate", (interaction) => {
    
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName)

    try {
        command.execute(client, interaction)
    } catch(error) {

        interaction.reply({content:"Erreur lors de l'éxécution de la commande !", ephemeral: true})
    }
})






const nodes = [
    {
      host: "lavalink.devamop.in",
      password: "DevamOP",
      port: 443,
      secure: true
    }
  ];

  client.manager = new Manager({
    // The nodes to connect to, optional if using default lavalink options
    nodes,
    // Method to send voice data to Discord
    send: (id, payload) => {
      const guild = client.guilds.cache.get(id);
      // NOTE: FOR ERIS YOU NEED JSON.stringify() THE PAYLOAD
      if (guild) guild.shard.send(payload);
    }
  });

  // Emitted whenever a node connects
client.manager.on("nodeConnect", node => {
    console.log(`Node "${node.options.identifier}" connected.`)
})

// Emitted whenever a node encountered an error
client.manager.on("nodeError", (node, error) => {
    console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
})


// THIS IS REQUIRED. Send raw events to Erela.js
client.on("raw", d => client.manager.updateVoiceState(d));
  

// Client Manager

client.login(config.token)

tryTime = 0
    
}
  
function handleFatalError(error) {
    console.error('Erreur fatale :', error);
    console.log('Redémarrage en cours...');

    if(tryTime == 10) {

        process.exit(1)
    }

    tryTime += 1;
    client = null
    startApp();
}
  
process.on('uncaughtException', handleFatalError);
  
startApp();

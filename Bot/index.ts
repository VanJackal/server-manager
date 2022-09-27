import Discord = require('discord.js')
import * as fs from "fs";
import * as path from "path";
const {Client, Collection, GatewayIntentBits} = require('discord.js')
import {logger} from 'logging'
import {Routes} from "discord.js";

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
];
const client = new Client({intents:intents});

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`)
})

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.cmd.js'))
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath);
    client.commands.set(command.data.name,command);
}

client.on('interactionCreate', async (interaction) => {
    const command = interaction.client.commands.get(interaction.commandName);

    if(!command) return;

    try {
        await command.execute(interaction)
    } catch (error) {
        logger.error(error);
        await interaction.reply({content:"**ERROR:**\n" + error})
    }
})



client.login(process.env.TOKEN);

import {SlashCommandBuilder} from "discord.js";
import {postpone} from "../auto-off"

const MAX_POSTPONE = 7

export = {
    data: new SlashCommandBuilder()
        .setName("auto-off")
        .setDescription(`Postpone auto shutdown for a service for up to ${MAX_POSTPONE} days`)
        .addStringOption(option => option
            .setName("service")
            .setDescription("ID of the service to postpone")
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName("duration")
            .setDescription(`time in days(accepts decimal input, min:0.25) to postpone auto off (max:${MAX_POSTPONE})`)
            .setRequired(true)
            .setMinValue(0.25)
            .setMaxValue(MAX_POSTPONE)
        ),
    async execute(interaction) {
        const service = interaction.options.getString("service")
        const time = Math.round((await postpone(service, interaction.options.getNumber("duration"))).getTime()/1000)
        interaction.reply(`auto-off for \`${service}\` postponed until <t:${time}:f> (<t:${time}:R>)`)
    }
}

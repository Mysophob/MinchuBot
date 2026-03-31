import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';
import { Command } from '../../interfaces/Command';
import dateToString from '../../Utils/formatDate';
import { getBirthdayList } from '../../database/models/birthdayDB';

const getBirthdayListCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('birthdaylist')
    .setDescription('Gets all Birthdays'),
  run: async (interaction) => {
    await interaction.deferReply();
    const { user } = interaction;

    const result = await getBirthdayList(interaction.client);

    if (result === undefined || result === null) {
      interaction.editReply('Couldnt find shit');
      return;
    }

    const embedReply = new EmbedBuilder();
    embedReply.setTitle('Brithday List');
    embedReply.setAuthor({
      name: user.tag,
      iconURL: user.displayAvatarURL(),
    });
    result.forEach((element) => {
      const newDate = new Date(element.birthdayDate);
      const readableDate = dateToString(newDate);
      embedReply.addFields({name: element.user,value: readableDate});
    });

    await interaction.editReply({ embeds: [embedReply] });
  },
};

export default getBirthdayListCommand;

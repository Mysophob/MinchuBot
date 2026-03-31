import { SlashCommandBuilder } from '@discordjs/builders';
import { Command } from '../../interfaces/Command';
import { announceUserFromList } from '../../messages/announceBirthday';

const testAnnounce: Command = {
  data: new SlashCommandBuilder()
    .setName('testannounce')
    .setDescription('test')
    .addStringOption((option) => option
      .setName('apikey')
      .setDescription('auth')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('user')
      .setDescription('user')
      .setRequired(true)),
  run: async (interaction) => {
    await interaction.deferReply();
    const APIKey = interaction.options.get('apikey')?.value as string;
    if(APIKey !== process.env.BOT_TOKEN){
      interaction.editReply('APIKey wrong');
      return;
    }
    const result = await announceUserFromList(interaction.client, interaction.user.displayName)

    if (result === undefined || result === null) {
      interaction.editReply('fak override didnt work');
      return;
    }
    return;
    //await interaction.editReply("success");
  },
};

export default testAnnounce;

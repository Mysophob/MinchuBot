import { Client, CommandInteraction } from 'discord.js';
import CommandList from '../../commands/_CommandList';

const onInteraction = async (interaction: CommandInteraction) => {
  if (interaction.isCommand()) {
    CommandList.forEach((element) => {
      if (interaction.commandName === element.data.name) {
        element.run(interaction);
      }
    });
  }
};

export default onInteraction;

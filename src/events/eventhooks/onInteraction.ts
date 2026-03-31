import { ChatInputCommandInteraction } from 'discord.js';
import CommandList from '../../commands/_CommandList';

const onInteraction = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.isCommand()) {
    for (const element of CommandList) {
      if (interaction.commandName === element.data.name) {
        try {
          await element.run(interaction);
        } catch (error) {
          console.error(`Error executing command ${interaction.commandName}:`, error);
          try {
            const reply = { content: 'Something went wrong.', ephemeral: true };
            if (interaction.deferred || interaction.replied) {
              await interaction.editReply(reply);
            } else {
              await interaction.reply(reply);
            }
          } catch {
            // Interaction already expired
          }
        }
      }
    }
  }
};

export default onInteraction;
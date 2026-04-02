import { SlashCommandBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } from 'discord.js';
import { Command } from '../../interfaces/Command';
import dateToString from '../../Utils/formatDate';
import { getBirthdayList } from '../../database/models/birthdayDB';

const PAGE_SIZE = 10;

const getBirthdayListCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('birthdaylist')
    .setDescription('Gets all Birthdays'),
  run: async (interaction) => {
    await interaction.deferReply();
    const { user } = interaction;

    const result = await getBirthdayList(interaction.client);

    if (!result || result.length === 0) {
      interaction.editReply('No birthdays found.');
      return;
    }

    let page = 0;
    const totalPages = Math.ceil(result.length / PAGE_SIZE);

    function buildEmbed(page: number): EmbedBuilder {
      const embed = new EmbedBuilder();
      embed.setTitle('Birthday List');
      embed.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() });
      embed.setFooter({ text: `Page ${page + 1} of ${totalPages}` });

      const slice = result!.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
      slice.forEach((element) => {
        const readableDate = dateToString(new Date(element.birthdayDate));
        embed.addFields({ name: element.user, value: readableDate });
      });

      return embed;
    }

    function buildRow(page: number): ActionRowBuilder<ButtonBuilder> {
      return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('◀ Prev')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === 0),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Next ▶')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === totalPages - 1),
      );
    }

    const message = await interaction.editReply({
      embeds: [buildEmbed(page)],
      components: totalPages > 1 ? [buildRow(page)] : [], // no buttons needed if it fits on one page
    });

    if (totalPages <= 1) return;

    // Listen for button clicks from the original user only
    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: (i) => i.user.id === user.id,
      time: 60_000, // stop listening after 60s
    });

    collector.on('collect', async (i) => {
      if (i.customId === 'prev') page = Math.max(0, page - 1);
      if (i.customId === 'next') page = Math.min(totalPages - 1, page + 1);

      await i.update({
        embeds: [buildEmbed(page)],
        components: [buildRow(page)],
      });
    });

    collector.on('end', async () => {
      // Disable buttons when the collector expires
      await interaction.editReply({
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId('prev').setLabel('◀ Prev').setStyle(ButtonStyle.Primary).setDisabled(true),
            new ButtonBuilder().setCustomId('next').setLabel('Next ▶').setStyle(ButtonStyle.Primary).setDisabled(true),
          ),
        ],
      });
    });
  },
};

export default getBirthdayListCommand;
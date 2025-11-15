import {
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export interface Command {
  data: SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;
  run: (
    interaction: CommandInteraction
  ) => Promise<void>;
}

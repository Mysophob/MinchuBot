import {
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from '@discordjs/builders';
import { ChatInputCommandInteraction, CacheType } from 'discord.js';

export interface Command {
  data: SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder;
  run: (
    interaction: ChatInputCommandInteraction<CacheType>
  ) => Promise<void>;
}

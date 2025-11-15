import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../interfaces/Command";
import { ChatInputCommandInteraction } from "discord.js";
import { getCurrencyEntryAmount, updateUserCurrencyEntry } from "../../database/models/UserCoinflip.model";


const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const sequences = [
  '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔',
];

const coinflip: Command = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flip a coin!")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("How much do you want to bet on this?")
        .setRequired(true))
    .addStringOption((option) =>
      option
        .setName('coin')
        .setDescription('Which result do you want to bet on?')
        .setRequired(true)
        .addChoices(
          { name: 'Heads', value: 'Heads' },
          { name: 'Tail', value: 'Tail' },
        )
    ),
  run: async (interaction) => {
    if (!(interaction instanceof ChatInputCommandInteraction)) return;

    await interaction.deferReply();
    const betAmount = interaction.options.get("amount")
      ?.value as number;

    const currency = await getCurrencyEntryAmount({ userId: interaction.user.id, userName: interaction.user.displayName });
    if (!currency) {
      interaction.editReply(`[Error] Something went wrong...`);
      return
    }
    if (betAmount > currency) {
      interaction.editReply(`You cannot bet more than you have baka!`);
      return;
    }

    const coin = interaction.options.get("coin")
      ?.value as string;

    const winAmount = 2 * betAmount;
    const result = Math.random() > 0.5 ? "Heads" : "Tail"
    const won = coin === result;
    const newAmount = currency + winAmount;
    const loseMessage = `Better Luck next time! You lost ${betAmount} and have ${newAmount} now.`
    const winMessage = `Ok you got me this time...You won ${winAmount} and have ${newAmount} now.`

    for (let i = 0; i < 8; i++) {
      const frame = sequences[i%sequences.length];
      await interaction.editReply(`Spinning ... ${frame}`);
      await sleep(5);
    }
    await updateUserCurrencyEntry({ userId: interaction.user.id, userName: interaction.user.displayName, amount: newAmount });
    await interaction.editReply(`Result was: ${result}. You ${won ? "won" : "lost"} the game! ${won ? winMessage : loseMessage}`);
  },
};

export default coinflip;

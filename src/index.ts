import * as dotenv from 'dotenv';
import { Client, Events, GatewayIntentBits, Partials } from 'discord.js';
import onReady from './events/onReady';
import botDatabase from './database/sqlLiteConnector';
import { updateCurrentMothList } from './database/models/ScreenshotCounter.model';

(async () => {
  dotenv.config();

  botDatabase.sync().then(() => {
    console.log('Database synced');
  }).catch(console.error);
  await updateCurrentMothList();

  const BOT = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions], partials: [Partials.Message] });
  BOT.on(Events.ClientReady, async () => onReady(BOT));
  
  await BOT.login(process.env.BOT_TOKEN);
})();

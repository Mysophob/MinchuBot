import { Client, Message } from "discord.js";
import countScreenshots from "../../messages/countScreenshots";
import { askAi } from "../../messages/askAi";


const onMessageCreated = async (message: Message, client: Client) => {
  countScreenshots(message);
  
  if (!message.author.bot) {
    const messageContent = message.content;
    message.type

    if (messageContent.includes("@1437043099401715782")) {
      let reply = await askAi(messageContent);
      await message.reply(reply);
    }
  }
};

export default onMessageCreated;

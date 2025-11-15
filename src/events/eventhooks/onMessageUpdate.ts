import { Client, Message } from "discord.js";
import countScreenshots from "../../messages/countScreenshots";

const onMessageUpdated = async (newMessage: Message, client: Client) => {
  //if (message.author.bot) return;
  countScreenshots(newMessage);
};
export default onMessageUpdated;

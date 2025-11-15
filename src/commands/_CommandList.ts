import { Command } from "../interfaces/Command";
import botSetPersonality from "./botPersonality/bot.setpersonality";
import begForCurrency from "./gamble/bot.coinsBeg";
import coinflip from "./gamble/bot.coinflip";
import coins from "./gamble/bot.getCurrency";
import coinTopList from "./gamble/bot.coinsTopList";
import getScreenshotTopList from "./screenshots/bot.getScreenshotTopList";

const CommandList: Command[] = [
  botSetPersonality,
  //coins
  coinflip,
  begForCurrency,
  coins,
  coinTopList,
  //screenshots
  getScreenshotTopList
];

export default CommandList;

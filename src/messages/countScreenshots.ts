import { Message } from "discord.js";
import { updateScreenshotCounter } from "../database/models/ScreenshotCounter.model";

export const screenshotBotList = ["1385872966759354449"];
export const moblinName = ["Moblin"];

export const homeScreenshotBotNameList = ["Home screen shot"]; //somehow i cannot use user ID on him

export const screenshotChannelIdList = ["1385872733707046962", "1437043792078307391"];


const countScreenshots = async (newMessage: Message) => {
    //if(!screenshotBotList.includes(message.author.id)) return;
    if (newMessage.attachments.size === 0) {
        return;
    }

    const imageAttachments = newMessage.attachments.filter(attachment =>
        attachment.contentType?.startsWith("image/")
    );

    if (!screenshotChannelIdList.includes(newMessage.channelId)) return;

    const imageCount = imageAttachments.size;
    if (screenshotBotList.includes(newMessage.author.id) ||
        moblinName.includes(newMessage.author.username) ||
        moblinName.includes(newMessage.author.displayName)) {
        // This is a bot message, so we need to parse the content to find the real user.
        const usernameRegex = new RegExp(/^(?:(?:.+?)\s)?(.+?)\sによって撮影されたスナップショット。/);
        const match = newMessage.content.match(usernameRegex);

        if (match && match[1]) {
            let extractedTwtichUserName = match[1];
            if (match[1].length > 1) {
                extractedTwtichUserName = match[1].charAt(0).toLowerCase() + match[1].slice(1);
            }
            console.log(`Screenshot bot posted ${imageCount} image(s) for user: ${extractedTwtichUserName}`);
            await updateScreenshotCounter({
                userId: extractedTwtichUserName,
                userName: extractedTwtichUserName,
                amount: imageCount
            });
            await newMessage.react('✅');
        }
    }
    else if (homeScreenshotBotNameList.includes(newMessage.author.username) ||
        homeScreenshotBotNameList.includes(newMessage.author.displayName)) {
        const usernameRegex = new RegExp(/^(.*?) has made a snap/);
        const match = newMessage.content.match(usernameRegex);

        if (match && match[1]) {
            let extractedTwtichUserName = match[1];
            if (match[1].length > 1) {
                extractedTwtichUserName = match[1].charAt(0).toLowerCase() + match[1].slice(1);
            }
            console.log(`Screenshot bot posted ${imageCount} image(s) for user: ${extractedTwtichUserName}`);
            await updateScreenshotCounter({
                userId: extractedTwtichUserName,
                userName: extractedTwtichUserName,
                amount: imageCount
            });
            await newMessage.react('✅');
        }
    }
    else {
        if (imageCount > 0) {
            await updateScreenshotCounter({
                userId: newMessage.author.id,
                userName: newMessage.author.username,
                amount: imageCount
            });
            await newMessage.react('✅');
        }
    }
}

export default countScreenshots;

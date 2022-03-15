import {NextApiRequest, NextApiResponse} from "next";
import {pusher} from "../../../lib/index";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  
  try {
    const {message, username, channel} = req.body;
    console.log("Message Sent");
    await pusher.trigger(channel, "chat-update", {
      message,
      username,
    });
    res.json({status: 200});
  }
  catch (error) {
    console.error(error);
  }
}
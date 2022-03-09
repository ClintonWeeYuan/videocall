import {pusher} from "../../../lib";
import randomWords from "random-words";
import type {NextApiRequest, NextApiResponse} from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // const { message, sender } = req.body;
  // const response = await pusher.trigger("chat", "chat-event", {
  //   message,
  //   sender,
  // });
  const {socket_id, channel_name, username} = req.body;
  
  const randomString = randomWords({exactly: 3, join: "-"});
  const presenceData = {user_id: randomString, user_info: {username}};
  
  try {
    const auth = pusher.authenticate(socket_id, channel_name, presenceData);
    console.log("Hello")
    res.send(auth);
  }
  
  catch (error) {
    console.error(error);
  }
}

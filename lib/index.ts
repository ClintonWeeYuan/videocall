import Pusher from "pusher";


// @ts-ignore
// @ts-ignore
export const pusher = new Pusher({
  appId: process.env.app_id ? process.env.app_id : '',
  key: process.env.key ? process.env.key : '',
  secret: process.env.secret ? process.env.secret : '',
  cluster: process.env.cluster ? process.env.cluster : '',
  useTLS: true,
});



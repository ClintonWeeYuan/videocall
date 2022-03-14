import {NextApiRequest, NextApiResponse} from "next";
import randomWords from "random-words";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  
  const randomString = randomWords({exactly: 3, join: "-"});
  
  
  try {
    console.log("Hello")
  }
  catch (error) {
    console.error(error);
  }
}
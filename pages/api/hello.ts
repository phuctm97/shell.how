import type { NextApiHandler } from "next";

type Data = {
  message: string;
};

const handler: NextApiHandler<Data> = (req, res) => {
  res.status(200).json({ message: "Hello!" });
};

export default handler;

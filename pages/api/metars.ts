import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';


type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const metarsRaw = fs.readFileSync('bin/metars.json', 'utf-8');
  const metars = JSON.parse(metarsRaw);
  res.status(200).json(metars);
}

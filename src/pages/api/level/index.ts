import { getApiRequestNoAuthOptions } from '@/utils/apiUtils';
import { NextApiRequest, NextApiResponse } from 'next';

const getRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const options = getApiRequestNoAuthOptions();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Level`, options);
    const data = await response.json();
    res.status(200).json(data.data);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const handleGetLevel = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case 'GET':
      await getRequest(req, res);
      break;
  }
};

export default handleGetLevel;

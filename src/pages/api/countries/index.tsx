import { getApiRequestNoAuthOptions } from '@/utils/apiUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const getRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });

  try {
    const options = getApiRequestNoAuthOptions();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Country`, options);
    const data = await response.json();

    res.status(200).json(data.data);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const handleCountries = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case 'GET':
      await getRequest(req, res);
  }
};

export default handleCountries;

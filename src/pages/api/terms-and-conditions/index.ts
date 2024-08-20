import { getApiRequestOptions } from '@/utils/apiUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken, JWT } from 'next-auth/jwt';

const getRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = (await getToken({ req })) as JWT | null;
  if (token?.token) {
    const options = getApiRequestOptions(token.token);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/TermsAndCondition`, options);
      const data = await response.json();
      res.status(200).json(data.data);
    } catch (error) {
      res.status(400).json({ error });
    }

  } else {
    res.status(401).json({ error: 'Unauthorized access.' });
  }
};

const handleGetTermsAndCondition = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case 'GET':
      await getRequest(req, res);
      break;
  }
};

export default handleGetTermsAndCondition;

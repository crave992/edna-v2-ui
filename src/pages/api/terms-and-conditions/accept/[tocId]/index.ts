import { postApiRequestOptions } from '@/utils/apiUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const saveRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  const { tocId } = req.query;

  if (token) {
    try {
      const options = postApiRequestOptions(token?.token);
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/UserTermsAndConditionHistory/AcceptTermsAndConditions/${tocId}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: options.headers,
        body: JSON.stringify('{}'),
      });
      res.status(200).json({ ok: true });
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized access.' });
  }
}

const handleAcceptermsAndCondition = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case 'POST':
      await saveRequest(req, res);
  }
};

export default handleAcceptermsAndCondition;

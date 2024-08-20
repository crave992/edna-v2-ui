import { postApiRequestOptions } from '@/utils/apiUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const saveRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  const { imageId } = req.query;

  if (token) {
    try {
      const options = postApiRequestOptions(token?.token);
      var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Class/RemoveClassImage/${imageId}`;

      const response = await fetch(rqstUrl, {
        method: 'DELETE',
        headers: options.headers,
      });
      // await response.json();

      res.status(200).json({ ok: true });
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized access.' });
  }
};

const handleClassDeleteImage = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case 'DELETE':
      await saveRequest(req, res);
  }
};

export default handleClassDeleteImage;

import { postApiRequestOptions } from '@/utils/apiUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const saveRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  const { classId } = req.query;

  if (token) {
    try {
      const options = postApiRequestOptions(token?.token);
      var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Class/AddImageGallery/${classId}`;

      const response = await fetch(rqstUrl, {
        method: 'POST',
        headers: options.headers,
        body: JSON.stringify(req.body),
      });
      const data = await response.json();

      res.status(200).json(data.data);
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized access.' });
  }
};

const handleClassAddImage = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case 'POST':
      await saveRequest(req, res);
  }
};

export default handleClassAddImage;

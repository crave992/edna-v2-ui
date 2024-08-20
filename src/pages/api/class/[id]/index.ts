import { getApiRequestOptions, postApiRequestOptions } from '@/utils/apiUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const getRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  const { id } = req.query;

  if (token) {
    try {
      const options = getApiRequestOptions(token?.token);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Class/${id}`, options);
      const data = await response.json();
      res.status(200).json(data.data);
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized access.' });
  }
};

const putRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  const { id } = req.query;

  if (token) {
    try {
      const options = postApiRequestOptions(token?.token);
      var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Class/${id}`;

      await fetch(rqstUrl, {
        method: 'PUT',
        headers: options.headers,
        body: req.body,
      });

      //const data = await response.json();
      res.status(200).json({ ok: true });
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized access.' });
  }
};

const handleClassData = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case 'GET':
      await getRequest(req, res);
    case 'PUT':
      await putRequest(req, res);
  }
};

export default handleClassData;

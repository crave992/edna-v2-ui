import { getApiRequestOptions, delApiRequestOptions, postApiRequestOptions } from '@/utils/apiUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const getRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  const { lessonId } = req.query;

  if (token) {
    try {
      const options = getApiRequestOptions(token?.token);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Lesson/${lessonId}`, options);
      const data = await response.json();

      res.status(200).json(data.data);
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized access.' });
  }
};

const delRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  const { lessonId } = req.query;
  if (token) {
    try {
      const options = delApiRequestOptions(token?.token);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Lesson/${lessonId}`, {
        method: 'DELETE',
        headers: options.headers,
      });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized access.' });
  }
};

const updateRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  if (token) {
    try {
      const { lessonId } = req.query;
      const options = postApiRequestOptions(token?.token);
      const postUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Lesson/${lessonId}`;

      const response = await fetch(postUrl, {
        method: 'PUT',
        headers: options.headers,
        body: req.body,
      });

      const data = await response.json();

      res.status(200).json(data.data);
    } catch (error) {
      console.log(`error`);
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized access.' });
  }
};

const handleLessonByLesonId = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case 'GET':
      await getRequest(req, res);
    case 'DELETE':
      await delRequest(req, res);
    case 'PUT':
      await updateRequest(req, res);
      break;
  }
};

export default handleLessonByLesonId;

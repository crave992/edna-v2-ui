import { getApiRequestOptions } from '@/utils/apiUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken, JWT } from 'next-auth/jwt';

type QueryParams = {
  [key: string]: string | string[] | undefined;
};

const constructApiUrl = (baseURL: string, queryParams: QueryParams): string => {
  let apiUrl = `${baseURL}/Staff`;
  const queryString = Object.entries(queryParams)
    .filter(([_, value]) => value && value !== '')
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  if (queryString) {
    apiUrl += `?${queryString}`;
  }

  return apiUrl;
};

const handleApiResponse = async (apiUrl: string, options: RequestInit, res: NextApiResponse) => {
  try {
    const response = await fetch(apiUrl, options);
    const data = await response.json();
    res.status(200).json(data.data);
  } catch (error) {
    res.status(400).json({ error: 'An error occurred' });
  }
};

const getRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = (await getToken({ req })) as JWT | null;

  if (token) {
    try {
      const options = getApiRequestOptions(token?.token);
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseURL) {
        res.status(500).json({ error: 'Server configuration error.' });
        return;
      }
      const apiUrl = constructApiUrl(baseURL, req.query);
      await handleApiResponse(apiUrl, options, res);
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized access.' });
  }
};

const handleStaffMembers = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case 'GET':
      await getRequest(req, res);
  }
};

export default handleStaffMembers;

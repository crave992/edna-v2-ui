import { getApiRequestNoAuthOptions } from '@/utils/apiUtils';
import { NextApiRequest, NextApiResponse } from 'next';

const getRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { countryId } = req.query;

  try {
    const options = getApiRequestNoAuthOptions();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/State/GetByCountryId/${countryId}`, options);
    const data = await response.json();

    res.status(200).json(data.data);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const handleStates = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case 'GET':
      await getRequest(req, res);
  }
};

export default handleStates;

import { getApiRequestOptions } from '@/utils/apiUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const getRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  const { studentId } = req.query;

  if (token) {
    try {
      const options = getApiRequestOptions(token?.token);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Student/${studentId}`, options);
      const data = await response.json();

      if(!data.success){
        if(data.errorCode == 'ACCESS_DENIED'){
          return res.status(403).json({ message: "Forbidden" });
        } else{
          return res.status(400).json({});
        }
      } else {
        res.status(200).json(data.data);
      }
    } catch (error) {
      console.log('error',error);
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized access.' });
  }
};

const handleStudent = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case 'GET':
      await getRequest(req, res);
  }
};

export default handleStudent;

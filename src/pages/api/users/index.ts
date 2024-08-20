import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { getApiRequestOptions } from "@/utils/apiUtils";

const getRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  try {

    res.status(200).json({
      user: []
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Something went wrong.',
    });
  }
};

const putRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });

  if (token) {
    try {
      const options = getApiRequestOptions(token?.token);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Student?page=1&recordPerPage=100`, options);
      const data = await response.json();

      res.status(200).json(data.data.student);
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: "Unauthorized access." });
  }
};

const handleUser = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'PUT':
      await putRequest(req, res);
      break;
    case 'GET':
      await getRequest(req, res);
      break;
    default:
      await getRequest(req, res);
      break;
  }
};

export default handleUser;
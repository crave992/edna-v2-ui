import { getApiRequestOptions } from "@/utils/apiUtils";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

const putRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });

  if (token) {
    try {
      const options = getApiRequestOptions(token?.token);
      req.body = JSON.stringify({ })
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Parent/UpdatePicture`, options);
      const data = await response.json();

      res.status(200).json(data.data.student);
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: "Unauthorized access." });
  }
}

const handleParents = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case 'PUT':
      await putRequest(req, res);
  }
};

export default handleParents;
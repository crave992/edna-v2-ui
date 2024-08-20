import { getApiRequestOptions } from "@/utils/apiUtils";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

const putRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  const { id, userType } = req.query;

  if (token) {
    try {
      const options = getApiRequestOptions(token?.token);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/File/RenameFile/${userType}/${id}`, options);
      const data = await response.json();

      res.status(200).json(data.data);
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: "Unauthorized access." });
  }
}

const handleRenameFile = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case 'PUT':
      await putRequest(req, res);
  }
};

export default handleRenameFile;
import { postApiRequestOptions } from "@/utils/apiUtils";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";


const saveRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const token = await getToken({ req });
    if (token) {
      try {
        const options = postApiRequestOptions(token?.token);
        const postUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ClassAttendance/StudentAttendance`;
        
        const response = await fetch(postUrl, {
          method: 'POST',
          headers: options.headers,
          body: req.body
        });
        
        const data = await response.json();

        res.status(200).json(data.data);
      } catch (error) {
        console.log(`error`);
        res.status(400).json({ error });
      }
    } else {
      res.status(401).json({ error: "Unauthorized access." });
    }
  }

  const handleAttendance  = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    switch (req.method) {
      case 'POST':
        await saveRequest(req, res);
        break;
    }
  };
  
  export default handleAttendance;
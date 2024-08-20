import { postApiRequestOptions } from "@/utils/apiUtils";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

const editRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const token = await getToken({ req });
    const { id } = req.query;
    if (token) {
      try {
        const options = postApiRequestOptions(token?.token);
        var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/StudentLessonNotes/${id}`;
        
        const response = await fetch(rqstUrl, {
          method: 'PUT',
          headers: options.headers,
          body: req.body
        });
        //const data = await response.json();
        res.status(200).json({ ok: true});;
      } catch (error) {
        console.log(error);
        res.status(400).json({ error });
      }
    } else {
      res.status(401).json({ error: "Unauthorized access." });
    }
  }

const handleStudentLessonRecordKeeping = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case 'PUT':
      await editRequest(req, res);
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25MB',
    },
  },
};



export default handleStudentLessonRecordKeeping;
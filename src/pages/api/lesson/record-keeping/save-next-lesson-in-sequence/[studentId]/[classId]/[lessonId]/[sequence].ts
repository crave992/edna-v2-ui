import { getApiRequestOptions, postApiRequestOptions } from "@/utils/apiUtils";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";


const saveRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const token = await getToken({ req });
    const { studentId, classId, lessonId, sequence } = req.query;
  
    if (token) {
      try {
        const options = postApiRequestOptions(token?.token);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/RecordKeeping/SaveNextLessonInSequence/${studentId}/${classId}/${lessonId}/${sequence}`, {
          method: 'POST',
          headers: options.headers,
          body: req.body
        });

        const data = await response.json();
        if(data.success){
            res.status(200).json({
                ok:true
            });
        } else {
            res.status(400).json({
                ok:false,
                error:data.message
            })
        }
      } catch (error) {
        res.status(400).json({ error });
      }
    } else {
      res.status(401).json({ error: "Unauthorized access." });
    }
  }

  const handleSaveNextLesson = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    switch (req.method) {
      case 'POST':
        await saveRequest(req, res);
        break;
    }
  };
  
  export default handleSaveNextLesson;
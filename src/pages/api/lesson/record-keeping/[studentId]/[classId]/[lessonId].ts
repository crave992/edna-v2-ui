import { getApiRequestOptions, postApiRequestOptions } from "@/utils/apiUtils";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

const getRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  const { studentId, classId, lessonId } = req.query;

  if (token) {
    try {
      const options = getApiRequestOptions(token?.token);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/RecordKeeping/${studentId}/${classId}/${lessonId}`, options);
      const data = await response.json();

      res.status(200).json(data.data.areas);
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: "Unauthorized access." });
  }
}

const saveRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  const { studentId, classId, lessonId } = req.query;

  if (token) {
    try {
      const options = postApiRequestOptions(token?.token);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/RecordKeeping/Save/${studentId}/${classId}/${lessonId}`, {
        method: 'POST',
        headers: options.headers,
        body: req.body
      });
      const data = await response.json();
      res.status(200).json(data.data);
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: "Unauthorized access." });
  }
}

const addNoteRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  const { studentId, classId, lessonId } = req.query;

  if (token) {
    try {
      const options = getApiRequestOptions(token?.token);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/RecordKeeping/AddNote/${studentId}/${classId}/${lessonId}`, {
        method: 'PATCH',
        headers: options.headers,
        body: req.body
      });
      const data = await response.json();

      res.status(200).json(data.data);
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: "Unauthorized access." });
  }
}

const deleteRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  const { studentId, classId, lessonId } = req.query;

  if (token) {
    try {
      const options = getApiRequestOptions(token?.token);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/RecordKeeping/${studentId}/${classId}/${lessonId}`, {
        method: 'DELETE',
        headers: options.headers
      });

      res.status(200).json({
        ok:true
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: "Unauthorized access." });
  }
}

const handleRecordKeeping = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case 'GET':
      await getRequest(req, res);
      break;
    case 'POST':
      await saveRequest(req, res);
      break;
    case 'DELETE':
      await deleteRequest(req, res);
    case 'PATCH':
      await addNoteRequest(req, res);
      break;
  }
};

export default handleRecordKeeping;
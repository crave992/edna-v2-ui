import { getApiRequestOptions } from '@/utils/apiUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken, JWT } from 'next-auth/jwt';

const deleteRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  const { milestoneId } = req.query;

  if (token) {
    try {
      const options = getApiRequestOptions(token?.token);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/StudentLessonNotes/${milestoneId}`, {
        method: 'DELETE',
        headers: options.headers,
      });

      res.status(200).json({
        ok: true,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized access.' });
  }
};

const handleStudentMilestones = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    await deleteRequest(req, res);
  }
};

export default handleStudentMilestones;

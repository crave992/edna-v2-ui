import { postApiRequestOptionsFormData } from '@/utils/apiUtils';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const saveRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });

  if (token) {
    try {
      const options = postApiRequestOptionsFormData(token?.token);
      var rqstUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/Staff`;

      var bodyData = JSON.parse(req.body);

      const newFormData = new FormData();

      newFormData.append('id', bodyData?.id);
      newFormData.append('userName', bodyData?.userName);
      newFormData.append('title', bodyData?.title);
      newFormData.append('firstName', bodyData?.firstName);
      newFormData.append('lastName', bodyData?.lastName);
      newFormData.append('email', bodyData?.email);
      newFormData.append('description', bodyData?.description);
      newFormData.append('jobTitleId', bodyData?.jobTitleId);
      newFormData.append('roleId', bodyData?.roleId);
      newFormData.append('salaryTypeId', bodyData?.salaryTypeId);
      newFormData.append('profileImage', bodyData?.profileImage as File);
      newFormData.append('salaryAmount', bodyData?.salaryAmount);
      newFormData.append('empStartDate', bodyData?.empStartDate);

      const response = await fetch(rqstUrl, {
        method: 'POST',
        headers: options.headers,
        body: newFormData,
      });

      const data = await response.json();
      res.status(200).json({ ok: true, data });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized access.' });
  }
};

const handleAddStaff = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  switch (req.method) {
    case 'POST':
      await saveRequest(req, res);
  }
};

export default handleAddStaff;

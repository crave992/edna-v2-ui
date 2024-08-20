import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import { ChangePasswordModel } from '@/models/ChangePasswordModel';
import CommonProps from '@/models/CommonProps';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import ChangePasswordValidationSchema from '@/validation/ChangePasswordValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { useState } from 'react';
import { Row, Col, FloatingLabel, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import ErrorLabel from '../common/CustomError/ErrorLabel';
import Loader from '../common/Loader';
import { toast } from 'react-toastify';

interface ChangePasswordProps extends CommonProps {
  userId: string;
}

const ChangePassword: NextPage<ChangePasswordProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ChangePasswordModel>({
    resolver: yupResolver(ChangePasswordValidationSchema),
    defaultValues: {
      userId: props.userId,
    },
  });

  const submitData = async (formData: ChangePasswordModel) => {
    setShowLoader(true);
    let response = await unitOfService.AccountService.changePassword(formData);
    setShowLoader(false);
    if (response && response.status === 200) {
      toast.success('Password updated successfully');
      reset();
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      if (error.toLowerCase() === 'incorrect password.') {
        error = 'Incorrect current password';
      }
      toast.error(error);
    }
  };

  return (
    <>
      <div className="formBlock">
        <Form method="post" autoComplete="off" className="login_form" onSubmit={handleSubmit(submitData)}>
          <input type="hidden" name="userId" value={props.userId} />
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <FloatingLabel controlId="floatingInputCurrent" label="Current Password*">
                  <Form.Control type="password" placeholder="Current Password*" {...register('currentPassword')} />
                </FloatingLabel>
                {errors.currentPassword && <ErrorLabel message={errors.currentPassword.message} />}
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <FloatingLabel controlId="floatingInputNew" label="New Password*">
                  <Form.Control type="password" placeholder="New Password*" {...register('newPassword')} />
                </FloatingLabel>
                {errors.newPassword && <ErrorLabel message={errors.newPassword.message} />}
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <FloatingLabel controlId="floatingInputConfirm" label="Confirm Password*">
                  <Form.Control type="password" placeholder="Confirm Password*" {...register('confirmNewPassword')} />
                </FloatingLabel>
                {errors.confirmNewPassword && <ErrorLabel message={errors.confirmNewPassword.message} />}
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" className="btn_main mx-1">
            Update
          </Button>
        </Form>
        {showLoader && <Loader />}
      </div>
    </>
  );
};

export default ChangePassword;

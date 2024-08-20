import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import { NewAccountChangePasswordModel } from '@/models/ChangePasswordModel';
import CommonProps from '@/models/CommonProps';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { NewAccountChangePasswordValidationSchema } from '@/validation/ChangePasswordValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Row, Col, FloatingLabel, Form, Button, Modal, NavLink } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import ErrorLabel from '../common/CustomError/ErrorLabel';
import Loader from '../common/Loader';
import { toast } from 'react-toastify';
import { Role } from '@/helpers/Roles';
import { signOut } from 'next-auth/react';

interface NewAccountChangePasswordProps extends CommonProps {
  userId: string;
  roleName: string;
}

const NewAccountChangePassword: NextPage<NewAccountChangePasswordProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [parentRegistrationTerms, setParentRegistrationTerms] = useState<string>('');
  const fetchHipaaInfo = async () => {
    const response = await unitOfService.TermsAndPolicyService.getAll();
    if (response && response.status == 200 && response.data.data) {
      const parentTerms = response.data.data;
      if (parentTerms.parentRegistration) {
        setParentRegistrationTerms(parentTerms.parentRegistration);
      } else {
        setParentRegistrationTerms('');
      }
    }
  };

  useEffect(() => {
    (async () => {
      fetchHipaaInfo();
    })();
  }, []);

  const {
    formState: { errors },
    handleSubmit,
    register,
    control,
  } = useForm<NewAccountChangePasswordModel>({
    resolver: yupResolver(NewAccountChangePasswordValidationSchema),
    defaultValues: {
      userId: props.userId,
      acceptTerms: false,
      confirmPassword: '',
      password: '',
      roleName: props.roleName,
    },
  });

  const submitData = async (formData: NewAccountChangePasswordModel) => {
    setShowLoader(true);
    let response = await unitOfService.AccountService.newAccountChangePassword(formData);
    setShowLoader(false);
    if (response && response.status === 200) {
      toast.success('Password created successfully. Redirecting to login page..');
      setTimeout(async () => {
        localStorage.removeItem('at');
        localStorage.removeItem('utz');
        await signOut({ callbackUrl: '/' });
      }, 1000);
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
          <Form.Control type="hidden" {...register('roleName')} />
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <FloatingLabel controlId="password" label="Password*">
                  <Form.Control type="password" placeholder="Password*" {...register('password')} />
                </FloatingLabel>
                {errors.password && <ErrorLabel message={errors.password.message} />}
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <FloatingLabel controlId="confirmPassword" label="Confirm Password*">
                  <Form.Control type="password" placeholder="Confirm Password*" {...register('confirmPassword')} />
                </FloatingLabel>
                {errors.confirmPassword && <ErrorLabel message={errors.confirmPassword.message} />}
              </Form.Group>
            </Col>

            {props.roleName && props.roleName.toLocaleLowerCase() === Role.Parent.toLowerCase() && (
              <Col lg={12}>
                <Form.Group className="mb-3">
                  <Form.Check inline type="checkbox" id={`acceptTerms`} {...register('acceptTerms')} />
                  <Form.Label htmlFor="acceptTerms">
                    I agree to all the{' '}
                    <NavLink className="d-inline" onClick={handleShow}>
                      <strong>Terms & Condition</strong>
                    </NavLink>
                  </Form.Label>
                </Form.Group>
                {errors.acceptTerms && <ErrorLabel message={errors.acceptTerms.message} />}

                <p>Please click on the button below to create a parent profile and Enroll your children.</p>
              </Col>
            )}
          </Row>

          <Button type="submit" className="btn_main mx-1">
            Create Profile
          </Button>
        </Form>
        {showLoader && <Loader />}
      </div>

      <Modal show={show} onHide={handleClose} backdrop="static" size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Terms & Condition</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
          <div dangerouslySetInnerHTML={{ __html: parentRegistrationTerms }}></div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NewAccountChangePassword;

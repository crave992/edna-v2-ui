import CommonProps from '@/models/CommonProps';
import { NextPage } from 'next';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { ChangeEvent, useEffect, useReducer, useState } from 'react';
import { container } from '@/config/ioc';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { TYPES } from '@/config/types';
import { toast } from 'react-toastify';
import { InModalActionType, InModalState, modalReducer } from '@/reducers/InModalAction';
import Loader from '../../Loader';
import { InvoicePaymentModal } from '@/models/InvoicePaymentModal';
import { SavedCardOrAchDto } from '@/dtos/SavedCardOrAchDto';
import CustomFormError from '../../CustomFormControls/CustomFormError';
import Link from 'next/link';
import CustomInput from '../../CustomFormControls/CustomInput';
import { StudentPaymentModal } from '@/models/StudentPaymentModal';
import { useRouter } from 'next/router';

const initialState: InModalState = {
  modalHeading: 'Make Payment',
  isUpdate: false,
  refreshRequired: false,
  showLoader: false,
};

interface AdmissionPaymentProps extends CommonProps {
  //id: number;
  studentId: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AdmissionPayment: NextPage<AdmissionPaymentProps> = (props) => {
  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [areas, dispatch] = useReducer(modalReducer, initialState);

  const [achCardId, setAchCardId] = useState<number>(0);
  const [showCvvCode, setShowCvvCode] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm<StudentPaymentModal>({
    defaultValues: {
      studentId: props.studentId,
      cvv: '',
      paymentGatewayId: 0,
      savedAchCardId: 0,
    },
  });

  const submitData = async (model: StudentPaymentModal) => {
    if (showCvvCode === true && !model.cvv) {
      toast.error('CVV is required');
      return;
    }

    if (achCardId <= 0) {
      toast.error('Select any card/ach');
      return;
    }

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.InvoiceService.makeAdmissionPayment({
      cvv: model.cvv,
      studentId: props.studentId,
      paymentGatewayId: 1,
      savedAchCardId: achCardId,
    });

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 201 && response.data.data) {
      toast.success('Payment completed successfully');

      dispatch({
        type: InModalActionType.IS_REFRESH_REQUIRED,
        payload: true,
      });
      router.push(`/parent/student/payment/details/${response.data.data.studentId}`);
      props.onClose(true);
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  const [savedCards, setSavedCards] = useState<SavedCardOrAchDto[]>([]);
  const fetchSavedCard = async () => {
    const response = await unitOfService.SavedCardOrAchSrvice.getAll('', 0);
    if (response && response.status === 200 && response.data.data) {
      setSavedCards(response.data.data);
    } else {
      setSavedCards([]);
    }
  };

  const [creditCardCharge, setCreditCardCharges] = useState<number>(0);
  const getSchoolFeeSettings = async () => {
    const response = await unitOfService.RegistrationFeesService.getSchoolFeeSettings();
    if (response && response.status == 200 && response.data.data) {
      setCreditCardCharges(response.data.data.creditCardCharges);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        await fetchSavedCard();
        await getSchoolFeeSettings();
      }
    })();
  }, []);

  const checkCardType = (event: ChangeEvent<HTMLInputElement>) => {
    let achOrCardId = +(event.target.value || 0);
    setAchCardId(achOrCardId);

    const cardAchDetails = savedCards.find((e) => e.id === achOrCardId);

    if (cardAchDetails) {
      setShowCvvCode(cardAchDetails.paymentMethod.name.toLowerCase() === 'credit card' ? true : false);
    } else {
      setShowCvvCode(false);
    }
  };

  return (
    <>
      <Modal
        show={props.isOpen}
        onHide={() => {
          props.onClose(areas.refreshRequired);
        }}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>{areas.modalHeading}</Modal.Title>
        </Modal.Header>
        <Form method="post" autoComplete="off" onSubmit={handleSubmit(submitData)}>
          <Form.Control type="hidden" {...register('studentId')} />
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 'bold' }}>Select from saved Card/ACH</Form.Label>
              <div>
                {savedCards &&
                  savedCards.map((cardOrAch) => (
                    <Form.Check
                      key={`card-ach-${cardOrAch.id}`}
                      inline
                      type="radio"
                      className="mb-3"
                      id={`savedAchCardId-${cardOrAch.id}`}
                      value={cardOrAch.id}
                      {...register('savedAchCardId')}
                      label={
                        cardOrAch.paymentMethod.name.toLowerCase() === 'ach'
                          ? `${cardOrAch.aliasCardOrAchName}(${cardOrAch.routingNumber})`
                          : `${cardOrAch.aliasCardOrAchName}(${cardOrAch.cardNumber})`
                      }
                      onChange={checkCardType}
                    />
                  ))}
              </div>
              {errors.savedAchCardId && <CustomFormError error={errors.savedAchCardId} />}
            </Form.Group>

            {showCvvCode && (
              <>
                <Form.Group className="mb-3">
                  <FloatingLabel label="CVV Code*" className="mb-3">
                    <CustomInput control={control} name="cvv" placeholder="CVV Code*" type="password" />
                  </FloatingLabel>
                </Form.Group>

                {creditCardCharge > 0 && (
                  <>
                    <span style={{color: "#f3620f", margin: "0px 5px"}}>
                        <i>{creditCardCharge}% card processing fee will be apply</i>
                    </span>
                  </>
                )}
              </>
            )}

            <Form.Group>
              <Link className="btn-main" href="/parent/saved-cards">
                Add New Card/ACH
              </Link>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn_main orange_btn"
              onClick={() => {
                props.onClose(areas.refreshRequired);
              }}
            >
              Close
            </Button>
            <Button className="btn_main" type="submit">
              Pay Now
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {areas.showLoader && <Loader />}
    </>
  );
};

export default AdmissionPayment;

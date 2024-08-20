import CommonProps from '@/models/CommonProps';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { Button, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useEffect, useReducer, useState } from 'react';
import { container } from '@/config/ioc';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { TYPES } from '@/config/types';
import { toast } from 'react-toastify';
import { InModalActionType, InModalState, modalReducer } from '@/reducers/InModalAction';
import Loader from '../../Loader';
import { DirectPaymentModal } from '@/models/InvoicePaymentModal';
import DirectPaymentValidationSchema from '@/validation/DirectPaymentValidationSchema';
import CustomInput from '../../CustomFormControls/CustomInput';
import { InvoiceDto } from '@/dtos/InvoiceDto';

const initialState: InModalState = {
  modalHeading: 'Add Direct Payment',
  isUpdate: false,
  refreshRequired: false,
  showLoader: false,
};

interface AddDirectPaymentProps extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddDirectPayment: NextPage<AddDirectPaymentProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [areas, dispatch] = useReducer(modalReducer, initialState);

  const { handleSubmit, register, control, setValue } = useForm<DirectPaymentModal>({
    resolver: yupResolver(DirectPaymentValidationSchema),
    defaultValues: {
      invoiceId: props.id,
      amount: '',
      comment: '',
      paymentDate: new Date(),
    },
  });

  const [invoice, setInvoice] = useState<InvoiceDto>();
  const fetchInvoice = async (id: number) => {
    const response = await unitOfService.InvoiceService.details(id);
    if (response && response.status === 200 && response.data.data) {
      setInvoice(response.data.data);
      setValue('amount', `${response.data.data.balanceAmount}`);
    }
  };

  const submitData = async (model: DirectPaymentModal) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.InvoiceService.directPayment(model);

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 201 && response.data.data) {
      toast.success('Payment added successfully.');

      dispatch({
        type: InModalActionType.IS_REFRESH_REQUIRED,
        payload: true,
      });

      props.onClose(true);
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        await fetchInvoice(props.id);
      }
    })();
  }, []);

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
          <Form.Control type="hidden" {...register('invoiceId')} />
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Payment Date*</Form.Label>
              <CustomInput
                type="datepicker"
                control={control}
                name="paymentDate"
                placeholder="Payment Date*"
                dateFormat="MM/dd/yyyy"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount*</Form.Label>
              <CustomInput control={control} name="amount" placeholder="0.00" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comment (optional)</Form.Label>
              <CustomInput control={control} name="comment" />
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
              Add Direct Payment
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {areas.showLoader && <Loader />}
    </>
  );
};

export default AddDirectPayment;

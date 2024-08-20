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
import CustomSelect from '../../CustomFormControls/CustomSelect';
import { InvoiceModal } from '@/models/InvoiceModal';
import { InvoiceValidationSchema } from '@/validation/InvoiceValidationSchema';
import DropdownBasicDto from '@/dtos/DropdownBasicDto';
import CustomInput from '../../CustomFormControls/CustomInput';

const initialState: InModalState = {
  modalHeading: 'Generate Invoice',
  isUpdate: false,
  refreshRequired: false,
  showLoader: false,
};

interface GenerateInvoiceProps extends CommonProps {
  id: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const GenerateInvoice: NextPage<GenerateInvoiceProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [areas, dispatch] = useReducer(modalReducer, initialState);

  const { handleSubmit, register, control } = useForm<InvoiceModal>({
    resolver: yupResolver(InvoiceValidationSchema),
    defaultValues: {
      parentId: props.id,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      isBlankInvoice: false,
    },
  });

  const submitData = async (model: InvoiceModal) => {

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.InvoiceService.generate(model);

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 201 && response.data.data) {
      toast.success('Invoice generated successfully. Sending email...');      

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

  const [years, setYears] = useState<DropdownBasicDto[]>([]);
  const fetchYear = async () => {
    const currentYear = new Date().getFullYear();
    const tempYear: DropdownBasicDto[] = [];
    for (let i = currentYear - 2; i <= currentYear; i++) {
      tempYear.push({ label: `${i}`, value: i });
    }

    setYears(tempYear);
  };

  const [months, setMonths] = useState<DropdownBasicDto[]>([]);
  const fetchMonths = async () => {
    const tempMonths = unitOfService.DateTimeService.getMonths();
    setMonths(tempMonths);
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        fetchYear();
        fetchMonths();
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
          <Form.Control type="hidden" {...register('parentId')} />
          <Modal.Body>
            <Form.Group className="mb-3">
              <CustomSelect
                name="year"
                control={control}
                placeholder="Select Year*"
                isSearchable={true}
                options={years}
                textField="label"
                valueField="value"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <CustomSelect
                name="month"
                control={control}
                placeholder="Select Month*"
                isSearchable={true}
                options={months}
                textField="label"
                valueField="value"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <CustomInput
                type="checkbox"
                name="isBlankInvoice"
                control={control}
                labelForCheckboxAndRadio="Generate blank invoice"
              />
              <span style={{ color: '#f3620f', fontSize: '12px' }}>
                <i>If this option is checked, Then blank invoice will be generated without any item. Later on you can add item(s) manually from invoice details page</i>
              </span>
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
              Create
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {areas.showLoader && <Loader />}
    </>
  );
};

export default GenerateInvoice;

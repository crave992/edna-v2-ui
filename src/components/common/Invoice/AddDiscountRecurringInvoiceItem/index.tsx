import CommonProps from '@/models/CommonProps';
import { NextPage } from 'next';
import { Button, FloatingLabel, Form, Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useReducer, useState } from 'react';
import { container } from '@/config/ioc';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { TYPES } from '@/config/types';
import { toast } from 'react-toastify';
import { InModalActionType, InModalState, modalReducer } from '@/reducers/InModalAction';
import Loader from '../../Loader';
import CustomInput from '../../CustomFormControls/CustomInput';
import { StudentMostBasicDto } from '@/dtos/StudentDto';
import { yupResolver } from '@hookform/resolvers/yup';
import { RecurringInvoiceItemModel } from '@/models/RecurringInvoiceItemModel';
import RecurringInvoiceItemValidationSchema from '@/validation/RecurringInvoiceItemValidationSchema';
import { AxiosResponse } from 'axios';
import { RecurringInvoiceItemDto } from '@/dtos/RecurringInvoiceItemDto';
import Response from '@/dtos/Response';
import AsyncSelect from 'react-select/async';
import CustomFormError from '../../CustomFormControls/CustomFormError';

const initialState: InModalState = {
  modalHeading: 'Add Individual/Special Fee',
  isUpdate: false,
  refreshRequired: false,
  showLoader: false,
};

interface AddDiscountRecurringInvoiceItemProps extends CommonProps {
  itemId: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddDiscountRecurringInvoiceItem: NextPage<AddDiscountRecurringInvoiceItemProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [state, dispatch] = useReducer(modalReducer, initialState);
  const [unitPrice, setUnitPrice] = useState<number>();
  const [studentId, setStudentId] = useState<number>(0);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<RecurringInvoiceItemModel>({
    resolver: yupResolver(RecurringInvoiceItemValidationSchema),
    defaultValues: {
      studentId: 0,
      amount: 0,
      discountType: '',
      feeType: 'Discount',
      feeName: '',
      feeTypeId: 0,
      quantity: 1,
    },
  });

  const submitData = async (model: RecurringInvoiceItemModel) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    let response: AxiosResponse<Response<RecurringInvoiceItemDto>>;
    if (state.isUpdate) {
      response = await unitOfService.RecurringInvoiceItemService.update(props.itemId, model);
    } else {
      response = await unitOfService.RecurringInvoiceItemService.add(model);
    }

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && (response.status === 200 || response.status === 201) && response.data.data) {
      toast.success('Item saved successfully');

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

  const [students, setStudents] = useState<StudentMostBasicDto[]>([]);
  const fetchStudents = async (inputValue: string): Promise<StudentMostBasicDto[]> => {
    if (!inputValue) inputValue = '';

    const response = await unitOfService.StudentService.getMostBasicListing(inputValue, studentId);
    if (response && response.status === 200 && response.data.data) {
      setStudents(response.data.data);
      return response.data.data;
    }

    return [];
  }; 

  const fetchItem = async (itemId: number) => {
    const response = await unitOfService.RecurringInvoiceItemService.getById(itemId);
    if (response && response.status === 200 && response.data.data) {
      const invoiceItem = response.data.data;
      setValue('studentId', invoiceItem.studentId || 0);
      setValue('feeType', invoiceItem.feeType);
      setValue('feeTypeId', invoiceItem.feeTypeId || 0);
      setValue('discountType', invoiceItem.discountType || '');
      setValue('feeName', invoiceItem.feeName || '');
      setValue('quantity', invoiceItem.quantity);
      setValue('amount', invoiceItem.amount);

      setStudentId(invoiceItem.studentId || 0);

      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: 'Update Individual/Special Fee',
      });

      dispatch({
        type: InModalActionType.IS_UPDATE,
        payload: true,
      });
    }
  };

  useEffect(() => {
    (async () => {
      if (props.isOpen) {
        await fetchItem(props.itemId);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await fetchStudents('');
    })();
  }, [studentId]);

  return (
    <>
      <Modal
        show={props.isOpen}
        onHide={() => {
          props.onClose(state.refreshRequired);
        }}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>{state.modalHeading}</Modal.Title>
        </Modal.Header>
        <Form method="post" autoComplete="off" onSubmit={handleSubmit(submitData)}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Controller
                control={control}
                name="studentId"
                render={({ field, fieldState: { error } }) => (
                  <>
                    <AsyncSelect
                      instanceId="studentId"
                      name={field.name}
                      ref={field.ref}
                      value={students.find((stud) => stud.id === field.value) || null}
                      onChange={(option) => {
                        field.onChange(option?.id || null);
                      }}
                      cacheOptions
                      defaultOptions
                      loadOptions={fetchStudents}
                      getOptionValue={(option) => option.id.toString()}
                      getOptionLabel={(option) => option.name}
                      placeholder="Select Student*"
                      isClearable={true}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />

                    <CustomFormError error={error} />
                  </>
                )}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Discount Name*">
                <CustomInput control={control} name="feeName" placeholder="Discount Name*" />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3">
              <FloatingLabel label="Discount Amount*">
                <CustomInput control={control} name="amount" placeholder="Discount Amount*" />
              </FloatingLabel>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn_main orange_btn"
              onClick={() => {
                props.onClose(state.refreshRequired);
              }}
            >
              Close
            </Button>
            <Button className="btn_main" type="submit">
              {state.isUpdate ? 'Update' : 'Add'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {state.showLoader && <Loader />}
    </>
  );
};

export default AddDiscountRecurringInvoiceItem;

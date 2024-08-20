import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useReducer, useState } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { toast } from "react-toastify";
import {
  InModalActionType,
  InModalState,
  modalReducer,
} from "@/reducers/InModalAction";
import Loader from "../../Loader";
import CustomInput from "../../CustomFormControls/CustomInput";
import { StudentBasicDto } from "@/dtos/StudentDto";
import InvoiceItemModal from "@/models/InvoiceItemModal";
import SpecialFeeListDto from "@/dtos/SpecialFeeListDto";
import { yupResolver } from "@hookform/resolvers/yup";
import InvoiceItemValidationSchema from "@/validation/InvoiceItemValidationSchema";
import CustomSelect from "../../CustomFormControls/CustomSelect";

const initialState: InModalState = {
  modalHeading: "Add Discount",
  isUpdate: false,
  refreshRequired: false,
  showLoader: false,
};

interface AddDiscountProps extends CommonProps {
  invoiceId: number;
  itemId: number;
  parentId: number;
  isOpen: boolean;
  onClose: (refreshRequired: boolean) => void;
}

const AddDiscount: NextPage<AddDiscountProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [state, dispatch] = useReducer(modalReducer, initialState);
  const [unitPrice, setUnitPrice] = useState<number>();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setValue,
    getValues
  } = useForm<InvoiceItemModal>({
    resolver: yupResolver(InvoiceItemValidationSchema),
    defaultValues: {
      studentId: 0,
      amount: 0,
      discountType: "",
      feeType: "Discount",
      feeName: "",
      feeTypeId: 0,
      invoiceId: props.invoiceId,
      quantity: 1,
      itemAddedOn: new Date(),
      occurrence: ""
    },
  });

  const submitData = async (model: InvoiceItemModal) => {
    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: true,
    });

    const response = await unitOfService.InvoiceService.saveInvoiceItem(
      props.itemId,
      model
    );

    dispatch({
      type: InModalActionType.SHOW_LOADER,
      payload: false,
    });

    if (response && response.status === 200 && response.data.data) {
      toast.success("Discount saved successfully");

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

  const [students, setStudent] = useState<StudentBasicDto[]>([]);
  const fetchStudents = async (parentId: number) => {
    const response = await unitOfService.StudentService.getStudentsByParentId(
      parentId
    );
    if (response && response.status === 200 && response.data.data) {
      setStudent(response.data.data);
    }
  };

  const [feeLists, setFeeLists] = useState<SpecialFeeListDto[]>([]);
  const fetchSpecialFees = async () => {
    const response = await unitOfService.SpecialFeeListService.getAll({
      page: 1,
      q: "",
      recordPerPage: 10000,
      sortBy: "",
      sortDirection: "",
    });
    if (response && response.status === 200 && response.data.data) {
      setFeeLists(response.data.data.specialFeeList);      
    }
  };

  const fetchInvoiceItem = async (invoiceId: number, itemId: number) => {
    const response = await unitOfService.InvoiceService.getInvoiceItemById(
      invoiceId,
      itemId
    );
    if (response && response.status === 200 && response.data.data) {
      const invoiceItem = response.data.data;
      setValue("invoiceId", invoiceId);
      setValue("studentId", invoiceItem.studentId || 0);
      setValue("feeType", invoiceItem.feeType);
      setValue("feeTypeId", invoiceItem.feeTypeId || 0);
      setValue("discountType", invoiceItem.discountType || "");
      setValue("feeName", invoiceItem.feeName || "");
      setValue("quantity", invoiceItem.quantity);
      setValue("amount", invoiceItem.amount);
      setValue("occurrence", invoiceItem.occurrence || "");

      if (invoiceItem.itemAddedOn) {
        setValue(
          "itemAddedOn",
          new Date(unitOfService.DateTimeService.convertToLocalDate(invoiceItem.itemAddedOn))
        );
      }

      dispatch({
        type: InModalActionType.SET_MODAL_HEADING,
        payload: "Update Discount",
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
        await fetchStudents(props.parentId);
        await fetchSpecialFees();
        await fetchInvoiceItem(props.invoiceId, props.itemId);
      }
    })();
  }, []);

  useEffect(() => {
    const pricePerUnit = feeLists.find(
        (e) => e.id === getValues('feeTypeId') || 0
      )?.pricePerUnit;
      setUnitPrice(pricePerUnit);
  }, [feeLists]);

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
        <Form
          method="post"
          autoComplete="off"
          onSubmit={handleSubmit(submitData)}
        >
          <Form.Control type="hidden" {...register("invoiceId")} />
          <Modal.Body>
            <Form.Group className="mb-3">
              <CustomSelect
                name="studentId"
                control={control}
                placeholder="Select Student*"
                isSearchable={true}
                options={students}
                textField="name"
                valueField="id"
              />
            </Form.Group>  

            <Form.Group className="mb-3">
              <FloatingLabel label="Discount Name*">
                <CustomInput
                  control={control}
                  name="feeName"
                  placeholder="Discount Name*"
                />
              </FloatingLabel>
            </Form.Group>                                   

            <Form.Group className="mb-3">
              <FloatingLabel label="Discount Amount*">
                <CustomInput
                  control={control}
                  name="amount"
                  placeholder="Discount Amount*"
                />
              </FloatingLabel>
            </Form.Group>  

            <Form.Group className="mb-3">
              <CustomSelect
                name="occurrence"
                control={control}
                placeholder="Select Occurrence*"
                isSearchable={true}
                options={[
                  { label: "Once", text: "Once" },
                  { label: "Recurring", text: "Recurring" },
                ]}
                textField="text"
                valueField="label"
              />
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
              {state.isUpdate ? "Update" : "Add"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {state.showLoader && <Loader />}
    </>
  );
};

export default AddDiscount;

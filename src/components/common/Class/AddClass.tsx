import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import { useEffect, useReducer, useState } from "react";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";



import ErrorLabel from "../../common/CustomError/ErrorLabel";

import Loader from "../../common/Loader";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { AxiosResponse } from "axios";
import { StaffBasicDto, StaffListResponseDto } from "@/dtos/StaffDto";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import LevelDto from "@/dtos/LevelDto";
import {
    InPageAddUpdateActionType,
    InPageAddUpdateState,
    reducer,
} from "@/reducers/InPageAddUpdateAction";
import ClassDto from "@/dtos/ClassDto";
import ClassModel from "@/models/ClassModel";
import ClassValidationSchema from "@/validation/ClassValidationSchema";
import CustomSelect from "../CustomFormControls/CustomSelect";
import SemesterDto from "@/dtos/SemesterDto";
import StaffListParams from "@/params/StaffListParams";
import LevelListParams from "@/params/LevelListParams";

const initialPageState: InPageAddUpdateState<ClassDto[]> = {
    id: 0,
    showLoader: false,
    refreshRequired: false,
    isUpdating:false,
};

interface AddClassProps extends CommonProps {
    id: number;
}

const AddClassPage: NextPage<AddClassProps> = (props) => {

    const router = useRouter();
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [classes, dispatch] = useReducer(reducer<ClassDto[]>, initialPageState);
    
    const fetchClass = async (id: number) => {
        let response = await unitOfService.ClassService.getById(id);
        dispatch({
            type: InPageAddUpdateActionType.SHOW_LOADER,
            payload: false,
        });

        if (response && response.status === 200 && response.data.data) {
            dispatch({
                type: InPageAddUpdateActionType.IS_UPDATING,
                payload: true,
            });
            let classes = response.data.data;
            setValue("id", classes.id);
            setValue("name", classes.name);
            setValue("capacity", classes.capacity.toString());
            setValue("levelId", classes.levelId);
            setValue("semesterId", classes.semesterId);
            setValue("leadGuideId", classes.leadGuideId);
        }
    };

    useEffect(() => {
        (async () => {
            fetchClass(props.id);
        })();
    }, []);


    const { formState, handleSubmit, register, setValue, control } = useForm<ClassModel>({
        resolver: yupResolver(ClassValidationSchema),
        defaultValues: {
            id: 0,
            name: '',
            capacity: '',
            staffClassAssignment: []
        },
    });

    const submitData = async (formData: ClassModel) => {
        dispatch({
            type: InPageAddUpdateActionType.SHOW_LOADER,
            payload: false,
        });

        let response: AxiosResponse<Response<ClassDto>>;
        if (classes.isUpdating) {
            response = await unitOfService.ClassService.update(
                formData.id,
                formData
            );
        } else {
            response = await unitOfService.ClassService.add(formData);
        }

        if (
            response &&
            (response.status === 200 || response.status === 201) &&
            response.data.data
        ) {
            toast.success("Class added successfully");
            router.push('/admin/class/');
        } else {
            let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
            toast.error(error);
        }
    };


    const { errors } = formState;


    const [levels, setLevel] = useState<LevelDto[]>([]);
    const fetchLevel = async (q?: LevelListParams) => {
        const response = await unitOfService.LevelService.getAll(q);
        if (response && response.status === 200 && response.data.data) {
            setLevel(response.data.data);
        }
    };

    const [semester, setSemester] = useState<SemesterDto[]>([]);
    const fetchSemester = async (q?: string) => {
        const response = await unitOfService.SemesterService.getAll(q || '');
        if (response && response.status === 200 && response.data.data) {
            setSemester(response.data.data);
        }
    };

    const [staffs, setStaff] = useState<StaffBasicDto[]>();
    const fetchStaff = async (p?: StaffListParams) => {
        const response = await unitOfService.StaffService.getStaffListBasic();
        if (response && response.status === 200 && response.data.data) {
            setStaff(response.data.data);
        }
    };

    useEffect(() => {
        (async () => {
            fetchLevel();
            fetchSemester();
            fetchStaff();
        })();
    }, []);


    return (
        <>
            <Form method="post" autoComplete="off" onSubmit={handleSubmit(submitData)}>
                <Form.Control type="hidden" {...register("id")} />
                <Row>
                    <Col md={6} xl={6} xxl={4}>
                        <Form.Group className="mb-3">
                            <FloatingLabel controlId="floatingInput" label="Class Name*">
                                <Form.Control type="text" placeholder="Class Name*" {...register("name")} />
                            </FloatingLabel>
                            {errors.name && <ErrorLabel message={errors.name.message} />}
                        </Form.Group>
                    </Col>
                    <Col md={6} xl={6} xxl={4}>
                        <Form.Group className="mb-3">
                            <FloatingLabel controlId="floatingInput" label="Class Capacity*">
                                <Form.Control type="text" placeholder="Class Capacity*" {...register("capacity")} />
                            </FloatingLabel>
                            {errors.capacity && <ErrorLabel message={errors.capacity.message} />}
                        </Form.Group>
                    </Col>

                    <Col md={6} xl={6} xxl={4}>
                        <Form.Group className="mb-3">
                            <CustomSelect
                                name="semesterId"
                                control={control}
                                placeholder="Select Semester*"
                                isSearchable={true}
                                options={semester}
                                textField="name"
                                valueField="id"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6} xl={6} xxl={4}>
                        <Form.Group className="mb-3">
                            <CustomSelect
                                name="levelId"
                                control={control}
                                placeholder="Select Level*"
                                isSearchable={true}
                                options={levels}
                                textField="name"
                                valueField="id"
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6} xl={6} xxl={4}>
                        <Form.Group className="mb-3">
                            <CustomSelect
                                name="leadGuideId"
                                control={control}
                                placeholder="Select Lead Guide*"
                                isSearchable={true}
                                options={staffs}
                                textField="name"
                                valueField="id"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={12} lg={12}>
                        <Button type="submit" className='btn_main mx-1'>Save</Button>
                        <Button type="button" className='btn_border mx-1' onClick={() => {
                            router.back();
                        }}>Cancel</Button>
                    </Col>

                </Row>
                
            </Form>
            {classes.showLoader && <Loader />}
        </>
    )
}
export default AddClassPage;
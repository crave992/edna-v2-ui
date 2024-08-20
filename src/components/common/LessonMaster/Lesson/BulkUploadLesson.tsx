import CommonProps from "@/models/CommonProps";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { Button, Form, FormLabel, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useReducer, useState } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { toast } from "react-toastify";
import {
    InModalActionType,
    InModalState,
    modalReducer,
} from "@/reducers/InModalAction";
import Loader from "../../Loader";
import LevelDto from "@/dtos/LevelDto";
import CustomSelect from "../../CustomFormControls/CustomSelect";
import PlainDto from "@/dtos/PlainDto";
import ErrorLabel from "../../CustomError/ErrorLabel";

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import AreaDto from "@/dtos/AreaDto";
import LessonModel, { LessonModelBulkUpload } from "@/models/LessonModel";
import TopicDto from "@/dtos/TopicDto";
import { LessonBulkValidationSchema } from "@/validation/LessonValidationSchema";
import LevelListParams from "@/params/LevelListParams";

const initialState: InModalState = {
    modalHeading: "Upload Lesson",
    isUpdate: false,
    refreshRequired: false,
    showLoader: false,
};

interface AddLessonProps extends CommonProps {
    isOpen: boolean;
    onClose: (refreshRequired: boolean) => void;
}

const BulkUploadLesson: NextPage<AddLessonProps> = (props) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [state, dispatch] = useReducer(modalReducer, initialState);

    const { formState, handleSubmit, register, setValue, control, getValues } = useForm<LessonModelBulkUpload>({
        resolver: yupResolver(LessonBulkValidationSchema),
        defaultValues: {
            levelId: 0
        },
    });

    const { errors } = formState;

    const [levels, setLevel] = useState<LevelDto[]>([]);
    const fetchLevel = async (q?: LevelListParams) => {
        const response = await unitOfService.LevelService.getAll(q);
        if (response && response.status === 200 && response.data.data) {
            setLevel(response.data.data);
        }
    };

    const [areas, setAreas] = useState<AreaDto[]>([]);
    const fetchAreaByLevel = async (levelId: number) => {
        const response = await unitOfService.AreaService.getAreaByLevel(levelId);
        if (response && response.status === 200 && response.data.data) {
            setAreas(response.data.data);
        }
    };

    const [topics, setTopic] = useState<TopicDto[]>([]);
    const fetchTopicByLevelAndArea = async (levelId: number, areaId: number) => {
        const response = await unitOfService.TopicService.getTopicByLevelAndArea(levelId, areaId);
        if (response && response.status === 200 && response.data.data) {
            setTopic(response.data.data);
        }
    };

    useEffect(() => {
        (async () => {
            if (props.isOpen) {
                fetchLevel();
            }
        })();
    }, []);

    const processFile = async (levelId: number, areaId: number, topicId: number, files: FileList):
        Promise<{ status: boolean; data: LessonModel[]; message: string }> => {
        return new Promise((resolve) => {
            if (files && files.length > 0) {
                const isExcelFile =
                    files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                    files[0].type === 'application/vnd.ms-excel';

                if (isExcelFile) {
                    const fileReader = new FileReader();
                    fileReader.onload = (e) => {
                        const data = new Uint8Array(e.target?.result as ArrayBuffer);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                        if (worksheet['!ref']) {
                            const range = XLSX.utils.decode_range(worksheet['!ref']);
                            range.s.r++;
                            range.s.c;

                            const headerValues = ['name', 'sequenceName', 'description', 'materialUsed', 'sequenceNumber', 'sequentialAssignment'];
                            const rangeRowCount = range.e.r - range.s.r + 1;
                            const rangeColumnCount = range.e.c - range.s.c + 1;

                            if (rangeRowCount === 0 || rangeColumnCount !== headerValues.length) {
                                resolve({
                                    status: false,
                                    message: 'Invalid Excel sheet format. Incorrect columns.',
                                    data: [],
                                });
                            } else {
                                const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                                    range,
                                    header: headerValues,
                                });
                                
                                const dataArray = jsonData.map((item: any) => ({
                                    levelId: levelId,
                                    areaId: areaId,
                                    topicId: topicId,
                                    name: item.name || '',
                                    sequenceName: item.sequenceName || '',
                                    description: item.description || '',
                                    materialUsed: item.materialUsed || '',
                                    sequenceNumber: item.sequenceNumber || '',
                                    sequentialAssignment: item.sequentialAssignment || '',
                                }));

                                resolve({
                                    status: true,
                                    message: '',
                                    data: dataArray as unknown as LessonModel[],
                                });
                            }
                        } else {
                            resolve({
                                status: false,
                                message: 'Invalid Excel sheet format. No data found.',
                                data: [],
                            });
                        }
                    };

                    fileReader.readAsArrayBuffer(files[0]);
                } else {
                    resolve({
                        status: false,
                        message: 'Please upload an Excel file.',
                        data: [],
                    });
                }
            } else {
                resolve({
                    status: false,
                    message: 'Please upload a file to upload.',
                    data: [],
                });
            }
        });
    };


    const submitData = async (model: LessonModelBulkUpload) => {

        var fileResponse = await processFile(model.levelId, model.areaId, model.topicId, model.document);
        if (fileResponse) {
            if (fileResponse.status) {

                dispatch({
                    type: InModalActionType.SHOW_LOADER,
                    payload: true,
                });

                let response: AxiosResponse<Response<PlainDto>>;
                response = await unitOfService.LessonService.postMultipleLesson(fileResponse.data);

                dispatch({
                    type: InModalActionType.SHOW_LOADER,
                    payload: false,
                });

                if (response && (response.status === 201)) {
                    toast.success("Lessons uploaded successfully");
                    dispatch({
                        type: InModalActionType.IS_REFRESH_REQUIRED,
                        payload: true,
                    });

                    props.onClose(true);
                } else {
                    let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
                    toast.error(error);
                }

            } else {
                toast.error(fileResponse.message);
            }
        } else {
            toast.error("Some error occured. Please try again");
        }
    };


    const downloadData = async () => {
        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: true,
        });

        const downloadableData: any[] = [
            { name: '', sequenceName: '',  description: '', materialUsed: '', sequenceNumber: '', sequentialAssignment: '' },
        ];

        dispatch({
            type: InModalActionType.SHOW_LOADER,
            payload: false,
        });

        const worksheet = XLSX.utils.json_to_sheet(downloadableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Upload Lessons');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const excelData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(excelData, 'bulk-lesson-upload.xlsx');
    };

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

                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <CustomSelect
                                name="levelId"
                                control={control}
                                placeholder="Select Level*"
                                isSearchable={true}
                                options={levels}
                                textField="name"
                                valueField="id"
                                onChange={(option) => {
                                    fetchAreaByLevel(+(option?.[0] || 0));
                                    setValue('areaId', 0)
                                    setValue('topicId', 0)
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <CustomSelect
                                name="areaId"
                                control={control}
                                placeholder="Select Area*"
                                isSearchable={true}
                                options={areas}
                                textField="name"
                                valueField="id"
                                onChange={(option) => {
                                    fetchTopicByLevelAndArea(getValues().levelId, +(option?.[0] || 0));
                                    setValue('topicId', 0)
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <CustomSelect
                                name="topicId"
                                control={control}
                                placeholder="Select Topic*"
                                isSearchable={true}
                                options={topics}
                                textField="name"
                                valueField="id"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FormLabel>Add Attachment</FormLabel>
                            <Form.Control type="file" id="file-input" {...register('document')} />
                            {errors.document && (
                                <ErrorLabel message={errors.document.message} />
                            )}
                        </Form.Group>
                        <span><span onClick={downloadData} className="anchor-span orange_color">Download</span> sample file</span>
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
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {state.showLoader && <Loader />}
        </>
    );
};

export default BulkUploadLesson;

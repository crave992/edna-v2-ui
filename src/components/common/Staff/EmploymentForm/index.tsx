import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StaffEmploymentFormBasicDto } from "@/dtos/StaffDto";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { faDownload, faUpload } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useReducer, useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import Loader from "../../Loader";
import Link from "next/link";
import UploadEmploymentForm from "./UploadEmploymentForm";
import { DocuSignModel } from "@/models/DocuSignModel";
import { toast } from "react-toastify";

const initialPageState: InPageState<StaffEmploymentFormBasicDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const EmploymentForm = () => {
  const [states, dispatch] = useReducer(
    reducer<StaffEmploymentFormBasicDto[]>,
    initialPageState
  );

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [staffEmploymentForm, setstaffEmploymentForm] = useState<StaffEmploymentFormBasicDto[]>([]);
  const [envelopeId, setEvenvelopeId] = useState("");
  const [employmentFormId, setEmploymentFormId] = useState(0);
  const fetchStaffEmploymentForm = async () => {
    const response = await unitOfService.StaffService.getEmploymentForm();
    if (response && response.status == 200 && response.data.data) {

      setstaffEmploymentForm(response.data.data);

    }
  };


  const postDocuSign = async (id: number, templateId: string) => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    let empFormId = id;
    setEmploymentFormId(empFormId)

    const model: DocuSignModel = {
      id: id,
      templateId: templateId
    }
    const response = await unitOfService.DocuSignService.getStaffDocumentForSigned(model);
    if (response && response.status === 200 && response.data.data) {

      const url = response.data.data.url
      const envId = response.data.data.envelopeId; // Store the envelopeId
      setEvenvelopeId(envelopeId);

      if (url) {

        // Store the necessary data in localStorage
        const signedDocumentData = JSON.stringify({
          id: id,
          newEnvId: envId,

        });
        localStorage.setItem('signedDocumentData', signedDocumentData);

        window.open(url, '_self');
        dispatch({
          type: InPageActionType.SHOW_LOADER,
          payload: false,
        });
        dispatch({
          type: InPageActionType.IS_REFRESH_REQUIRED,
          payload: !states.refreshRequired,
        });

      }

    }
    else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      toast.error(error);
    }


  };
  const saveStaffSignedDocument = async () => {

    // Retrieve the stored data from localStorage
    const storedData = localStorage.getItem('signedDocumentData');

    if (storedData) {
      const { id, newEnvId } = JSON.parse(storedData);
      dispatch({
        type: InPageActionType.SHOW_LOADER,
        payload: true,
      });
      const response = await unitOfService.DocuSignService.saveStaffSignedDocument(newEnvId, id);
      if (response && response.status === 200) {

        dispatch({
          type: InPageActionType.SHOW_LOADER,
          payload: false,
        });
        dispatch({
          type: InPageActionType.IS_REFRESH_REQUIRED,
          payload: !states.refreshRequired,
        });

      }
      else {
        let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
        toast.error(error);

      }
      localStorage.removeItem('signedDocumentData');
    }
  };


  useEffect(() => {
    (async () => {
      await fetchStaffEmploymentForm();
      await saveStaffSignedDocument();

    })();
  }, [states.refreshRequired]);

  const openAddUpdateModal = (cid: number) => {
    dispatch({
      type: InPageActionType.SET_ID,
      payload: cid,
    });

    dispatch({
      type: InPageActionType.SHOW_ADD_UPDATE_MODAL,
      payload: true,
    });
  };

  const closeAddUpdateModal = (isRefresh: boolean) => {
    if (isRefresh) {
      dispatch({
        type: InPageActionType.IS_REFRESH_REQUIRED,
        payload: !states.refreshRequired,
      });
    }

    dispatch({
      type: InPageActionType.SET_ID,
      payload: 0,
    });

    dispatch({
      type: InPageActionType.SHOW_ADD_UPDATE_MODAL,
      payload: false,
    });
  };




  return (
    <>
      <hr />
      <h3 className="formBlock-heading">Employment Forms</h3>

      {staffEmploymentForm && staffEmploymentForm.length > 0 && (
        <Table bordered className="custom_design_table mb-5">
          <thead>
            <tr>
              <th>Form Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffEmploymentForm.map((form) => {
              return (
                <tr key={form.employmentFormId}>
                  <td>{form.employmentFormName}</td>
                  <td>{form.status}</td>
                  <td>
                    {!form.employmentFormUrlByStaff && (
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 50, hide: 100 }}
                        overlay={<Tooltip>Download Empty Form</Tooltip>}

                      >
                        <Button
                          className="btn_main small"
                          onClick={() => { postDocuSign(form.employmentFormId, form.templateId); }}
                        >
                          <FontAwesomeIcon icon={faDownload} size="1x" />
                        </Button>

                      </OverlayTrigger>
                    )}

                    {form.employmentFormUrlByStaff && (
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 50, hide: 100 }}
                        overlay={<Tooltip>Download Your Uploaded Form</Tooltip>}
                      >
                        <Link
                          href={form.employmentFormUrlByStaff}
                          target="_blank"
                          download={true}
                          className="btn_main small"

                        >
                          <FontAwesomeIcon icon={faDownload} size="1x" />
                        </Link>
                      </OverlayTrigger>
                    )}

                    {/* <OverlayTrigger
                      placement="top"
                      delay={{ show: 50, hide: 100 }}
                      overlay={<Tooltip>Upload Finished Form</Tooltip>}
                    >
                      <Button
                        className="btn_main small"
                        onClick={() =>
                          openAddUpdateModal(form.employmentFormId)
                        }
                      >
                        <FontAwesomeIcon icon={faUpload} size="1x" />
                      </Button>
                    </OverlayTrigger> */}

                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {/* {states.showAddUpdateModal && (
        <UploadEmploymentForm
          id={states.id}
          isOpen={states.showAddUpdateModal}
          onClose={closeAddUpdateModal}
        />
      )} */}

      {states.showLoader && <Loader />}
    </>
  );
};

export default EmploymentForm;

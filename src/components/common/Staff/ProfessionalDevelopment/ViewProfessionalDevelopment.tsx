import { NextPage } from "next";
import { Col, Row, Table } from "react-bootstrap";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/router";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { useForm } from "react-hook-form";
import { useEffect, useReducer } from "react";
import { useDebounce } from "use-debounce";
import {
  InPageActionType,
  InPageState,
  reducer,
} from "@/reducers/InPageAction";
import { StaffProfessionalDevelopmentDto } from "@/dtos/StaffDto";

interface ViewProfessionalDevelopmentProps {
  staffId: number;
}

const initialPageState: InPageState<StaffProfessionalDevelopmentDto[]> = {
  id: 0,
  currentPage: 1,
  showLoader: false,
  showDeleteModal: false,
  refreshRequired: false,
  showAddUpdateModal: false,
};

const ViewProfessionalDevelopment: NextPage<
  ViewProfessionalDevelopmentProps
> = ({ staffId }) => {
  const router = useRouter();

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const [states, dispatch] = useReducer(
    reducer<StaffProfessionalDevelopmentDto[]>,
    initialPageState
  );

  const fetchProfessionalDevelopment = async () => {
    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: true,
    });

    const response =
      await unitOfService.StaffProfessionalDevelopmentService.getAllByStaffId(
        staffId
      );
    if (response && response.status === 200 && response.data.data) {
      dispatch({
        type: InPageActionType.SET_DATA,
        payload: response.data.data,
      });
    }

    dispatch({
      type: InPageActionType.SHOW_LOADER,
      payload: false,
    });
  };

  useEffect(() => {
    (async () => {
      fetchProfessionalDevelopment();
    })();
  }, []);

  const [searchedValue] = useDebounce(getValues().q, 1000);

  return (
    <>
      <div className="professional_development_page">
        <Row>
          <Col xl={12} xxl={12}>
            <div className="formBlock">
              <Table striped hover className="custom_design_table mb-0">
                <thead>
                  <tr>
                    <th>Training Organization</th>
                    <th>Topic</th>
                    <th>Remaining Hours</th>
                    <th>Entry Date</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {states.data &&
                    states.data.map(
                      (
                        staffProfessionalDevelopment: StaffProfessionalDevelopmentDto
                      ) => {
                        return (
                          <tr key={staffProfessionalDevelopment.id}>
                            <td>
                              {
                                staffProfessionalDevelopment.trainingOrganization
                              }
                            </td>
                            <td>
                              {
                                staffProfessionalDevelopment.topic
                              }
                            </td>
                            <td>
                              {staffProfessionalDevelopment.remainingHours}
                            </td>
                            <td>
                              {unitOfService.DateTimeService.convertToLocalDate(
                                staffProfessionalDevelopment.dateOfEntry
                              )}
                            </td>
                            <td>{staffProfessionalDevelopment.note}</td>
                          </tr>
                        );
                      }
                    )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </div>

      {states.showLoader && <Loader />}
    </>
  );
};
export default ViewProfessionalDevelopment;

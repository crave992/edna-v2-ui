import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { OrganizationDto } from "@/dtos/OrganizationDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import CommonProps from "@/models/CommonProps";
import SchoolDetailsParams from "@/params/SchoolDetailsParams";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { faCheckCircle, faWarning } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";

interface SchoolDetailsPageProps extends CommonProps {
  id: number;
}

const SchoolDetailsPage: NextPage<SchoolDetailsPageProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  useBreadcrumb({
    pageName: "School",
    breadcrumbs: [
      {
        label: "School",
        link: "/superadmin/school",
      },
      {
        label: "Details",
        link: `/superadmin/school/${props.id}`,
      },
    ],
  });

  const router = useRouter();

  const [schoolDetails, setSchoolDetails] = useState<OrganizationDto>();

  const fetchSchoolDetails = async () => {
    let response = await unitOfService.OrganizationService.getById(props.id);
    if (response && response.status === 200 && response.data.data) {
      setSchoolDetails(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchSchoolDetails();
    })();
  }, []);

  return (
    <>
      <Head>
        <title>{schoolDetails?.schoolName} | School Details</title>
      </Head>

      <div className="school_details_page">
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
              <div className="formBlock">
                <div className="db_heading_block">
                  <h1 className="db_heading">
                    {schoolDetails?.schoolName} School Details
                  </h1>
                </div>
                <Table striped hover className="custom_design_table mb-0">
                  <thead>
                    <tr>
                      <th colSpan={2}>Basic Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>School Name</td>
                      <td>{schoolDetails?.schoolName}</td>
                    </tr>
                    <tr>
                      <td>School Email</td>
                      <td>{schoolDetails?.schoolEmail}</td>
                    </tr>
                    <tr>
                      <td>Phone Number</td>
                      <td>{schoolDetails?.phoneNumber}</td>
                    </tr>
                    <tr>
                      <td>Organization Type</td>
                      <td>{schoolDetails?.organizationType?.name}</td>
                    </tr>
                    <tr>
                      <td>Username</td>
                      <td>{schoolDetails?.userName}</td>
                    </tr>
                    <tr>
                      <td>Status</td>
                      <td>
                        {schoolDetails?.isActive ? (
                          <span>
                            <FontAwesomeIcon
                              title="Active"
                              className="text-success"
                              icon={faCheckCircle}
                              size="1x"
                            /> Active
                          </span>
                        ) : (
                          <span>
                            <FontAwesomeIcon
                              className="text-warning"
                              icon={faWarning}
                              size="1x"
                              title="In Active"
                            /> In Active
                          </span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>School URL</td>
                      <td>
                        {schoolDetails?.subDomain && (
                          <Link
                            target="_blank"
                            href={`https://${schoolDetails?.subDomain}.ednaapp.net`}
                          >{`https://${schoolDetails?.subDomain}.ednaapp.net`}</Link>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "30%" }}>About</td>
                      <td style={{ width: "70%" }}>
                        <p>{schoolDetails?.about}</p>
                      </td>
                    </tr>
                  </tbody>
                  <thead>
                    <tr>
                      <th colSpan={2}>Address Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Address Line 1</td>
                      <td>{schoolDetails?.addressLine1}</td>
                    </tr>
                    <tr>
                      <td>Address Line 2</td>
                      <td>{schoolDetails?.addressLine2}</td>
                    </tr>
                    <tr>
                      <td>Country</td>
                      <td>{schoolDetails?.country?.name}</td>
                    </tr>
                    <tr>
                      <td>State</td>
                      <td>{schoolDetails?.state?.name}</td>
                    </tr>
                    <tr>
                      <td>City</td>
                      <td>{schoolDetails?.city}</td>
                    </tr>
                    <tr>
                      <td>Zipcode</td>
                      <td>{schoolDetails?.zipcode}</td>
                    </tr>
                  </tbody>

                  <thead>
                    <tr>
                      <th colSpan={2}>Primary Contact Person Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Person Name</td>
                      <td>{schoolDetails?.primaryContact?.name}</td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td>{schoolDetails?.primaryContact?.email}</td>
                    </tr>
                    <tr>
                      <td>Phone</td>
                      <td>{schoolDetails?.primaryContact?.phone}</td>
                    </tr>
                    <tr>
                      <td>Address Line 1</td>
                      <td>{schoolDetails?.primaryContact?.addressLine1}</td>
                    </tr>
                    <tr>
                      <td>Address Line 2</td>
                      <td>{schoolDetails?.primaryContact?.addressLine2}</td>
                    </tr>
                    <tr>
                      <td>Country</td>
                      <td>{schoolDetails?.primaryContact?.country?.name}</td>
                    </tr>
                    <tr>
                      <td>State</td>
                      <td>{schoolDetails?.primaryContact?.state?.name}</td>
                    </tr>
                    <tr>
                      <td>City</td>
                      <td>{schoolDetails?.primaryContact?.city}</td>
                    </tr>
                    <tr>
                      <td>Zipcode</td>
                      <td>{schoolDetails?.primaryContact?.zipcode}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default SchoolDetailsPage;

export const getServerSideProps: GetServerSideProps<
  SchoolDetailsParams
> = async (context) => {
  let initialParamas: SchoolDetailsParams = {
    id: +(context.query.id || 0),
  };

  return {
    props: initialParamas,
  };
};

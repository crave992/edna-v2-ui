import { Card, Col, ListGroup, Row } from "react-bootstrap";

import { NextPage } from "next";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { useEffect, useState } from "react";

import CommonProps from "@/models/CommonProps";
import Link from "next/link";
import { ParentDto } from "@/dtos/ParentDto";
import {
  faInfoCircle,
  faHome,
  faPhone,
  faEnvelope,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ParentDetailsProps extends CommonProps {
  studentId: number;
}

const ViewParent: NextPage<ParentDetailsProps> = ({ studentId }) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [parents, setParents] = useState<ParentDto[]>([]);
  const fetchParentDetails = async (studentId: number) => {
    const response = await unitOfService.ParentService.getAllParentsByStudentId(
      studentId
    );
    if (response && response.status === 200 && response.data.data) {
      setParents(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchParentDetails(studentId);
    })();
  }, []);

  return (
    <>
      <Row>
        {parents &&
          parents.map((parent) => {
            return (
              <Col md={6} lg={6} xl={4} xxl={4}  key={parent.id}>
                <div className="parent_info formBlock p-0">
                  <Card border="light">
                    <Card.Header className="d-flex justify-content-between">
                      <strong>
                        {parent.firstName} {parent.lastName}
                      </strong>
                      <Link href={`/students/parent-details/info/${parent.id}`}>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="orange_color"
                        />
                      </Link>
                    </Card.Header>
                    <ListGroup className="list-group-flush p-2">
                      <ListGroup.Item>
                        <FontAwesomeIcon
                          icon={faHome}
                          size="1x"
                          className="text-secondary me-3"
                        />
                        {parent.addressLine1} {parent.addressLine2}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <FontAwesomeIcon
                          icon={faPhone}
                          size="1x"
                          className="text-secondary me-3"
                        />{" "}
                        {parent.cellPhone}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          size="1x"
                          className="text-secondary me-3"
                        />{" "}
                        {parent.email}
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                </div>
              </Col>
            );
          })}
      </Row>
    </>
  );
};

export default ViewParent;

import { faPenToSquare, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Table, OverlayTrigger, Tooltip } from "react-bootstrap";

const BasicStudentList = () => {
  return (
    <>
      <div className="db_heading_block">
        <h1 className="db_heading">Enrolled Child</h1>
      </div>
      <div className="formBlock">
        <Table striped hover className="custom_design_table mb-0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Level</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Child Name</td>
              <td>Nido</td>
              <td>
                <span className="userActions">
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 50, hide: 100 }}
                    overlay={<Tooltip>Edit</Tooltip>}
                  >
                    <Link href={""} className="btn_main small">
                      <FontAwesomeIcon icon={faPenToSquare} size="1x" />
                    </Link>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 50, hide: 100 }}
                    overlay={<Tooltip>Deactivate Staff</Tooltip>}
                  >
                    <Link href={""} className="btn_main small">
                      <FontAwesomeIcon icon={faTrash} size="1x" />
                    </Link>
                  </OverlayTrigger>
                </span>
              </td>
            </tr>
            <tr>
              <td>Child Name</td>
              <td>Nido</td>
              <td>
                <span className="userActions">
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 50, hide: 100 }}
                    overlay={<Tooltip>Edit</Tooltip>}
                  >
                    <Link href={""} className="btn_main small">
                      <FontAwesomeIcon icon={faPenToSquare} size="1x" />
                    </Link>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 50, hide: 100 }}
                    overlay={<Tooltip>Deactivate Staff</Tooltip>}
                  >
                    <Link href={""} className="btn_main small">
                      <FontAwesomeIcon icon={faTrash} size="1x" />
                    </Link>
                  </OverlayTrigger>
                </span>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default BasicStudentList;

import CommonProps from '@/models/CommonProps';
import { faRightFromBracket, faUser, faClose } from '@fortawesome/pro-regular-svg-icons';
import { faBarsSort } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NextPage } from 'next';
import Link from 'next/link';
import { Button, Col, Container, Dropdown, FloatingLabel, Form, Image, Modal, Row } from 'react-bootstrap';
import Logout from '../Logout';
import { InPageActionType } from '@/reducers/InPageAction';
import Loader from '../Loader';
import useImpersonation from '@/hooks/useImpersonation';

interface AdminHeaderProps extends CommonProps {
  handleClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const AdminHeader: NextPage<AdminHeaderProps> = (props) => {
  const { user, updateUserToAudit, isImpersonatingUser, auditUser, users, dispatch, showLoader, groupedUsers } =
    useImpersonation();

  return (
    <>
      <div className="header_wrap">
        <div className="site_header">
          <div className="d-flex align-items-center">
            <div className="sidebar_collapse" onClick={props.handleClick}>
              <FontAwesomeIcon icon={faBarsSort} size="lg" />
            </div>
            {/* <Breadcrumb /> */}
          </div>
          <div className="d-flex flex-row-reverse">
            <div className={'profile_tab logout_tab ' + (isImpersonatingUser ? 'profile_impersonating' : '')}>
              <Logout>
                {isImpersonatingUser ? (
                  <FontAwesomeIcon icon={faClose} size="1x" />
                ) : (
                  <FontAwesomeIcon icon={faRightFromBracket} size="1x" />
                )}
              </Logout>
            </div>
            <div className={'profile_tab ' + (isImpersonatingUser ? 'profile_impersonating' : '')}>
              <Dropdown className="message_tab">
                <Dropdown.Toggle variant="light" id="dropdown-custom-components">
                  <div className="user_profile">
                    {user?.profilePicture ? (
                      <span className="user_profile_icon">
                        <Image fluid alt={user?.fullName} src={user?.profilePicture} />
                      </span>
                    ) : (
                      <span
                        className={
                          'user_profile_icon ' + (isImpersonatingUser ? 'user_profile_icon_impersonating' : '')
                        }
                      >
                        <FontAwesomeIcon icon={faUser} size="1x" />
                      </span>
                    )}
                    <div className="user_details">
                      <p>{isImpersonatingUser ? <span>Auditing User</span> : <span>Welcome</span>}</p>
                      <p>{user?.fullName}</p>
                    </div>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} className="dropdown-item" href={'/account/my-profile'}>
                    My Profile
                  </Dropdown.Item>
                  {user && user.roles[0].name == 'Administrator' && (
                    <Dropdown.Item
                      as={Link}
                      className="dropdown-item"
                      href="#"
                      onClick={() => {
                        dispatch({
                          type: InPageActionType.SHOW_ADD_UPDATE_MODAL,
                          payload: true,
                        });
                      }}
                    >
                      Audit User
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item as={Link} className="dropdown-item" href={'/account/change-password'}>
                    Change Password
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={users.showAddUpdateModal}
        onHide={() => {
          dispatch({
            type: InPageActionType.SHOW_ADD_UPDATE_MODAL,
            payload: false,
          });
        }}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Select User to audit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="auditUserForm">
            <Container fluid>
              <Row className="justify-content-center mb-2">
                <Col md="12">
                  <Form.Group className="mb-3">
                    <FloatingLabel label="User*">
                      <Form.Select aria-label="User*" onChange={updateUserToAudit}>
                        <option>- Select User -</option>
                        {groupedUsers &&
                          Object.keys(groupedUsers)
                            .sort()
                            .map((roleName: string) => {
                              return (
                                <optgroup label={roleName} key={roleName}>
                                  {groupedUsers[roleName].map((user) => (
                                    <option key={user.id} value={user.id}>
                                      {user.fullName} {`<${user.email}>`}
                                    </option>
                                  ))}
                                </optgroup>
                              );
                            })}
                      </Form.Select>
                    </FloatingLabel>
                  </Form.Group>
                </Col>
                <Col md="9"></Col>
                <Col md="3">
                  <Button className="btn_main" type="button" onClick={auditUser}>
                    Audit User
                  </Button>
                </Col>
              </Row>
            </Container>
          </div>
        </Modal.Body>
      </Modal>
      {showLoader && <Loader />}
    </>
  );
};

export default AdminHeader;

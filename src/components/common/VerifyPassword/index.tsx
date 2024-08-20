import siteMetadata from "@/constants/siteMetadata";
import { faCamera } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { InputHTMLAttributes } from "react";
import { Form, Col, Row, Modal, Button, Spinner } from "react-bootstrap";
import { useState, useEffect, SetStateAction } from "react";
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import { toast } from "react-toastify";
import { VerifyPasswordModel } from "@/models/ChangePasswordModel";
import { AxiosError } from "axios";

interface VerifyPasswordProps {
    onCancel: () => void;
    onSuccess: () => void;
}

const VerifyPassword = (props: VerifyPasswordProps)  => {
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [busy, setBusy] = useState<boolean>(false);

    const [password, setPassword] = useState<string>("");
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    const verifyPassword = async () => {
        if(password.length > 0){
            try {
                setBusy(true);
                var result = await unitOfService.AccountService.verifyUserPassword({
                    password: password
                } as VerifyPasswordModel);
                
                if(result instanceof AxiosError){
                    var axiosError = result.response?.data;

                    if(!axiosError.success){
                        var errMsg = axiosError.message.length > 0 ? axiosError.message : axiosError.errors.join("\n");
                        toast.error(errMsg);
                    }
                } else {
                    if(result.data.success){
                        setIsVerified(true);
                        setPassword("");
                        props.onSuccess();
                    } else {
                        toast.error(result.data.message);
                    }
                }
                
            } catch (e:any){
                var message = "";
                console.log(e);
                if(e.response){
                    var dataResponse = e.response.data;
                    message = dataResponse.message;
                } else if(e.errors){
                    message = e.errors[0];
                }
                toast.error(message);
            } finally {
                setBusy(false);
            }
        } else {
          toast.warn("Password Empty.");
        }
      }

    return (
        <>
            {
            !isVerified ? (
                <>
                    <div className='overlay-top-of-blur'>
                        <Modal
                            show={!isVerified}
                            onHide={() => {
                                props.onCancel();
                            }}
                            backdrop="static"
                            keyboard={false}
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                        >
                            <Modal.Header>
                                <Modal.Title>
                                    Verify Password
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => {
                                    setPassword(e.target.value)
                                }}/>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="btn_main orange_btn" onClick={props.onCancel}> Cancel </Button>
                                <Button className="btn_main" type="button"
                                    onClick={() => {
                                        verifyPassword();
                                    }}> 
                                        <span>Verify</span>
                                        {
                                            busy ? (
                                                <Spinner as="span" animation="grow" size="sm" className="button-spinner"/>  
                                            ) : null
                                        }
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <div className='overlay-blur'></div>
                </>
                ) : null
            }
        </>
    )
}

export default VerifyPassword;
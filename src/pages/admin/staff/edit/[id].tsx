import EditStaffByAdmin from "@/components/common/Staff/EditStaffByAdmin";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import StaffDto from "@/dtos/StaffDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import CommonProps from "@/models/CommonProps";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

interface AddStaffProps extends CommonProps { 
    id: number;
}

const EditStaff: NextPage<AddStaffProps> = (props) => {
    useBreadcrumb({
        pageName: "Edit Staff",
        breadcrumbs: [
            {
                label: "Admin",
                link: "/admin/dashboard",
            },
            {
                label: "Staff",
                link: "/admin/staff/",
            },
            {
                label: "Update Staff",
                link: `/admin/staff/edit/${props.id}`,
            },
        ],
    });

    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    
    const [staff, setStaff] = useState<StaffDto>();
    const fetchStaffById = async (staffId: number) => {
        const response = await unitOfService.StaffService.getBasicDetailById(staffId);
        if (response && response.status === 200 && response.data.data) {
            setStaff(response.data.data);
            return response.data.data;
        }
        return null;
    };

    useEffect(() => {
        (async () => {
            await fetchStaffById(props.id);
        })();
    }, []);

    return (
        <>
            <Head>
                <title>Add Staff - Noorana</title>
            </Head>
            <div className="staff_list_page">
                <Container fluid>
                    <Row>
                        <Col md={12} lg={12} xl={9} xxl={8}>
                            <div className='db_heading_block'>
                                <h1 className='db_heading'>Update Staff Details</h1>
                            </div>
                            <div className="formBlock">
                                {staff && <EditStaffByAdmin id={props.id} staff={staff} />}                                
                            </div>
                        </Col>
                    </Row>

                </Container>
            </div>
        </>
    )
}
export default EditStaff;

export const getServerSideProps: GetServerSideProps<
    AddStaffProps
> = async (context) => {
    let initialParamas: AddStaffProps = {
        id: +(context.query.id || 0),
    };

    return {
        props: initialParamas,
    };
};
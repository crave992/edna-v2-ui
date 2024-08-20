import UpdateParent from "@/components/common/Parent/AddParent/UpdateParent";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { ParentDto } from "@/dtos/ParentDto";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import CommonProps from "@/models/CommonProps";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Col, Container, Row,} from "react-bootstrap";

interface StaffInfoProps extends CommonProps {
    id: number;
}

const StaffInfo: NextPage<StaffInfoProps> = (props) => {
    useBreadcrumb({
        pageName: "Parent Info",
        breadcrumbs: [
            {
                label: "Admin",
                link: "/admin/dashboard",
            },
            {
                label: "Parent",
                link: "/admin/parents/",
            },
            {
                label: "Staff Info",
                link: `/admin/parents/info/${props.id}`,
            },
        ],
    });

    const [parentDetails, setParentDetails] = useState<ParentDto>();

    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const fetchParnet = async (parentId: number) => {
        let response = await unitOfService.ParentService.getByParentId(parentId);
        if (response && response.status === 200 && response.data.data) {
            setParentDetails(response.data.data);
            return response.data.data;
        }
        return null;
    };

    useEffect(() => {
        (async () => {
            await fetchParnet(props.id);
        })();
    }, []);

    return (
        <>
            <Head>
                <title>
                    {parentDetails?.firstName} {parentDetails?.lastName} Information - Noorana
                </title>
            </Head>
            <div className="parent_info_page">
                <Container fluid>
                    <Row>
                        <Col xl={12} xxl={9}>
                            <div className="db_heading_block">
                                <h1 className="db_heading">{parentDetails?.firstName} {parentDetails?.lastName}</h1>
                            </div>
                            <div className="formBlock">
                                <UpdateParent id={props.id} />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};
export default StaffInfo;

export const getServerSideProps: GetServerSideProps<StaffInfoProps> = async (
    context
) => {
    let initialParamas: StaffInfoProps = {
        id: +(context.query.id || 0),
    };

    return {
        props: initialParamas,
    };
};

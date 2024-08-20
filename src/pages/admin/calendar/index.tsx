import CalendarPage from "@/components/common/HolidaysEvents/Calendar";
import Events from "@/components/common/HolidaysEvents/Events";
import Holidays from "@/components/common/HolidaysEvents/Holidays";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

interface HolidayPageProps extends CommonProps {
    q: string;
}

const HolidayPage: NextPage<HolidayPageProps> = (props) => {
    useBreadcrumb({
        pageName: "Calendar",
        breadcrumbs: [
            {
                label: "Admin",
                link: "/admin/dashboard",
            },
            {
                label: "Calendar",
                link: "/admin/calendar",
            },
        ],
    });

    return (
        <>
            <Head>
                <title>Holidays - Noorana</title>
            </Head>

            <div className="home_page">
                <Container fluid>
                    <Row>
                        <Col xxl={6}>
                            <Tabs>
                                <TabList>
                                    <Tab>Holidays</Tab>
                                    <Tab>Events</Tab>
                                </TabList>

                                <TabPanel>
                                    <div className="formBlock">
                                        <Holidays />
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <div className="formBlock">
                                        <Events />
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </Col>
                        <Col xxl={6}>
                            <CalendarPage/>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default HolidayPage;
import React, { useEffect, useState } from "react";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import CommonProps from "@/models/CommonProps";
import { NextPage } from "next";
import Head from "next/head";
import { Col, Container, Row } from "react-bootstrap";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { container } from "@/config/ioc";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { TYPES } from "@/config/types";
import HolidayDto from "@/dtos/HolidayDto";
import EventDto from "@/dtos/EventDto";


interface CalendarPageProps extends CommonProps {}

const CalendarPage: NextPage<CalendarPageProps> = (props) => {
    useBreadcrumb({
        pageName: "Calendar",
        breadcrumbs: [
            {
                label: "Dashboard",
                link: "/admin/dashboard",
            },
            {
                label: "Calendar",
                link: "/admin/calendar",
            },
        ],
    });
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const [holidays, setHolidays] = useState<HolidayDto[]>([])
    const fetchHolidays = async () => {
        const response = await unitOfService.HolidayService.getAll();
        if (response && response.status === 200 && response.data.data) {
            setHolidays(response.data.data)
        }
    };

    const [eventList, setEventList] = useState<EventDto[]>([])
    const fetchEvents = async () => {
        const response = await unitOfService.EventService.getAll();
        if (response && response.status === 200 && response.data.data) {
            setEventList(response.data.data)
        }
    };

    useEffect(() => {
        (async () => {
            await fetchHolidays();
            await fetchEvents();
        })();
    }, []);

    // Define the events


    const combinedEvents = [...eventList.map((eventItem) => ({
        title: eventItem.name,
        start: eventItem.date,
        end: eventItem.date,
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        eventColor: '#f30'
    })), ...holidays.map((holiday) => ({
        title: holiday.name,
        start: holiday.startDate,
        end: holiday.endDate,
        backgroundColor: '#f3620f',
        borderColor: '#f3620f',
    }))];
    

    // Define the calendar options
    const calendarOptions = {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        events: combinedEvents,
        headerToolbar: {
            left: 'title',
            center: '',
            right: 'prev,next',
        },
        navLinks: false,
    };



    return (
        <>
            <Head>
                <title>Caledar - Noorana</title>
            </Head>
            <div className="calendar_page">
                <Container fluid>
                    <Row>
                        <div className='db_heading_block'>
                            <h1 className='db_heading'>Calendar</h1>
                        </div>
                        <div className="formBlock">
                            <FullCalendar {...calendarOptions} />
                        </div>
                    </Row>
                </Container>
            </div>

        </>
    )
}


export default CalendarPage;
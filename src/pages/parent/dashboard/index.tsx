import Head from 'next/head';
import Link from 'next/link';

import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollar, faPlusCircle } from '@fortawesome/pro-solid-svg-icons';
import useBreadcrumb from '@/hooks/useBreadcrumb';
import { useEffect, useState } from 'react';
import { StudentBasicDto } from '@/dtos/StudentDto';
import { container } from '@/config/ioc';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { TYPES } from '@/config/types';
import { useRouter } from 'next/router';
import { PickUpDropOffStudentWiseBasicDto } from '@/dtos/PickUpDropOffStudentWiseDto';
import TodayPickupDropOff from '@/components/common/Student/TodayPickupDropOff';
import Avatar from '@/components/common/Avatar';

const ParentDashboardPage = () => {
  useBreadcrumb({
    pageName: 'Dashboard',
    breadcrumbs: [
      {
        label: 'Parent',
        link: '/parent/dashboard',
      },
    ],
  });

  const router = useRouter();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

  const [students, setStudent] = useState<StudentBasicDto[]>([]);
  const fetchStudents = async () => {
    const response = await unitOfService.StudentService.getBasicListing();
    if (response && response.status === 200 && response.data.data) {
      setStudent(response.data.data);
    }
  };

  const [todaysPickupDropOff, setTodaysPickupDropOff] = useState<PickUpDropOffStudentWiseBasicDto[]>();
  const fetchTodaysPickupDropOff = async () => {
    const response = await unitOfService.PickUpDropOffStudentWiseService.getTodaysPickupDropOff();
    if (response && response.status === 200 && response.data.data) {
      setTodaysPickupDropOff(response.data.data);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchStudents();
      await fetchTodaysPickupDropOff();
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Parent Dashboard - Noorana</title>
      </Head>
      <div className="home_page">
        <Container fluid>
          <Row lg={3} xl={3} xxl={4}>
            {students &&
              students.map((stud) => {
                return (
                  <Col key={stud.id}>
                    <div className="user_profile formBlock">
                      <div
                        className="tw-h-[120px] tw-flex tw-items-center tw-mr-[15px]"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          router.push(`/parent/student/profile/${stud.id}`);
                        }}
                      >
                        <Avatar imageSrc={stud?.profilePicture || ''} size={100} name="croppedImage" edit={false}/>
                      </div>
                      {/* <div
                        className="user_image"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          router.push(`/parent/student/profile/${stud.id}`);
                        }}
                      >
                        {stud.profilePicture ? (
                          <Image alt={stud.name} src={stud.profilePicture} className="img-fluid" />
                        ) : (
                          <FontAwesomeIcon icon={faUser} size="2x" />
                        )}
                      </div> */}
                      <div className="user_detail">
                        <h2
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            router.push(`/parent/student/profile/${stud.id}`);
                          }}
                        >
                          {stud.name} {!stud.active && "(Inactive)"}
                        </h2>
                        <p>Age: {stud.age}</p>
                        <p>
                          Class: &nbsp;
                          {stud.classes &&
                            stud.classes.map((cla) => {
                              return (
                                <span
                                  key={cla.id}
                                  className="badge badge-primary"
                                  style={{
                                    backgroundColor: '#5d8eb5',
                                    marginRight: '5px',
                                    borderRadius: '2px',
                                    fontStyle: 'normal',
                                  }}
                                >
                                  {cla.name}
                                </span>
                              );
                            })}
                        </p>
                        <p>Level: {stud.level.name}</p>
                        {stud.isPaid === false ? (
                          <>
                            <small>
                              <Link
                                href={`/parent/student/payment/${stud.id}`}
                                className="text-sm"
                                style={{ textDecoration: 'none', color: '#fd1111' }}
                              >
                                <i>Registration payment pending</i>
                                <span
                                  className="btn_main btn btn-sm btn-primary"
                                  style={{ padding: '2px 5px', fontSize: '12px' }}
                                >
                                  <FontAwesomeIcon icon={faDollar} size="1x" /> Pay Now
                                </span>
                              </Link>
                            </small>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </Col>
                );
              })}

            <Col>
              <Link href={'/parent/student/add'} className="user_profile formBlock text-decoration-none">
                <div className="user_image w-100 m-0 flex-column">
                  <FontAwesomeIcon icon={faPlusCircle} size="2x" className="mb-2 text-black-50" />
                  <p className="text-black-50 m-0 text-muted font-weight-bold">Add Student</p>
                </div>
              </Link>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col xl={8}>
              <div className="db_heading_block">
                <h1 className="db_heading">Today Pickup/ Drop-off</h1>
              </div>
              <div className="formBlock">
                <Link href={'/parent/picup-dropoff/daily-updates'} className="btn_main mb-3">
                  Add Pickup/Drop-off
                </Link>
                <TodayPickupDropOff />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ParentDashboardPage;

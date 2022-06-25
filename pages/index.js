import Head from "next/head";
// import Image from 'next/image'
// import styles from "../styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React, { useState, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import moment from "moment";
import Spinner from "react-bootstrap/Spinner";
export default function Home({ data }) {
  const [audit, setAuditData] = useState(null);
  const [pending, setPending] = useState(true);
  const [actionTypeSelect, setActionTypeSelect] = useState("");
  const [applicationTypeSelect, setApplicationTypeSelect] = useState("");

  const actionType = useRef(null);
  const applicationType = useRef(null);
  const selectDate = useRef(null);
  const applicationId = useRef(null);

  useEffect(() => {
    // console.log(data.result.auditLog)

    setAuditData(data.result.auditLog);
    let at = data.result.auditLog
      .map((item) => item.actionType)
      .filter(
        (value, index, self) => value !== null && self.indexOf(value) === index
      );
    let ap = data.result.auditLog
      .map((item) => item.applicationType)
      .filter(
        (value, index, self) => value !== null && self.indexOf(value) === index
      );
    setActionTypeSelect(at);
    setApplicationTypeSelect(ap);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPending(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const columns = [
    {
      name: "Log ID",
      selector: (row) => row.logId,
      sortable: true,
    },
    {
      name: "Application Type",
      sortable: true,
      selector: (row) =>
        row.applicationType != null ? row.applicationType : "-/-",
    },
    {
      name: "Application ID",
      sortable: true,
      selector: (row) =>
        row.applicationId != null ? row.applicationId : "-/-",
    },
    {
      name: "Action",
      sortable: true,
      selector: (row) => row.actionType,
    },
    {
      name: "Action Details",
      sortable: true,
      selector: (row) => "-/-",
    },
    {
      name: "Date:Time",
      sortable: true,
      selector: (row) =>
        moment(row.creationTimestamp).format("YYYY-MM-DD / HH:mm:ss"),
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    let actionT = String(actionType.current.value);
    let applicationT = String(applicationType.current.value);
    let fromD =
      selectDate.current.value !== "" &&
      moment(selectDate.current.value).format("YYYY-MM-DD");
    let applicationID = String(applicationId.current.value);

    // console.log(applicationId.current.value)
    let filterResult = data.result.auditLog.filter((f) => {
      let con1 =
        actionT !== "" && f.actionType !== null && f.actionType.match(actionT);
      let con2 =
        applicationT !== "" &&
        f.applicationType !== null &&
        f.applicationType.match(applicationT);
      let apid =
        applicationID !== "" && f.applicationId !== null
          ? String(f.applicationId)
          : null;
      let con3 = apid !== null && apid.match(applicationID);
      let creationDate = moment(f.creationTimestamp).format("YYYY-MM-DD");
      let con4 = fromD !== "" && creationDate === fromD;
      console.log("date ---", fromD);
      if (con1 || con2 || con3 || con4) {
        return f;
      }

      // return false;
    });
    // if(filterResult.length > 0 ){
    //   setAuditData(filterResult)
    // }else{
    //   setAuditData(data.result.auditLog)
    // }
    setAuditData(filterResult);

    // console.log('filterResult ',filterResult);
  };
  const handleReset = (e) => {
    e.preventDefault();
    setAuditData(data.result.auditLog);
  };
  return (
    <Container fluid>
      <Head>
        <title>Search Logger</title>
        <meta name="description" content="Search Logger" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* filter form */}
      <div className="mx-3 my-5 justify-content-md-center">
        <Card>
          <Card.Body>
            <Row>
              <Col lg="2" md="2" xs="12">
                <Form.Label>Action Type</Form.Label>
                <Form.Select name="actionType" id="actionType" ref={actionType}>
                  <option value="">Select Action Type</option>
                  {actionTypeSelect &&
                    actionTypeSelect.map((value, key) => {
                      return (
                        <option value={value} key={key}>
                          {value}
                        </option>
                      );
                    })}
                </Form.Select>
              </Col>
              <Col lg="2" md="2" xs="12">
                <Form.Label>Application Type</Form.Label>
                <Form.Select
                  name="applicationType"
                  id="applicationType"
                  ref={applicationType}
                >
                  <option value="">Select Application Type</option>
                  {applicationTypeSelect &&
                    applicationTypeSelect.map((value, key) => {
                      return (
                        <option value={value} key={key}>
                          {value}
                        </option>
                      );
                    })}
                </Form.Select>
              </Col>
              <Col lg="2" md="2" xs="12">
                <Form.Label>Select Date</Form.Label>
                <Form.Control
                  type="date"
                  name="selectDate"
                  id="selectDate"
                  // value=""
                  placeholder="Select Date"
                  ref={selectDate}
                  // onChange={handleChange}
                />
              </Col>
              <Col lg="2" md="2" xs="12">
                <Form.Label>Application ID</Form.Label>
                <Form.Control
                  type="text"
                  name="applicationId"
                  id="applicationId"
                  ref={applicationId}
                  // value=""
                  placeholder="12121212"
                  // onChange={handleChange}
                />
              </Col>
              <Col lg="2" md="2" xs="12">
                <div className="d-grid gap-2" style={{ marginTop: "2rem" }}>
                  <Button
                    onClick={handleSubmit}
                    variant="primary"
                    size="md"
                    active
                  >
                    Search Logger
                  </Button>
                </div>
              </Col>
              <Col lg="2" md="2" xs="12">
                <div className="d-grid gap-2" style={{ marginTop: "2rem" }}>
                  <Button
                    onClick={handleReset}
                    variant="secondary"
                    size="md"
                    active
                  >
                    Reset
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
      {/* table */}
      <div className="mx-3 my-5 justify-content-md-center">
        <Card>
          <Card.Body>
            {audit && (
              <DataTable
                columns={columns}
                data={audit}
                pagination
                progressPending={pending}
                progressComponent={<Loader />}
              />
            )}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library

  const res = await fetch(
    "https://run.mocky.io/v3/a2fbc23e-069e-4ba5-954c-cd910986f40f"
  );
  const data = await res.json();
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      data,
    },
  };
}

export function Loader() {
  return (
    <>
      <Spinner animation="grow" />
    </>
  );
}

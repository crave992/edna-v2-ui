import moment from "moment-timezone";
import { Table } from "react-bootstrap";

const Timezone = () => {
  const timezones = moment.tz.names();

  return (
    <>
      <Table striped hover className="custom_design_table mb-0">
        <thead>
          <tr>
            <th>Timezone</th>
          </tr>
        </thead>
        <tbody>
          {timezones.map((timezone) => (
            <tr key={timezone}>
              <td>{timezone}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Timezone;

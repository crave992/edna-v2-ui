import { Table } from "react-bootstrap";
const currencyCodes = require('currency-codes/data');

const CurrencyCodes = () => {
  const currencies = currencyCodes;
  return (
    <>     
      <Table striped hover className="custom_design_table mb-0">
        <thead>
          <tr>
            <th>Code</th>
            <th>Currency</th>
            <th>All</th>
          </tr>
        </thead>
        <tbody>
          {currencies.map((currencie: any) => (
            <tr key={currencie.code}>
              <td>{currencie.code}</td>
              <td>{currencie.currency}</td>
              <td>{JSON.stringify(currencie)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default CurrencyCodes;

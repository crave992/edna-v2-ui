import BankAccountInfo from "../BankAccountInfo";
import EmploymentForm from "../EmploymentForm";
import EmploymentHistory from "../EmploymentHistory";
import StaffReference from "../StaffReference";

const HRForm = () => {
  return (
    <>
      <div className="formBlock">
        <BankAccountInfo />
        <EmploymentForm />
        <EmploymentHistory />
        <StaffReference />
      </div>
    </>
  );
};
export default HRForm;

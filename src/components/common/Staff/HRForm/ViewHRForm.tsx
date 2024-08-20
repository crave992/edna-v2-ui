import { NextPage } from "next";
import ViewBankAccountInfo from "../BankAccountInfo/ViewBankAccountInfo";
import ViewEmploymentForm from "../EmploymentForm/ViewEmploymentForm";
import ViewEmploymentHistory from "../EmploymentHistory/ViewEmploymentHistory";
import ViewStaffReference from "../StaffReference/ViewStaffReference";

interface ViewHRFormProps {
  staffId: number;
}

const ViewHRForm: NextPage<ViewHRFormProps> = ({ staffId }) => {
  return (
    <>
      <div className="formBlock">
        <ViewBankAccountInfo staffId = {staffId} />
        <ViewEmploymentForm staffId = {staffId} />
        <ViewEmploymentHistory staffId = {staffId} />
        <ViewStaffReference staffId = {staffId} />
      </div>
    </>
  );
};
export default ViewHRForm;

import React, { useEffect, useState } from "react";
import { CustomCheckboxNoControl } from "../NewCustomFormControls/CustomCheckbox";
import { useStudentContactQuery } from "@/hooks/queries/useStudentsQuery";

interface AlertShareCheckboxProps {
  studentId: number | undefined;
  checkedEmails: string[];
  isIncident: boolean; // State to hold checked email addresses from ParentComponent
  setCheckedEmails: React.Dispatch<React.SetStateAction<string[]>>; // Function to update checkedEmails in ParentComponent
}

const AlertShareCheckbox: React.FC<AlertShareCheckboxProps> = ({ studentId, checkedEmails, isIncident, setCheckedEmails }) => {
  const [isStandaloneChecked, setIsStandaloneChecked] = useState<boolean>(false);
  const [standaloneEmail, setStandaloneEmail] = useState<string>(''); // State to hold standalone checkbox email
  const { data: studentContacts, isFetching, isError } = useStudentContactQuery({ studentId });

  useEffect (() => {
    if (isIncident) {
      setIsStandaloneChecked(true);
    } else {
      setIsStandaloneChecked(false);
      if (!checkedEmails.includes(standaloneEmail)) {
        setCheckedEmails([standaloneEmail]);
      }
    }
  },[isIncident, checkedEmails, studentId, standaloneEmail])

  const handleCheckboxChange = (isChecked: boolean, email: string) => {
    if (isChecked) {
      setCheckedEmails(prevEmails => [...prevEmails, email]); // Add email to collection in ParentComponent
    } else {
      setCheckedEmails(prevEmails => prevEmails.filter(e => e !== email)); // Remove email from collection in ParentComponent
    }
  };

  const handleStandaloneCheckboxChange = (isChecked: boolean, email: string) => {
    setStandaloneEmail(email); // Update standalone checkbox email state
    if (!checkedEmails.includes(email)) {
      setCheckedEmails(prevEmails => [...prevEmails, email]); // Add email to checkedEmails if not already present
    }
  };  

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (isError || !studentContacts || !studentContacts.userContacts) {
    return <div>No contacts available.</div>;
  }

  const contacts = studentContacts.userContacts;

  if (!contacts || contacts.length === 0) {
    return <div>No contacts available.</div>;
  }

  return (
    <div>
      <div className="tw-text-sm tw-font-medium tw-text-secondary tw-mb-sm">
        Share Report
      </div>
      <div className="tw-flex-row tw-space-y-lg">
        <div>
          {/* Standalone Checkbox */}
          <CustomCheckboxNoControl
            name="standalone-checkbox"
            label="Share with admin"
            containerClass="tw-border tw-border-transparent tw-text-md-medium tw-text-secondary !tw-bg-transparent"
            removeLine={true}
            disabled={!isStandaloneChecked ? true : false}
            value={!isStandaloneChecked ? true : checkedEmails.includes(standaloneEmail)}
            onChange={(isChecked: boolean) => {
              if (!isStandaloneChecked) {
                handleStandaloneCheckboxChange(isChecked, standaloneEmail)
              } else {
                handleCheckboxChange(isChecked, standaloneEmail)
              }
            }}
          />
        </div>
        {contacts.map((userContact: any) => (
          <div key={userContact.contact.id}>
            <CustomCheckboxNoControl
              name={`${userContact.contact.id}`}
              label={`${userContact.contact.firstName} ${userContact.contact.lastName} - ${userContact.relationship}`}
              containerClass="tw-border tw-border-transparent tw-text-md-medium tw-text-secondary !tw-bg-transparent"
              removeLine={true}
              value={checkedEmails.includes(userContact.contact.email)}
              onChange={(isChecked: boolean) => handleCheckboxChange(isChecked, userContact.contact.email)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertShareCheckbox;

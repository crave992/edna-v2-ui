import CheckMarkIcon from '@/components/svg/CheckMarkIcon';
import { OnboardingParentDto } from '@/dtos/OnboardingParentDto';
import { ParentDto } from '@/dtos/ParentDto';
import { StudentDto } from '@/dtos/StudentDto';
import React from 'react';

interface ProgressStep {
  id: number;
  text: string;
  step: number;
}

export interface ProgressProps {
  stepText: ProgressStep[];
  setCurrentStep: (step: number) => void;
  currentStep: number | null;
  data?: OnboardingParentDto | null;
  students?: StudentDto[];
  selectedStudent?: StudentDto;
  setSelectedStudentId: (selectedStudentId: number) => void;
  code?: string;
  parent?: ParentDto | null;
  verified?: boolean;
  setVerified: (verified: boolean) => void;
}

const OnboardingProgress: React.FC<ProgressProps> = ({ stepText, currentStep }) => {
  const totalSteps = stepText && stepText.length;

  const isChecked = (stepId: number) => {
    return currentStep !== null && stepId <= currentStep;
  };

  return (
    <div className="tw-h-[79px] tw-w-full tw-flex tw-item-center tw-justify-between tw-bg-secondary tw-rounded-xl tw-px-4xl tw-py-2xl tw-border tw-border-solid tw-border-secondary">
      {stepText &&
        stepText.length > 0 &&
        stepText.map((step, index) => (
          <div key={step.id} className="">
            <div className="tw-flex tw-flex-col tw-items-center tw-space-y-xs tw-relative">
              <div className="tw-flex tw-items-center tw-justify-center">
                <div
                  className={`tw-ml-[16px] tw-z-[10] tw-w-4 tw-h-4 tw-flex tw-items-center tw-justify-center tw-mr-2 tw-rounded-full tw-border tw-border-solid ${
                    isChecked(step.step) ? 'tw-bg-brand tw-border-brand' : 'tw-border-primary tw-bg-radio-default'
                  }
                  `}
                >
                  {step.step < currentStep! ? (
                    <div className="-tw-mt-[2px] tw-ml-0">
                      <CheckMarkIcon width={10} />
                    </div>
                  ) : (
                    <div className={`tw-w-[6px] tw-h-[6px] tw-rounded-full tw-bg-white`}></div>
                  )}
                </div>
              </div>
              <input
                id={`radio-${step.id}`}
                type="radio"
                value=""
                name={`default-radio-${step.id}`}
                className="tw-hidden"
                checked={isChecked(step.step)}
                readOnly
              />
              <div
                className={` ${
                  isChecked(step.step) ? 'tw-text-brand tw-text-xs-medium' : 'tw-text-quarterary tw-text-xs-regular'
                } `}
              >
                {step.text}
              </div>
              {index !== totalSteps - 1 && (
                <div
                  className={`tw-absolute tw-left-[18px] tw-transform tw-top-[2px] ${
                    isChecked(step.step + 1) ? 'tw-bg-brand' : 'tw-bg-gray-300'
                  } tw-h-[3px] tw-w-[86px]`}
                />
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default OnboardingProgress;

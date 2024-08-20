import cn from '@/utils/cn';
import { HTMLProps, ReactNode } from 'react';

export interface FormErrorProps {
  errorText?: string;
  supportingText?: string;
}

export default function FormError({ errorText, supportingText }: FormErrorProps) {
  return <div></div>;
}

import { NextPage } from 'next';
import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { useEffect, useRef, useState } from 'react';
import useCustomError from '../../hooks/useCustomError';
import CommonProps from '@/models/CommonProps';
import ImageBrand from '@/components/common/ImageBrand';
import { useRouter } from 'next/router';
import { CustomModal } from '../ui/CustomModal';
import Footer from '../ui/Footer';
import NotesSpinner from '../svg/NotesSpinner';
import TermsAndConditionDto from '@/dtos/TermsAndConditionDto';
import { useSession } from 'next-auth/react';
import { AdminRoles, Role } from '@/helpers/Roles';

interface TermsAndConditionsProps extends CommonProps {}

const TermsAndConditions: NextPage<TermsAndConditionsProps> = (props) => {
  const [showLoader, setShowLoader] = useState(false);
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [toc, setToc] = useState<TermsAndConditionDto | null>(null);
  const [canAccept, setCanAccept] = useState<boolean>(false);

  const scrollRef = useRef(null);

  useEffect(() => {
      fetch(`/api/terms-and-conditions/`, {
        method: 'GET'
      }).then(async (result) => {
        if(result.ok){
            const data = await result.json();
            setToc(data);
        }
      });
    }, []);
  
  const handleScroll = () => {
      if (scrollRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
          if (scrollTop + clientHeight >= scrollHeight) {
              setCanAccept(true);
          }
      }
  };
    
  const handleAccept = () => {
    if(!canAccept) return;
    setShowLoader(true);
    fetch(`/api/terms-and-conditions/accept/${toc?.id}`, {
        method: 'POST',
      }).then(async (result) => {
        if(result.ok){
            setShowLoader(false);
            const user = session?.user;
            let redirectUrl = '';
            const roles = (user?.roles || []).map((el) => el.name);
            const isAdmin = AdminRoles.some((role) => roles.includes(role));
            const isParent = roles.includes(Role.Parent);
            const isStaff = roles.includes(Role.Staff);
      
            if (isAdmin) {
                redirectUrl = '/admin/dashboard';
            } else if (isStaff && session?.user?.hasClass) {
                redirectUrl = '/staff/dashboard';
            } else if (isStaff) {
                redirectUrl = `/staff/${session?.user?.staffId}`;
            } else if (isParent) {
                redirectUrl = '/parent/my-profile';
            }

            //update toc field in user serssion
            update({hasAcceptedTermsAndConditions: true});
            
            router.push(redirectUrl);
        }
      }).catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <CustomModal width={800}>
        <CustomModal.Header>
          <div className="tw-space-y-xl">
            <div className="tw-flex tw-items-center tw-justify-center">
              <ImageBrand size={32} />
            </div>
            <div className="tw-space-y-xs tw-text-center">
              <div className="tw-text-lg-semibold tw-text-primary">Accept Terms and Conditions</div>
              <div className="tw-text-sm-regular tw-text-tertiary">
                You must agree to the Terms and Conditions before proceeding.
              </div>
            </div>
          </div>
        </CustomModal.Header>
        <CustomModal.Content>
        <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className='tw-max-h-[450px] tw-overflow-y-scroll custom-thin-scrollbar' dangerouslySetInnerHTML={{ __html: toc ? toc.content : '' }} />
        </CustomModal.Content>
        <div className="tw-pt-4xl tw-px-3xl tw-space-y-lg tw-pb-3xl tw-flex tw-items-center tw-justify-center">
            {
                toc != null ? (
                    <button
                        onClick={handleAccept}
                        type="button"
                        disabled={!canAccept}
                        className={
                            `${ canAccept ? 'tw-bg-fg-success-primary hover:tw-bg-fg-success-primary-hover' : 
                                    'disabled:tw-cursor-not-allowed disabled:tw-bg-gray-400' } 
                            tw-text-md-semibold tw-rounded-md tw-bg-button-primary tw-w-[180px] tw-text-white tw-shadow-xs tw-px-xl tw-py-10px tw-border-0 tw-gap-sm tw-cursor-pointer`}
                            >
                        <span className="tw-px-[5px]">Accept</span>
                        {showLoader && (
                            <NotesSpinner />
                        )}
                    </button>
                ) : (<></>)
            }
        </div>
      </CustomModal>
      <Footer />
    </>
  );
};

export default TermsAndConditions;

import AddEmailTemplate from "@/components/common/EmailTemplate";
import CommonProps from "@/models/CommonProps";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";


interface AddEmailTemplatePageProps extends CommonProps {
    id: number;
}

const AddEmailTemplatePage: NextPage<AddEmailTemplatePageProps> = (props) => {
    return (
        <>
            
            <Head>
                <title>Update Email Template</title>
            </Head>
            <AddEmailTemplate id={props.id}/>
        </>
    );
};

export default AddEmailTemplatePage;

export const getServerSideProps: GetServerSideProps<
    AddEmailTemplatePageProps
> = async (context) => {
    let initialParamas: AddEmailTemplatePageProps = {
        id: +(context.query.id || 0),
    };

    return {
        props: initialParamas,
    };
};

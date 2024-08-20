import Response from "@/dtos/Response";
import TermsAndPolicyDto from "@/dtos/TermsAndPolicyDto";
import { TermsAndPolicyDirectoryCodeOfConductModel, TermsAndPolicyHippaModel, TermsAndPolicyParentRegistrationModel } from "@/models/TermsAndPolicyModel";
import { AxiosResponse } from "axios";

export default interface ITermsAndPolicyService {
    getAll(): Promise<AxiosResponse<Response<TermsAndPolicyDto>>>;
    updateHippa(model: TermsAndPolicyHippaModel): Promise<AxiosResponse<Response<TermsAndPolicyDto>>>;    
    updateParentRegistration(model: TermsAndPolicyParentRegistrationModel): Promise<AxiosResponse<Response<TermsAndPolicyDto>>>;    
    updateDirectoryCodeOfConduct(model: TermsAndPolicyDirectoryCodeOfConductModel): Promise<AxiosResponse<Response<TermsAndPolicyDto>>>;    
}
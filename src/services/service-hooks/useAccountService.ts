import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import IAccountService from "@/services/interfaces/IAccountService";
import { useMutation, useQuery } from "@tanstack/react-query";
import LoginModel from "@/models/LoginModel";
import ForgetPasswordModel from "@/models/ForgetPasswordModel";
import ResetPasswordModel from "@/models/ResetPasswordModel";
import { ChangePasswordModel, NewAccountChangePasswordModel } from "@/models/ChangePasswordModel";
import IUnitOfService from "../interfaces/IUnitOfService";

const useLogin = () => {
    const unitOfService = container.get<IAccountService>(TYPES.IAccountService);

    const mutationFn = async (args: { model: LoginModel }) => {
        const { model } = args;
        return await unitOfService.login(model);
    };

    return useMutation(mutationFn);
};

const useForgotPassword = () => {
    const unitOfService = container.get<IAccountService>(TYPES.IAccountService);

    const mutationFn = async (args: { model: ForgetPasswordModel }) => {
        const { model } = args;
        return await unitOfService.forgotPassword(model);
    };

    return useMutation(mutationFn);
};

const useResetPassword = () => {
    const unitOfService = container.get<IAccountService>(TYPES.IAccountService);

    const mutationFn = async (args: { model: ResetPasswordModel }) => {
        const { model } = args;
        return await unitOfService.resetPassword(model);
    };

    return useMutation(mutationFn);
};

const useChangePassword = () => {
    const unitOfService = container.get<IAccountService>(TYPES.IAccountService);

    const mutationFn = async (args: { model: ChangePasswordModel }) => {
        const { model } = args;
        return await unitOfService.changePassword(model);
    };

    return useMutation(mutationFn);
};

const useNewAccountChangePassword = () => {
    const unitOfService = container.get<IAccountService>(TYPES.IAccountService);

    const mutationFn = async (args: { model: NewAccountChangePasswordModel }) => {
        const { model } = args;
        return await unitOfService.newAccountChangePassword(model);
    };

    return useMutation(mutationFn);
};

const useCheckUserStatus = (enabled: boolean = true) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    return useQuery({
        queryKey: ['checkUserStatus'],
        queryFn: async () => {
            return await unitOfService.AccountService.checkUserStatus();
        },
        enabled: enabled,
        refetchInterval: 120000
    });
};

export {
    useLogin,
    useForgotPassword,
    useResetPassword,
    useChangePassword,
    useNewAccountChangePassword,
    useCheckUserStatus,
};

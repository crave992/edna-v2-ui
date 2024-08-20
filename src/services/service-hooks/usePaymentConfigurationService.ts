import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { PaymentConfigurationModel } from "@/models/PaymentConfigurationModel";
import IUnitOfService from "@/services/interfaces/IUnitOfService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const useGetAllPaymentConfigurations = (q: string, enabled: boolean = true) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    return useQuery({
        queryKey: ['paymentConfigurations', q],
        queryFn: async () => {
            return await unitOfService.PaymentConfigurationService.getAll(q);
        },
        enabled: enabled
    });
};

const useGetAllPaymentGatewayProviders = (enabled: boolean = false) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    return useQuery({
        queryKey: ['paymentGatewayProviders'],
        queryFn: async () => {
            return await unitOfService.PaymentConfigurationService.getAllPaymentGatewayProviders();
        },
        enabled: enabled
    });
};

const useGetPaymentConfigurationById = (id: number, enabled: boolean = false) => {
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    return useQuery({
        queryKey: ['paymentConfiguration', id],
        queryFn: async () => {
            const response = await unitOfService.PaymentConfigurationService.getById(id);
            return response;
        },
        enabled: enabled
    });
};

const useAddPaymentConfiguration = () => {
    const queryClient = useQueryClient();
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    const mutationFn = async (
        args: {
            model: PaymentConfigurationModel
        }
    ) => {
        const { model } = args;
        return await unitOfService.PaymentConfigurationService.add(model);
    };

    return useMutation(mutationFn, {
        onSettled: (response) => {
            if (response && response.status == 201 && response.data.data) {
                queryClient.invalidateQueries({ queryKey: ['paymentConfigurations'] });
            }
        }
    });
};

const useUpdatePaymentConfiguration = () => {
    const queryClient = useQueryClient();
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    const mutationFn = async (
        args: {
            id: number;
            model: PaymentConfigurationModel
        }
    ) => {
        const { id, model } = args;
        return await unitOfService.PaymentConfigurationService.update(id, model);
    };

    return useMutation(mutationFn, {
        onSettled: (response) => {
            if (response && response.status == 200 && response.data.data) {
                queryClient.invalidateQueries({ queryKey: ['paymentConfigurations'] });
            }
        }
    });
};

const useDeletePaymentConfiguration = () => {
    const queryClient = useQueryClient();
    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    return useMutation(unitOfService.PaymentConfigurationService.delete, {
        onSettled: (response) => {
            if (response && response.status == 204) {
                queryClient.invalidateQueries({ queryKey: ['paymentConfigurations'] });
            }
        }
    });
};

export {
    useGetAllPaymentConfigurations,
    useGetAllPaymentGatewayProviders,
    useGetPaymentConfigurationById,
    useAddPaymentConfiguration,
    useUpdatePaymentConfiguration,
    useDeletePaymentConfiguration,
};
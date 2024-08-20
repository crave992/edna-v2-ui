import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryOptions,
    InfiniteQueryObserverResult
} from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';

type QueryKeyT = [string, object | undefined];

export interface GetInfinitePagesInterface<T> {
    nextId?: number;
    previousId?: number;
    data: T;
    count: number;
}

export const fetcher = <T>({
    queryKey,
    pageParam,
}: {
    queryKey: QueryKeyT;
    pageParam: any;
}): Promise<T> => {
    const [url, params] = queryKey as QueryKeyT;

    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    return unitOfService.HttpService.call()
        .get<T>(url, { params: { ...params, pageParam } })
        .then((res) => res.data);
};

export const useLoadMore = <T>(url: string | null, params?: object) => {
    const context: InfiniteQueryObserverResult<GetInfinitePagesInterface<T>, Error> = useInfiniteQuery<
        GetInfinitePagesInterface<T>,
        Error,
        GetInfinitePagesInterface<T>,
        QueryKeyT
    >(
        [url!, params],
        ({ queryKey, pageParam = 1 }) => fetcher({ queryKey, pageParam }),
        {
            getPreviousPageParam: (firstPage) => firstPage.previousId ?? false,
            getNextPageParam: (lastPage) => {
                return lastPage.nextId ?? false;
            },
        }
    );


    return context;
};

export const usePrefetch = <T>(url: string | null, params?: object) => {
    const queryClient = useQueryClient();

    return () => {
        if (!url) {
            return;
        }

        queryClient.prefetchQuery<T, Error, T, QueryKeyT>(
            [url!, params],
            ({ queryKey }) => fetcher({ queryKey, pageParam: undefined })
        );
    };
};

export const useFetch = <T>(
    url: string | null,
    params?: object,
    config?: UseQueryOptions<T, Error, T, QueryKeyT>
) => {
    const context = useQuery<T, Error, T, QueryKeyT>(
        [url!, params],
        ({ queryKey }) => fetcher({ queryKey, pageParam: undefined }),
        {
            enabled: !!url,
            ...config,
        }
    );

    return context;
};

const useGenericMutation = <T, S>(
    func: (data: T | S) => Promise<AxiosResponse<S>>,
    url: string,
    params?: object,
    updater?: ((oldData: T, newData: S) => T) | undefined
) => {
    const queryClient = useQueryClient();

    return useMutation<AxiosResponse, AxiosError, T | S>(func, {
        onMutate: async (data) => {
            await queryClient.cancelQueries([url!, params]);

            const previousData = queryClient.getQueryData([url!, params]);

            queryClient.setQueryData<T>([url!, params], (oldData) => {
                return updater ? updater(oldData!, data as S) : (data as T);
            });

            return previousData;
        },
        onError: (err, _, context) => {
            queryClient.setQueryData([url!, params], context);
        },
        onSettled: () => {
            queryClient.invalidateQueries([url!, params]);
        },
    });
};

export const useDelete = <T>(
    url: string,
    params?: object,
    updater?: (oldData: T, id: string | number) => T
) => {

    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    return useGenericMutation<T, string | number>(
        (id) => unitOfService.HttpService.call().delete(`${url}/${id}`),
        url,
        params,
        updater
    );
};

export const usePost = <T, S>(
    url: string,
    params?: object,
    updater?: (oldData: T, newData: S) => T
) => {

    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    return useGenericMutation<T, S>(
        (data) => unitOfService.HttpService.call().post<S>(url, data),
        url,
        params,
        updater
    );
};

export const useUpdate = <T, S>(
    url: string,
    params?: object,
    updater?: (oldData: T, newData: S) => T
) => {

    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);

    return useGenericMutation<T, S>(
        (data) => unitOfService.HttpService.call().put<S>(url, data),
        url,
        params,
        updater
    );
};
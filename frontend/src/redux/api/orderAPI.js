import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const orderAPI = createApi({
    reducerPath: 'orderAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        getMyOrders: builder.query({
            query() {
                return {
                    url: `/orders/myorders`,
                    method: 'GET',
                    credentials: 'include',
                };
            },
            providesTags: (result, error, _id) => {
                return [{ type: 'Orders', id: 'LIST' }];
            },
            transformResponse: (results) => results,
        }),
        getOrder: builder.query({
            query(id) {
                return {
                    url: `/orders/getOrder/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Orders', id }],
        }),
        getReport: builder.query({
            query() {
                return {
                    url: `/orders/report`,
                    method: 'GET',
                    credentials: 'include',
                };
            },
            providesTags: (result, error, _id) => {
                return [{ type: 'Orders', id: 'LIST' }];
            },
            transformResponse: (results) => results,
        }),
    }),
});

export const {
    useGetMyOrdersQuery,
    useGetOrderQuery,
    useGetReportQuery
} = orderAPI;

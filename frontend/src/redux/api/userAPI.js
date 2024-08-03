import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';
import { removeToken, removeUserData, setUserData } from '../../utils/Utils';
import { logout, setUser } from './userSlice';

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        getUsers: builder.query({
            query(args) {
                return {
                    url: `/users`,
                    params: { ...args },
                    credentials: 'include',
                };
            },
            providesTags: (result) =>
                result?.users
                    ? [
                        ...result.users.map(({ id }) => ({
                            type: 'Users',
                            id,
                        })),
                        { type: 'Users', id: 'LIST' },
                    ]
                    : [{ type: 'Users', id: 'LIST' }],
            transformResponse: (results) =>
                results,
        }),
        updateUser: builder.mutation(
            {
                query(user) {
                    return {
                        url: `/users/update/profile`,
                        method: 'PUT',
                        credentials: 'include',
                        body: user,
                    };
                },
                invalidatesTags: (result, _error, { id }) =>
                    result
                        ? [
                            { type: 'Users', id },
                            { type: 'Users', id: 'LIST' },
                        ]
                        : [{ type: 'Users', id: 'LIST' }],
                transformResponse: (response) =>
                    response,
            }
        ),

        createAdminUser: builder.mutation({
            query(product) {
                return {
                    url: '/users/create',
                    method: 'POST',
                    credentials: 'include',
                    body: product,
                };
            },
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
            transformResponse: (result) =>
                result,
        }),

        updateAdminUser: builder.mutation(
            {
                query({ id, user }) {
                    return {
                        url: `/users/update/user/${id}`,
                        method: 'PUT',
                        credentials: 'include',
                        body: user,
                    };
                },
                invalidatesTags: (result, _error, { id }) =>
                    result
                        ? [
                            { type: 'Users', id },
                            { type: 'Users', id: 'LIST' },
                        ]
                        : [{ type: 'Users', id: 'LIST' }],
                transformResponse: (response) =>
                    response,
            }
        ),

        deleteAdminUser: builder.mutation({
            query(id) {
                return {
                    url: `/users/delete/${id}`,
                    method: 'Delete',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
        }),

        deleteUser: builder.mutation({
            query(id) {
                return {
                    url: `/users/delete/${id}`,
                    method: 'Delete',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    removeToken();
                    removeUserData();
                    dispatch(logout());
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        getUser: builder.query({
            query(id) {
                return {
                    url: `/users/getUser/${id}`,
                    credentials: 'include'
                };
            },
            providesTags: (result, error, id) => {
                return [{ type: 'Users', id }];
            },
            transformResponse(result) {
                return result;
            }
        }),
        uploadProfileImg: builder.mutation({
            query: (avatarFile) => {
                var formData = new FormData();
                formData.append('avatarFile', avatarFile);
                return {
                    url: '/users/upload/avatarFile',
                    method: 'PUT',
                    credentials: 'include',
                    body: formData
                };
            },
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
            transformResponse(result) {
                return result;
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const response = await queryFulfilled;
                    setUserData(JSON.stringify(response.data.updateAvatar));
                    dispatch(setUser(response.data.updateAvatar));
                } catch (error) {
                    console.log(error);
                }
            }
        })

    }),
});

export const {
    useDeleteUserMutation,
    useUpdateUserMutation,
    useUploadProfileImgMutation,
    useGetUsersQuery,
    useDeleteAdminUserMutation,
    useCreateAdminUserMutation,
    useUpdateAdminUserMutation,
    useGetUserQuery,
} = userAPI;

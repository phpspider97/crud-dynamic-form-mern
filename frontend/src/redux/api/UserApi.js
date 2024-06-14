import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react' 

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_BACKEND_URL}/user`, 
        prepareHeaders: (headers, { getState }) => {
            // const token = getState().sessionData.value.token 
            // headers.set('authorization', `Bearer ${token}`) 
            return headers
        }  
    }),
    tagTypes : ['user'],
    endpoints: (builder) => ({
        add: builder.mutation({
            query : (data) => ({
                url:'/',
                method: 'POST',
                body:data
            }),
            invalidatesTags : ['user']
        }),
        edit: builder.mutation({
            query : (parameterData) => { 
                const {dataID,...data} = parameterData
                return { 
                    url:`/${dataID}`,
                    method: 'PUT',
                    body:data
                }
            },
            invalidatesTags : ['user']
        }),
        delete: builder.mutation({
            query : (id) => ({
                url:`/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags : ['user']
        }),
        deleteBulk: builder.mutation({
            query : (data) => ({
                url:`/delete-bulk`,
                method: 'DELETE',
                body:data
            }),
            invalidatesTags : ['user']
        }),
        particular: builder.query({
            query: (id='') => ({
                url:`/${id}`,
                method: 'GET'
            }), 
            invalidatesTags : ['user']
        }),
        list: builder.query({
            query: (name) => ({
                url:'/',
                method: 'GET'
            }),
            providesTags: ['user'],
        }),
    }),
})
 
export const { useAddMutation, useEditMutation, useDeleteMutation, useDeleteBulkMutation, useLazyParticularQuery, useParticularQuery, useLazyListQuery } = userApi
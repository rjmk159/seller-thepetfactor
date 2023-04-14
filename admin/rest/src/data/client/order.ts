import {
  Order,
  CreateOrderInput,
  OrderQueryOptions,
  OrderPaginator,
  QueryOptions,
  InvoiceTranslatedText,
  GenerateInvoiceDownloadUrlInput,
} from '@/types';
import { API_ENDPOINTS, API_ENDPOINTS_V2 } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';
import { HttpClientV2 } from './http-client-v2';

export const orderClient = {
  ...crudFactory<Order, QueryOptions, CreateOrderInput>(API_ENDPOINTS.ORDERS),
  get: ({ id, language }: { id: string; language: string }) => {
    return HttpClient.get<Order>(`${API_ENDPOINTS.ORDERS}/${id}`, {
      language,
    });
  },
  paginated: ({ tracking_number, ...params }: Partial<OrderQueryOptions>) => {
    return HttpClient.get<OrderPaginator>(API_ENDPOINTS.ORDERS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ tracking_number }),
    });
  },
  downloadInvoice: (input: GenerateInvoiceDownloadUrlInput) => {
    return HttpClient.post<string>(
      `${API_ENDPOINTS.ORDER_INVOICE_DOWNLOAD}`,
      input
    );
  },
  getOrders(variables: any) {
    console.log(variables);
    return HttpClientV2.get<any>(`${API_ENDPOINTS_V2.STORE_ORDERS}${variables.id}`);
  },

};

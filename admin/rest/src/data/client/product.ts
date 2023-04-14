import {
  Product,
  CreateProduct,
  ProductPaginator,
  QueryOptions,
  GetParams,
  ProductQueryOptions,
  StoreInput,
  ProductInput,
} from '@/types';
import { API_ENDPOINTS, API_ENDPOINTS_V2 } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';
import { HttpClientV2 } from './http-client-v2';

export const productClient = {
  ...crudFactory<Product, QueryOptions, CreateProduct>(API_ENDPOINTS.PRODUCTS),
  get({ slug, language }: GetParams) {
    return HttpClient.get<Product>(`${API_ENDPOINTS.PRODUCTS}/${slug}`, {
      language,
      with: 'type;shop;categories;tags;variations.attribute.values;variation_options;author;manufacturer;digital_file',
    });
  },
  paginated: ({
    type,
    name,
    categories,
    shop_id,
    ...params
  }: Partial<ProductQueryOptions>) => {
    return HttpClient.get<ProductPaginator>(API_ENDPOINTS.PRODUCTS, {
      searchJoin: 'and',
      with: 'shop;type',
      ...params,
      search: HttpClient.formatSearchParams({
        type,
        name,
        categories,
        shop_id,
      }),
    });
  },
  popular({ shop_id, ...params }: Partial<ProductQueryOptions>) {
    return HttpClient.get<Product[]>(API_ENDPOINTS.POPULAR_PRODUCTS, {
      searchJoin: 'and',
      with: 'type;shop',
      ...params,
      search: HttpClient.formatSearchParams({ shop_id }),
    });
  },
  getProducts(variables: ProductInput) {
    console.log(variables);
    return HttpClientV2.post<any>(API_ENDPOINTS_V2.PRODUCTS, variables);
  },
};

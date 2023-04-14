import { useQuery } from 'react-query';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { API_ENDPOINTS, API_ENDPOINTS_V2 } from '@/data/client/api-endpoints';
import { mapPaginatorData } from '@/utils/data-mappers';
import {
  OrderQueryOptions,
  OrderPaginator,
  Order,
  InvoiceTranslatedText,
  CreateOrderInput,
} from '@/types';
import { orderClient } from './client/order';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';

export const useOrdersQuery = (
  params: Partial<OrderQueryOptions>,
  options: any = {}
) => {
  const { data, error, isLoading } = useQuseuseuery<any>(
    [API_ENDPOINTS_V2.STORE_ORDERS, params]
  );
  return {
    orders: data?.data ?? [],
    error,
    loading: isLoading,
  };
};
export const useAllOrdersQuery = () => {
  return useMutation(orderClient.getOrders);
};


// export const useCreateOrderMutation = () => {
//   return useMutation(orderClient.create);
// };

export function useCreateOrderMutation() {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation();

  const { mutate: createOrder, isLoading } = useMutation(orderClient.create, {
    onSuccess: (data: any) => {
      if (data?.id) {
        router.push(`${Routes.order.list}/${data?.id}`);
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};
      toast.error(data?.message);
    },
  });

  function formatOrderInput(input: CreateOrderInput) {
    const formattedInputs = {
      ...input,
      language: locale,
      // TODO: Make it for Graphql too
      invoice_translated_text: {
        subtotal: t('order-sub-total'),
        discount: t('order-discount'),
        tax: t('order-tax'),
        delivery_fee: t('order-delivery-fee'),
        total: t('order-total'),
        products: t('text-products'),
        quantity: t('text-quantity'),
        invoice_no: t('text-invoice-no'),
        date: t('text-date'),
      },
    };
    createOrder(formattedInputs);
  }

  return {
    createOrder: formatOrderInput,
    isLoading,
  };
}

export const useUpdateOrderMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(orderClient.update, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ORDERS);
    },
  });
};

export const useDownloadInvoiceMutation = (
  { order_id, isRTL, language }: { order_id: string, isRTL: boolean, language: string },
  options: any = {}
) => {
  const { t } = useTranslation();
  const formattedInput = {
    order_id,
    is_rtl: isRTL,
    language,
    translated_text: {
      subtotal: t('order-sub-total'),
      discount: t('order-discount'),
      tax: t('order-tax'),
      delivery_fee: t('order-delivery-fee'),
      total: t('order-total'),
      products: t('text-products'),
      quantity: t('text-quantity'),
      invoice_no: t('text-invoice-no'),
      date: t('text-date'),
    },
  };

  return useQuery<string, Error>(
    [API_ENDPOINTS.ORDER_INVOICE_DOWNLOAD],
    () => orderClient.downloadInvoice(formattedInput),
    {
      ...options,
    }
  );
};

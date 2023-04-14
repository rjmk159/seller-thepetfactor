import Pagination from '@/components/ui/pagination';
import dayjs from 'dayjs';
import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import usePrice from '@/utils/use-price';
import { formatAddress } from '@/utils/format-address';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { SortOrder, UserAddress } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Order, MappedPaginatorInfo } from '@/types';
import { useRouter } from 'next/router';
import StatusColor from '@/components/order/status-color';
import Badge from '@/components/ui/badge/badge';

type IProps = {
  orders: Order[] | undefined;
    // paginatorInfo: MappedPaginatorInfo | null;
    // onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const OrderList = ({ orders, onSort, onOrder }: IProps) => {
  // const { data, paginatorInfo } = orders! ?? {};
  const router = useRouter();
  const { t } = useTranslation();
  const rowExpandable = (record: any) => record.children?.length;
  const { alignLeft } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: t('table:table-item-tracking-number'),
      dataIndex: '_id',
      key: '_id',
      align: alignLeft,
      width: 230,
    },
    {
      title: 'Discount',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
      align: alignLeft,
      render: function Render(value: any) {
        const discountAmount = value ? value : 0;
        const { price } = usePrice({
          amount: discountAmount,
        });
        return <span>{price}</span>;
      },
    },

    {
      title: t('table:table-item-delivery-fee'),
      dataIndex: 'deliveryFee',
      key: 'deliveryFee',
      align: alignLeft,
      render: function Render(value: any) {
        const deliveryFee = value ? value : 0;
        const { price } = usePrice({
          amount: deliveryFee,
        });
        return <span>{price}</span>;
      },
    },
    // {
    //   title: 'Total',
    //   dataIndex: 'totalAmount',
    //   key: 'totalAmount',
    //   align: 'center',
    //   width: 120,
    //   render: function Render(value: any) {
    //     const totalAmount = value ? value : 0;
    //     const { price } = usePrice({
    //       amount: totalAmount,
    //     });
    //     return <span>{price}</span>;
    //   },
    // },
    {
      title: (
        <TitleWithSort
          title={"G. Total"}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'grandTotal'
          }
          isActive={sortingObj.column === 'grandTotal'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      align: alignLeft,
      width: 120,
      onHeaderCell: () => onHeaderClick('grandTotal'),
      render: function Render(value: any) {
        const { price } = usePrice({
          amount: value,
        });
        return <span className="whitespace-nowrap">{price}</span>;
      },
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-order-date')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'created_at'
          }
          isActive={sortingObj.column === 'created_at'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'created_at',
      key: 'created_at',
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('created_at'),
      render: (date: string) => {
        dayjs.extend(relativeTime);
        dayjs.extend(utc);
        dayjs.extend(timezone);
        return (
          <span className="whitespace-nowrap">
            {dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()}
          </span>
        );
      },
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      key: 'status',
      align: alignLeft,
      render: (order_status: string) => (
        <Badge text={t(order_status)} color={StatusColor(order_status)} />
      ),
    },
    // {
    //   title: t('table:table-item-shipping-address'),
    //   dataIndex: 'shipping_address',
    //   key: 'shipping_address',
    //   align: alignLeft,
    //   render: (shipping_address: UserAddress) => (
    //     <div>{formatAddress(shipping_address)}</div>
    //   ),
    // },
    {
      title: t('table:table-item-actions'),
      dataIndex: '_id',
      key: 'actions',
      align: 'center',
      width: 100,
      render: (_id: string, order: Order) => {
        return (
          <ActionButtons
            id={_id}
            detailsUrl={`${router.asPath}/${_id}`}
            customLocale={order.language}
          />
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={orders}
          rowKey="id"
          scroll={{ x: 700 }}
          expandable={{
            expandedRowRender: () => '',
            rowExpandable: rowExpandable,
          }}
        />
      </div>

      {/* {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo?.total}
            current={paginatorInfo?.currentPage}
            pageSize={paginatorInfo?.perPage}
            onChange={onPagination}
          />
        </div>
      )} */}
    </>
  );
};

export default OrderList;

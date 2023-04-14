import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useMeQuery } from '@/data/user';
import ShopCard from '@/components/shop/shop-card';
import NoShopSvg from '../../../public/no-shop.svg';
import { getAuthCredentials, getCurrentStore } from '@/utils/auth-utils';
import { useEffect, useState } from 'react';
import { useStoreQuery } from '@/data/shop';
import { useUI } from '@/contexts/ui.context';
import { useStore } from '@/contexts/storeConfig.context';

export default function OwnerDashboard() {
  const { t } = useTranslation();

  const { mutate, data, isLoading, isError: error } = useStoreQuery();
  const storeDetails = getCurrentStore();
  const [selected, setSelected] = useState(storeDetails?.storeDetails)

  const {setCurrentStore} =  useStore();
  const onSelect = (obj:any) => {
    setSelected(obj);
    setCurrentStore(obj)
  }
  useEffect(() => {
    mutate({ sellerId: getAuthCredentials()?.userId });
  }, []);


  if (isLoading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={'error.message'} />;
  return (
    <>
      <div className="mb-5 border-b border-dashed border-border-base pb-8 sm:mb-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('common:sidebar-nav-item-my-shops')}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 3xl:grid-cols-5">
        {data?.data?.map((myShop: any, idx: number) => (
          <ShopCard
            shop={myShop}
            key={idx}
            onSelect={onSelect}
            selected={selected?._id === myShop._id}
          />
        ))}
      </div>

      {!data?.data && !data?.data?.length ? (
        <div className="flex w-full flex-col items-center p-10">
          <div className="relative h-[180px] w-[300px] sm:h-[370px] sm:w-[490px]">
            <Image
              alt={t('common:text-image')}
              src={NoShopSvg}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <span className="mt-6 text-center text-lg font-semibold text-body-dark sm:mt-10">
            {t('common:text-no-shop')}
          </span>
        </div>
      ) : null}
      {!!data?.managed_shop ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5">
          <ShopCard shop={data?.managed_shop} />
        </div>
      ) : null}
    </>
  );
}

import Image from 'next/image';
import { CheckMarkFill } from '@/components/icons/checkmark-circle-fill';
import { CloseFillIcon } from '@/components/icons/close-fill';
import { useTranslation } from 'next-i18next';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import Loader from '@/components/ui/loader/loader';
import { useMeQuery } from '@/data/user';
import { getAuthCredentials } from '@/utils/auth-utils';
import { useEffect } from 'react';

const UserDetails: React.FC = () => {
  const { t } = useTranslation('common');

  const { mutate, data, isLoading: loading, isError: error } = useMeQuery();


  useEffect(() => {
    const userId = getAuthCredentials()?.userId;
    mutate({ userId });
  }, []);
  if (loading) return <Loader text={t('text-loading')} />;
  console.log(data);
  return (
    <div className="flex h-full flex-col items-center p-5">
      <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-gray-200">
        <Image
          src={data?.data?.images[0] ?? '/avatar-placeholder.svg'}
          layout="fill"
          alt={data?.data?.fullName}
        />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-heading">
        {data?.data?.fullName}
      </h3>
      <p className="mt-1 text-sm text-muted">{data?.data?.email}</p>
      {!data?.data?._id ? (
        <p className="mt-0.5 text-sm text-muted">
          {t('text-add-your')}{' '}
          <Link href={Routes.profileUpdate} className="text-accent underline">
            {t('authorized-nav-item-profile')}
          </Link>
        </p>
      ) : (
        <>
          <p className="mt-0.5 text-sm text-muted">{data?.data?.phone}</p>
        </>
      )}
      <div className="mt-6 flex items-center justify-center rounded border border-gray-200 py-2 px-3 text-sm text-body-dark">
        {data?.data?._id ? (
          <CheckMarkFill width={16} className="text-accent me-2" />
        ) : (
          <CloseFillIcon width={16} className="text-red-500 me-2" />
        )}
        {data?.data?._id ? 'Enabled' : 'Disabled'}
      </div>
    </div>
  );
};
export default UserDetails;

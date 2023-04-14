import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import Link from '@/components/ui/link';
import Badge from '@/components/ui/badge/badge';
import {
  getAuthCredentials,
  setAuthCredentials,
  setStoreDetails,
} from '@/utils/auth-utils';
import classNames from 'classnames';

type ShopCardProps = {
  shop: any;
  selected: boolean;
  onSelect: any;
};

const ShopCard: React.FC<ShopCardProps> = ({ shop, selected, onSelect }) => {
  const { t } = useTranslation();

  const isNew = false;

  const handleOnClick = () => {
    setStoreDetails(shop);
    onSelect(shop);
  };

  return (
    <div role="button" onClick={handleOnClick}>
      <div
        className={classNames(
          'relative flex cursor-pointer items-center rounded border  bg-light p-5',
          { 'border-accent': selected },
          { 'border-gray-200': !selected }
        )}
      >
        {isNew && (
          <span className="absolute top-2 rounded bg-blue-500 px-2 py-1 text-xs text-light end-2">
            {t('common:text-new')}
          </span>
        )}
        <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-gray-300">
          <Image
            alt={t('common:text-logo')}
            src={shop?.images?.[0]! ?? '/product-placeholder-borderless.svg'}
            layout="fill"
            objectFit="cover"
          />
        </div>

        <div className="flex flex-col ms-4">
          <span className="mb-2 text-lg font-semibold capitalize text-heading">
            {shop?.storeName}
          </span>
          <span>
            <Badge
              textKey={
                shop?.status ? 'common:text-active' : 'common:text-inactive'
              }
              color={shop?.status ? 'bg-accent' : 'bg-red-500'}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;

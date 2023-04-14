import cn from 'classnames';
import { Fragment, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Avatar from '@/components/common/avatar';
import Link from '@/components/ui/link';
import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import { useMeQuery } from '@/data/user';
import { getAuthCredentials } from '@/utils/auth-utils';

export default function AuthorizedMenu() {
  const { mutate, data, isLoading: loading, isError: error } = useMeQuery();


  useEffect(() => {
    const userId = getAuthCredentials()?.userId;
    mutate({ userId });
  }, []);
  const { t } = useTranslation('common');
  console.log(data)
  // Again, we're using framer-motion for the transition effect
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center focus:outline-none">
        <Avatar
          src={
            data?.images?.length ? data?.images: data?.data?.profile ??
            siteSettings?.avatar?.placeholder
          }
          alt="avatar"
        />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          as="ul"
          className="end-0 origin-top-end absolute mt-1 w-48 rounded bg-white shadow-md focus:outline-none"
        >
          <Menu.Item key={data?.data?.email}>
            <li
              className="flex w-full flex-col space-y-1 rounded-t
             bg-[#e75c25] px-4 py-3 text-sm text-white"
            >
              <span className="font-semibold capitalize">{data?.data?.fullName}</span>
              <span className="text-xs">{data?.data?.email}</span>
            </li>
          </Menu.Item>

          {siteSettings.authorizedLinks.map(({ href, labelTransKey }) => (
            <Menu.Item key={`${href}${labelTransKey}`}>
              {({ active }) => (
                <li className="cursor-pointer border-b border-gray-100 last:border-0">
                  <Link
                    href={href}
                    className={cn(
                      'block px-4 py-3 text-sm font-semibold capitalize transition duration-200 hover:text-accent',
                      active ? 'text-accent' : 'text-heading'
                    )}
                  >
                    {t(labelTransKey)}
                  </Link>
                </li>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

import Logo from '@/components/ui/logo';
import { useUI } from '@/contexts/ui.context';
import AuthorizedMenu from './authorized-menu';
import LinkButton from '@/components/ui/link-button';
import { NavbarIcon } from '@/components/icons/navbar-icon';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { useSettings } from '@/contexts/settings.context';
import {
  adminAndOwnerOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import LanguageSwitcher from './language-switer';
import { Config } from '@/config';
import { useStore } from '@/contexts/storeConfig.context';
import Link from 'next/link';

const Navbar = () => {
  const { t } = useTranslation();
  const { toggleSidebar } = useUI();
  const { currentStore } = useStore();
  const { permissions } = getAuthCredentials();

  const { enableMultiLang } = Config;

  return (
    <header className="fixed z-40 w-full bg-white shadow">
      <nav className="flex items-center justify-between px-5 py-4 md:px-8">
        {/* <!-- Mobile menu button --> */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={toggleSidebar}
          className="flex h-full items-center justify-center p-2 focus:text-accent focus:outline-none lg:hidden"
        >
          <NavbarIcon />
        </motion.button>

        <div className="hidden ms-5 me-auto md:flex">
          <Logo />
        </div>

        <div className="flex items-center space-s-8 current-store ml-20 hidden text-sm font-semibold capitalize text-heading md:flex"
>
          <Link
            href={Routes.adminMyShops}
          >
            {currentStore?.storeName}
          </Link>
          {hasAccess(adminAndOwnerOnly, permissions) && (
            <LinkButton
              href={Routes.shop.create}
              className="ms-4 md:ms-6"
              size="small"
            >
              {t('common:text-create-shop')}
            </LinkButton>
          )}
          {enableMultiLang ? <LanguageSwitcher /> : null}
          <AuthorizedMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

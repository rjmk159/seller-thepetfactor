import { SELLER, SUPER_ADMIN } from '@/utils/constants';
import dynamic from 'next/dynamic';

const AdminLayout = dynamic(() => import('@/components/layouts/admin'));
const OwnerLayout = dynamic(() => import('@/components/layouts/owner'));

export default function AppLayout({
  userPermissions,
  ...props
}: {
  userPermissions: string[];
}) {
  if (userPermissions?.includes(SELLER)) {
    return <AdminLayout {...props} />;
  }
  return <OwnerLayout {...props} />;
}

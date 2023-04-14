import Cookie from 'js-cookie';
import SSRCookie from 'cookie';
import {
  AUTH_CRED,
  PERMISSIONS,
  SELLER,
  STAFF,
  STORE_OWNER,
  SUPAW_CURRENT_STORE,
  SUPER_ADMIN,
  TOKEN,
} from './constants';

export const allowedRoles = [SUPER_ADMIN, STORE_OWNER, STAFF, SELLER];
export const adminAndOwnerOnly = [SUPER_ADMIN, STORE_OWNER, SELLER];
export const adminOwnerAndStaffOnly = [SUPER_ADMIN, STORE_OWNER, STAFF];
export const adminOnly = [SELLER];
export const sellerOnly = [SELLER];
export const ownerOnly = [STORE_OWNER];

export function setAuthCredentials(token: string, permissions: any, userId: string) {
  Cookie.set(AUTH_CRED, JSON.stringify({ token, permissions, userId }));
}
export function setStoreDetails(storeDetails: any) {
  Cookie.set(SUPAW_CURRENT_STORE, JSON.stringify({ storeDetails }));
}

export function getAuthCredentials(context?: any): {
  token: string | null;
  permissions: string[] | null;
  userId: string | null;
} {
  let authCred;
  if (context) {
    authCred = parseSSRCookie(context)[AUTH_CRED];
  } else {
    authCred = Cookie.get(AUTH_CRED);
  }

  if (authCred) {
    return JSON.parse(authCred);
  }
  return { token: null, permissions: null, userId: null };
}

export function getCurrentStore() {
  let storeDetails;
  const _details = Cookie.get(SUPAW_CURRENT_STORE);
  console.log('text-create-shop', _details)
  if (_details) {
    storeDetails = JSON.parse(_details);
    return storeDetails
  } else {
    return storeDetails;
  }
}

export function parseSSRCookie(context: any) {
  return SSRCookie.parse(context.req.headers.cookie ?? '');
}

export function hasAccess(
  _allowedRoles: string[],
  _userPermissions: string[] | undefined | null
) {
  if (_userPermissions) {
    return Boolean(
      _allowedRoles?.find((aRole) => _userPermissions.includes(aRole))
    );
  }
  return false;
}
export function isAuthenticated(_cookies: any) {
  return (
    !!_cookies[TOKEN] &&
    Array.isArray(_cookies[PERMISSIONS]) &&
    !!_cookies[PERMISSIONS].length
  );
}

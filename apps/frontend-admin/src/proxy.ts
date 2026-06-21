import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTE_PERMISSIONS } from './config/roles';

const publicRoutes = ['/login'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('access_token')?.value;

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search);
    
    return NextResponse.redirect(loginUrl);
  }

  const isPrivateRoute = !publicRoutes.some(route => pathname.startsWith(route));
  if (isPrivateRoute) {
    const userInfoCookie = request.cookies.get('user_info')?.value;
    if (userInfoCookie) {
      try {
        const userInfo = JSON.parse(userInfoCookie);
        const userPermissions = userInfo?.permissions || [];

        if (Array.isArray(userPermissions)) {
          const sortedRoutes = [...ROUTE_PERMISSIONS].sort((a, b) => b.path.length - a.path.length);
          const matchingRoute = sortedRoutes.find(route => pathname === route.path || pathname.startsWith(`${route.path}/`));

          if (matchingRoute && matchingRoute.permissions && matchingRoute.permissions.length > 0) {
            const hasPermission = matchingRoute.permissions.some(permission => userPermissions.includes(permission));
            
            if (!hasPermission) {
               if (pathname !== '/dashboard') {
                 return NextResponse.redirect(new URL('/dashboard', request.url));
               }
            }
          }
        }
      } catch (e) {
        console.error("Error parsing user_info cookie", e);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
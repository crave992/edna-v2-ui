import { AdminRoles, AllRoles, Role, StaffRoles, SuperAdminRoles } from './helpers/Roles';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import RoleDto from './dtos/RoleDto';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const pageUrl = req.nextUrl.pathname.toLowerCase();
    const rolesObject = (req.nextauth.token?.roles || []) as RoleDto[];
    const roles = rolesObject.map((el) => el.name);
    const hasClass = req.nextauth.token?.hasClass;
    const classAssignmentIds = req.nextauth.token?.classAssignmentIds;

    if (pageUrl !== '/admin/dashboard') {
      if (pageUrl.startsWith('/superadmin') && roles.indexOf(Role.NooranaAdmin) < 0) {
        return NextResponse.redirect(new URL('/account/access-denied', req.url));
      } else if(pageUrl.startsWith('/focus')){
        if(roles.includes(Role.Staff)){
          if(!hasClass) return NextResponse.redirect(new URL('/account/access-denied', req.url));
        } else if(!AdminRoles.some( role => roles.includes(role))){
          return NextResponse.redirect(new URL('/account/access-denied', req.url));
        }
      } else if (pageUrl.startsWith('/directory')) {
        if(pageUrl.startsWith('/directory/staff')){
            var pageUrlItems = pageUrl.split("/");
            if(pageUrlItems.length > 3){ //we have an id
              if((!AllRoles.some(saRole => roles.includes(saRole))) && pageUrlItems[3] != req.nextauth?.token?.staffId){
                return NextResponse.redirect(new URL('/account/access-denied', req.url));
              }
            } else {
              if(!AllRoles.some( role => roles.includes(role))){
                return NextResponse.redirect(new URL('/account/access-denied', req.url));
               }
            }
        } else if(pageUrl.startsWith('/directory/class')){
          if(!AdminRoles.some( role => roles.includes(role))){
            return NextResponse.redirect(new URL('/account/access-denied', req.url));
          }
        } else {
          if(!StaffRoles.some( role => roles.includes(role))){
            return NextResponse.redirect(new URL('/account/access-denied', req.url));
          }
        }
      } else if (pageUrl.startsWith('/staff')) {
        var pageUrlItems = pageUrl.split("/");
        if(!StaffRoles.some( role => roles.includes(role))) {
          return NextResponse.redirect(new URL('/account/access-denied', req.url));
        } else if(pageUrlItems.length > 2 && pageUrlItems[2] != 'dashboard'){
          if(!SuperAdminRoles.some(saRole => roles.includes(saRole)) && pageUrlItems[2] != req.nextauth?.token?.staffId){
            return NextResponse.redirect(new URL('/account/access-denied', req.url));
          }
        }
      } else if (pageUrl.startsWith('/parent/') && roles.indexOf(Role.Parent) < 0 && !StaffRoles.some( role => roles.includes(role))) {
        return NextResponse.redirect(new URL('/account/access-denied', req.url));
      } else if (pageUrl.startsWith('/students/') && !AllRoles.some( role => roles.includes(role))) {
        return NextResponse.redirect(new URL('/account/access-denied', req.url));
      }
    } 
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/superadmin/:path*',
    '/admin/:path*',
    '/directory/:path*',
    '/staff/:path*',
    '/focus/:path*',
    '/parent/:path*',
    '/students/:path*',
    '/invoice/:path*',
    '/account/my-profile',
    '/account/change-password',
    '/account/new/change-password',
  ],
};

import { getSession } from 'next-auth/react';

export default async function IsAdmin() {

  return true;  // try {
  //   const session = await getSession();

  //   if (!session) {
  //     throw new Error('User is not authenticated');
  //   }

  //   const userRole = session.user?.user_role_id;
  //   console.log("User role is ", userRole);
  //   if (userRole === 'rki_admin') {
  //     console.log("user is  admin")
  //     return true;
  //   } else {
  //     console.log("user is not admin")
  //     return true;
  //   }
  // } catch (error) {
  //   console.log('andd error occueed')
  //   return true;
  // }
}

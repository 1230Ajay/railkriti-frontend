import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import router from 'next/router';

const AutoLogout = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      // Calculate the remaining time before the session expires
      const sessionExpirationTime = new Date(session.expires).getTime();
      const currentTime = Date.now();
      const timeRemaining = sessionExpirationTime - currentTime;

      // Set a timeout to log out the user when the session expires
      const timer = setTimeout(async () => {
        const isSignedOut = await signOut({ redirect: false });
        if (isSignedOut) {
          router.push('/sign-in');
        }// Redirect to sign-in page after logout
      }, timeRemaining);

      // Clear the timer if the component unmounts or if the session changes
      return () => clearTimeout(timer);
    }
  }, [session]);

  return null;
};

export default AutoLogout;

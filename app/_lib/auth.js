import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { createGuest, getGuest } from './data-service';

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    })
  ],
  callbacks: {
    authorized({ auth, req }) {
      return !!auth?.user;
    },
    // chạy trc khi quá trình signup diễn ra
    async signIn({ user, account, profile }) {
      try {
        const existingGuest = await getGuest(user.email);

        if (!existingGuest)
          await createGuest({ email: user.email, fullName: user.name });

        return true;
      } catch (error) {
        return false;
      }
    },
    // chạy sau func signIn ở trên và mỗi lần session checked out
    async session({ session, user }) {
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id;
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut
} = NextAuth(authConfig);

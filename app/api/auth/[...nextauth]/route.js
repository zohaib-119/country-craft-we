import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/dbConnect';
import * as Sentry from "@sentry/nextjs";


// Define authOptions
export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async session({ session }) {

            const client = await dbConnect();

            const { data: sessionUser } = await client
                .from('buyers')
                .select('*')
                .eq('email', session.user.email)
                .single();

            if (sessionUser) {
                session.user.id = sessionUser.id.toString(); // Add user ID to the session
            }

            return session;
        },
        async signIn({ profile }) {
            try {
                console.log('Profile received from provider: ', profile);
                console.log('Checking profile in Supabase...');

                const supabase = await dbConnect();

                const { data: userExists } = await supabase
                    .from('buyers')
                    .select('*')
                    .eq('email', profile.email)
                    .single();

                if (!userExists) {
                    console.log('User does not exist in database. Creating new user...');
                    const { data, error } = await supabase.from('buyers').insert({
                        email: profile.email,
                        name: profile.name,
                        profile_pic: profile.picture,
                    });

                    if (error) {
                        console.log(error);
                        return false;
                    }
                }

                return true;
            } catch (error) {
                console.log(error);
                Sentry.captureException(error);
                return false;
            }
        },
    },
};

// Pass authOptions to NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

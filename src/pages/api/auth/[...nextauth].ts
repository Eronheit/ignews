import NextAuth from "next-auth"
import Provider from "next-auth/providers"
import { query as q } from 'faunadb';

import { fauna } from '../../../services/fauna';

export default NextAuth({
  providers: [
    Provider.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    }),
  ],
  jwt: {
    signingKey: process.env.SIGNIN_KEY
  },
  callbacks: {
    async signIn(user, account, profile) {
      const { email } = user;
      
      try {
        await fauna.query(
          q.Create(
            q.Collection('users'), 
            { data: { email } }
          )
        )

        return true;
      } catch (err) {
        return false
      }
    }
  }
})

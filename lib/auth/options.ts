import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// Temporary hardcoded admin user (will be replaced with database)
const ADMIN_USER = {
    id: '1',
    email: 'admin@lifestyle-villas.com',
    name: 'Admin User',
    // Password: "admin123" (hashed)
    passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyWUI88K3PSi',
    role: 'admin'
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                // Check if user exists (hardcoded for now)
                if (credentials.email !== ADMIN_USER.email) {
                    return null
                }

                // Verify password
                const isValidPassword = await bcrypt.compare(
                    credentials.password,
                    ADMIN_USER.passwordHash
                )

                if (!isValidPassword) {
                    return null
                }

                // Return user object
                return {
                    id: ADMIN_USER.id,
                    email: ADMIN_USER.email,
                    name: ADMIN_USER.name,
                    role: ADMIN_USER.role
                }
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string
            }
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
}

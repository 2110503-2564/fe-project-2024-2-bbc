// types/next-auth.d.ts
import "next-auth";

// Extending the NextAuth Session type
declare module "next-auth" {
  interface Session {
    user: {
      success: boolean;
      message: string;
      role: string;
      account: {
        _id: string;
        first_name: string;
        last_name: string;
        tel: string;
        email: string;
        password: string;
        role: string;
        create_at: string;
        __v: number;
        hotel_id: string | null;
        id: string;
      };
      token: string;
      iat: number;
      exp: number;
      jti: string;
    };
  }
}

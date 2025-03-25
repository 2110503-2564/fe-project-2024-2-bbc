/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains:['drive.google.com'],
    },
    experimental:{
        serverActions:true,
    },
    env:{
        FRONTEND_URL:process.env.FRONTEND_URL,
        NEXT_PUBLIC_BACKEND_URL:process.env.NEXT_PUBLIC_BACKEND_URL
        
    }
};

export default nextConfig;

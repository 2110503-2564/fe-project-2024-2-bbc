import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import Logo from "./Logo";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function TopMenu() {
  
  const session = await getServerSession(authOptions);
  console.log(session)

  return (

    <div className="h-[70px] bg-slate-50 fixed top-0 left-0 right-0 z-50  flex justify-end">
       <div className="m-5 flex items-center absolute left-0 h-full text-center mt-auto mb-auto font-san text-xs text-gray-600 font-extrabold gap-5">
            {
                session?<Link href={"/api/auth/signout"}>
                    <div className="hover:text-blue-500">
                        Sign-Out
                    </div>
                </Link>
                :<Link href={"/api/auth/signin"}>
                    <div className="hover:text-blue-500">
                        Sign-In
                    </div>
                </Link>
            }   
            {/* <TopMenuItem title="My Booking" pageRef="/mybooking/"/> */}
            <TopMenuItem title="Register" pageRef="/register/"/>
        </div>
      <TopMenuItem title="Booking" pageRef="/hotel" />
      <Logo />
    </div>
  );
}

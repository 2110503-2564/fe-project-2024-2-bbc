import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Banner from "./components/Banner";
import RecommendList from "./components/RecommendList";
import FloatButton from "./components/FloatButton";

export default async function Home() {
    const session = await getServerSession(authOptions);

    return (
        <main className="min-h-screen bg-slate-50" style={{ paddingBottom: "30px" }}>
            <Banner session={session} />
            <hr className="my-6 border-t-2 border-gray-300" style={{ paddingBlock: "7px" }} />
            <RecommendList />
            <FloatButton />
        </main>
    );
}

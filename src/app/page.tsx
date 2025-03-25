
import Image from "next/image";
import styles from "./page.module.css";
import Banner from "./components/Banner";
import RecommendList from "./components/RecommendList";
import FloatButton from "./components/FloatButton";

export default function Home() {
  return (
    <main className="min-h-screen" style={{paddingBottom:"30px"}}>
      <Banner/>
      <hr className="my-6 border-t-2 border-gray-300" style={{ paddingBlock: "7px"}} />
      <RecommendList/>
      <FloatButton/>
    </main>
  );
}

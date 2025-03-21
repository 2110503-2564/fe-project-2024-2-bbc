import Image from "next/image";
import styles from "./page.module.css";
import Banner from "./components/Banner";
import RecommendList from "./components/RecommendList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-200">
      <Banner/>
      <RecommendList/>
    </main>
  );
}

'use client';

import { useRouter } from "next/navigation";
import styles from "./floatButton.module.css";
import Image from "next/image";

interface ChooseHotelButtonProps {
  onClick?: () => void;
}

const ChooseHotelButton: React.FC<ChooseHotelButtonProps> = ({ onClick }) => {
  const router = useRouter();

  return (
    <button
      className={styles.floatButton}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
        router.push("/hotel");
      }}
    >
      Explore Hotels
      <div style={{ position: "absolute", right: "10px", top:"9px" }}>
      <Image src={"/icon/chevron-right.svg"} alt="chevron" width={27} height={27}/>
      </div>
      <div className={styles.innerBorder}></div>
    </button>
  );
};

export default ChooseHotelButton;

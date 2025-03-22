'use client';

import { useRouter } from "next/navigation";
import styles from "./floatButton.module.css";

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
    </button>
  );
};

export default ChooseHotelButton;

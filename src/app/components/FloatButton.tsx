'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./floatButton.module.css";
import Image from "next/image";

interface ChooseHotelButtonProps {
  onClick?: () => void;
}

const ChooseHotelButton: React.FC<ChooseHotelButtonProps> = ({ onClick }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={styles.floatButton}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
        router.push("/hotel");
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Explore Hotels&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <div
        style={{
          position: "absolute",
          right: "6px",
          top: "6px",
          backgroundColor: "white",
          width: "32px",
          height: "32px",
          borderRadius: "30px",
        }}
      >
        <Image
          src={isHovered ? "/icon/chevron-right-blue.svg" : "/icon/chevron-right.svg"}
          alt="chevron"
          width={27}
          height={27}
          style={{ marginTop: "3px", marginLeft: "3px" }}
        />
      </div>
      <div className={styles.innerBorder}></div>
    </button>
  );
};

export default ChooseHotelButton;
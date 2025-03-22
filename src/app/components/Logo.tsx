'use client'

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Logo() {
  const [logoSrc, setLogoSrc] = useState("/img/HIDDEN.png");

  return (
    <Link 
      href="/" 
      className="block"
      onMouseEnter={() => setLogoSrc("/img/HIDDEN_blue.png")}
      onMouseLeave={() => setLogoSrc("/img/HIDDEN.png")}
    >
      <Image
        src={logoSrc}
        alt="logo"
        width={90}
        height={2}
        className="h-full object-contain transition duration-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
      />
    </Link>
  );
}

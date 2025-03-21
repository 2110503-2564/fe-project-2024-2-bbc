'use client'

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Logo() {
  const [logoSrc, setLogoSrc] = useState("/img/logo.png");

  return (
    <Link href="/" className="block">
      <Image
        src={logoSrc}
        alt="logo"
        width={360}
        height={0}
        className="h-full w-auto object-contain transition duration-300"
        onMouseEnter={() => setLogoSrc("/img/logo2.png")} // Change to hover image
        onMouseLeave={() => setLogoSrc("/img/logo.png")} // Change back to original
      />
    </Link>
  );
}

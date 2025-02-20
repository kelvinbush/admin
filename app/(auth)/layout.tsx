import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={
        "bg-midnight-blue min-h-screen p-6 grid place-items-center relative"
      }
    >
      <Card className={"shadow-none max-w-3xl p-6"}>{children}</Card>
      <Image
        src={"/images/logo-white.svg"}
        width={200}
        height={200}
        className={"w-auto h-10 absolute bottom-6 right-6"}
        alt={"Melanin Kapital logo"}
      />
    </div>
  );
};

export default AuthLayout;

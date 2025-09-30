import UserNav from "./user-nav";
import { useTitle } from "@/context/title-context";

const Topnav = () => {
  const { title } = useTitle();
  
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between bg-white py-3 pl-[308px] pr-4">
      <p className={"text-xl font-medium leading-tight text-midnight-blue"}>
        {title}
      </p>
      <div className={"flex items-center gap-8"}>
        <UserNav />
      </div>
    </div>
  );
};

export default Topnav;

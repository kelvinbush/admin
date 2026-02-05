"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import UserNav from "./user-nav";
import { useTitle } from "@/context/title-context";

// Route to title mapping
const routeTitles: Record<string, string> = {
  "/": "Dashboard",
  "/organizations": "Organizations",
  "/internal-users": "System Users",
  "/usergroups": "User Groups",
  "/entrepreneurs": "Entrepreneurs",
  "/investor-opportunities": "Investor Opportunities",
  "/loan-applications": "Loan Applications",
  "/loan-products": "Loan Products",
  "/loan-fees": "Loan Fees",
};

// Get title from pathname
function getTitleFromPath(pathname: string): string {
  // Check exact matches first
  if (routeTitles[pathname]) {
    return routeTitles[pathname];
  }

  // Check for subroutes
  for (const [route, title] of Object.entries(routeTitles)) {
    if (route !== "/" && pathname.startsWith(route + "/")) {
      // For detail pages, try to extract a more specific title
      if (pathname.startsWith("/loan-applications/")) {
        return "Loan Application Details";
      }
      if (pathname.startsWith("/entrepreneurs/")) {
        return "Entrepreneur Details";
      }
      if (pathname.startsWith("/organizations/")) {
        return "Organization Details";
      }
      if (pathname.startsWith("/usergroups/")) {
        return "User Group Details";
      }
      if (pathname.startsWith("/loan-products/")) {
        return "Loan Product Details";
      }
      return title;
    }
  }

  return "Dashboard";
}

const Topnav = () => {
  const { title, setTitle } = useTitle();
  const pathname = usePathname();

  // Update title when pathname changes
  useEffect(() => {
    const newTitle = getTitleFromPath(pathname);
    setTitle(newTitle);
  }, [pathname, setTitle]);

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-white py-3 pl-[308px] pr-4 shadow">
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

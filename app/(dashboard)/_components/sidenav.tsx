import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { setTitle } from "@/lib/redux/features/top-bar.slice";
import { useAppDispatch } from "@/lib/redux/hooks";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";

const sidenavLinks = [
  {
    title: "Dashboard",
    href: "/",
    icon: <Icons.dashboard />,
  },
  // {
  //   title: "Admin Management",
  //   href: "/#",
  //   icon: <Icons.adminIcon />,
  // },
  {
    title: "Entrepreneurs",
    href: "/entrepreneurs",
    icon: <Icons.entreIcon />,
  },
  {
    title: "Loan Applications",
    href: "/loan-applications",
    icon: <Icons.moneyBag className={"h-5 w-5"} />,
  },
  {
    title: "Partners",
    href: "/partners",
    icon: <Icons.entreIcon className={"h-5 w-5"} />,
  },
  {
    title: "Loan Products",
    href: "/loan-products",
    icon: <Icons.moneyBag className={"h-5 w-5"} />,
  },
];

const otherLinks = [
  {
    title: "Notifications",
    href: "/notifications",
    icon: <Icons.notifications />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Icons.settings />,
  },
];

const Sidenav = () => {
  const dispatch = useAppDispatch();

  const setTitleOnBar = (title: string) => {
    dispatch(setTitle(title));
  };

  return (
    <div
      className="fixed left-0 top-0 z-20 flex min-h-svh w-[290px] flex-col bg-midnight-blue pb-3 pt-2 text-white shadow-lg"
      style={{
        backgroundImage: `url(/images/branding.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className={"absolute top-0 left-0 w-full h-full"}
        style={{
          background: "rgba(21, 31, 40, 0.95)",
        }}
      />
      <div className={"relative flex-1 flex flex-col"}>
        <div className="px-4 pb-4 gradient-border">
          <Image
            src="/images/logo-white.svg"
            alt="Melani Kapital Logo"
            className="w-max"
            width={200}
            height={36}
          />
        </div>
        <div className={"px-4 mt-4"}>
          <h3 className="py-2.5 text-sm font-medium">MENU</h3>
          <div className="space-y-2">
            {sidenavLinks.map((link) => (
              <SidenavItem
                key={link.title}
                onSetTitle={setTitleOnBar}
                {...link}
              />
            ))}
          </div>
        </div>
        {/*<div className="space-y-1.5 px-4 py-2 my-4 gradient-border-card">*/}
        {/*  {otherLinks.map((link) => (*/}
        {/*    <SidenavItem*/}
        {/*      key={link.title}*/}
        {/*      onSetTitle={setTitleOnBar}*/}
        {/*      {...link}*/}
        {/*    />*/}
        {/*  ))}*/}
        {/*</div>*/}
        <div className="mt-auto px-4">
          <Button
            variant="ghost"
            className="flex w-full cursor-pointer items-center justify-start gap-2 px-4 py-2.5 text-left"
          >
            <Icons.logout />
            <p>Logout</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidenav;

interface SidenavItemProps {
  title: string;
  icon: React.ReactNode;
  href: string;
  children?: Array<{ title: string; href: string; icon: React.ReactElement }>;
  onSetTitle?: (title: string) => void;
}

const SidenavItem = ({
  title,
  icon: Icon,
  href,
  children,
  onSetTitle,
}: SidenavItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isDashboard = href === "/";
  const normalizedPathname =
    pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const normalizedHref = href.replace(/\/$/, "");

  const isActive = isDashboard
    ? normalizedPathname === "/"
    : normalizedPathname === normalizedHref;

  const isParentOfActive =
    !isDashboard && normalizedPathname.startsWith(normalizedHref + "/");

  const isChildActive = children?.some((child) => {
    const normalizedChildHref = child.href.replace(/\/$/, "");
    return (
      normalizedPathname === normalizedChildHref ||
      normalizedPathname.startsWith(normalizedChildHref + "/")
    );
  });

  const [isOpen, setIsOpen] = useState(isParentOfActive || isChildActive);

  const handleClick = () => {
    if (children) {
      setIsOpen(!isOpen);
    } else {
      router.push(href);
    }
    onSetTitle?.(title);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between rounded px-4 py-3 text-left transition-colors font-medium",
          !children &&
            "hover:bg-gradient-to-r from-[#8AF2F2] to-[#54DDBB] hover:text-midnight-blue",
          {
            "text-blue-300": isParentOfActive && !isOpen,
            "bg-gradient-to-r from-[#8AF2F2] to-[#54DDBB] text-midnight-blue font-bold":
              !children && isActive,
          },
        )}
      >
        <div className="flex items-center gap-2.5">
          {Icon}
          <span>{title}</span>
        </div>
        {children && (
          <span
            className={cn({ "text-blue-300": isParentOfActive && !isOpen })}
          >
            {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </span>
        )}
      </button>
      {children && isOpen && (
        <div className="ml-4 mt-1 space-y-1">
          {children.map((child) => {
            const normalizedChildHref = child.href.replace(/\/$/, "");
            const isChildItemActive =
              normalizedPathname === normalizedChildHref ||
              normalizedPathname.startsWith(normalizedChildHref + "/");

            return (
              <Link
                key={child.title}
                href={child.href}
                onClick={() => onSetTitle?.(child.title)}
                className={cn(
                  "rounded px-4 py-3 transition-colors font-medium flex items-center gap-2.5",
                  "hover:bg-gradient-to-r from-[#8AF2F2] to-[#54DDBB] hover:text-midnight-blue",
                  {
                    "bg-gradient-to-r from-[#8AF2F2] to-[#54DDBB] text-midnight-blue font-bold":
                      isChildItemActive,
                  },
                )}
              >
                {child.icon} {child.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

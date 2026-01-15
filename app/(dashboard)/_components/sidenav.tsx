import { Button } from "@/components/ui/button";
import { useTitle } from "@/context/title-context";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Bell,
  Settings,
  LogOut,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { SvgIcon } from "@/components/ui/svg-icon";

const sidenavLinks = [
  {
    title: "Dashboard",
    href: "/",
    icon: <SvgIcon src="/dashboard.svg" width={20} height={20} />,
  },
  {
    title: "User Management",
    href: "/#",
    icon: <SvgIcon src="/user-management.svg" width={20} height={20} />,
    children: [
      {
        title: "Organizations",
        href: "/organizations",
        icon: <SvgIcon src="/organisations.svg" width={16} height={16} />,
      },
      {
        title: "System Users",
        href: "/internal-users",
        icon: <SvgIcon src="/system-users.svg" width={16} height={16} />,
      },
      {
        title: "User Groups",
        href: "/usergroups",
        icon: <SvgIcon src="/user-groups.svg" width={16} height={16} />,
      },
    ],
  },
  {
    title: "Entrepreneurs",
    href: "/entrepreneurs",
    icon: <SvgIcon src="/entrepreneurs.svg" width={20} height={20} />,
  },
  {
    title: "Funding",
    href: "/#",
    icon: <SvgIcon src="/funding.svg" width={20} height={20} />,
    children: [
      {
        title: "Investor Opportunities",
        href: "/investor-opportunities",
        icon: (
          <SvgIcon src="/investor-opportunities.svg" width={16} height={16} />
        ),
      },
      {
        title: "Loan Applications",
        href: "/loan-applications",
        icon: <SvgIcon src="/loan-products.svg" width={16} height={16} />,
      },
      {
        title: "Loan Products",
        href: "/loan-products",
        icon: <SvgIcon src="/loan-products.svg" width={16} height={16} />,
      },
      {
        title: "Loan Fees",
        href: "/loan-fees",
        icon: <SvgIcon src="/loan-products.svg" width={16} height={16} />,
      },
    ],
  },
];

const Sidenav = () => {
  const { setTitle } = useTitle();

  const setTitleOnBar = (title: string) => {
    setTitle(title);
  };

  return (
    <div
      className="fixed left-0 top-0 z-[99] flex min-h-svh w-[290px] flex-col bg-midnight-blue pb-3 pt-2 text-white shadow-lg"
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
          <div className="flex items-center gap-2">
            <Image
              src="/mklogo.svg"
              alt="Melanin Kapital Logo"
              className="w-max max-w-[180px] md:max-w-[200px]"
              width={200}
              height={36}
            />
          </div>
        </div>
        <div className={"px-4 mt-4"}>
          <h3 className="py-2.5 text-sm font-medium text-primaryGrey-200">
            MENU
          </h3>
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
        <div className="mt-auto px-4 space-y-2">
          {/* Notifications */}
          <Button
            variant="ghost"
            className="flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-left hover:bg-white/5"
          >
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <p>Notifications</p>
            </div>
            <span className="bg-primary-green text-black text-xs font-medium px-2 py-0.5 rounded">
              10
            </span>
          </Button>
          {/* Settings */}
          <Button
            variant="ghost"
            className="flex w-full cursor-pointer items-center justify-start gap-2 px-4 py-2.5 text-left hover:bg-white/5"
          >
            <Settings className="h-5 w-5" />
            <p>Settings</p>
          </Button>
        </div>
        <div className="px-4 pt-4 border-t border-white/10">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="flex w-full cursor-pointer items-center justify-start gap-2 px-4 py-2.5 text-left hover:bg-white/5"
            >
              <LogOut className="h-5 w-5" />
              <p>Logout</p>
            </Button>
            <Button
              variant="ghost"
              className="flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-left hover:bg-white/5"
            >
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                <p>Dark mode</p>
              </div>
              <div className="relative w-10 h-6 bg-primary-green rounded-full">
                <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full"></div>
              </div>
            </Button>
          </div>
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

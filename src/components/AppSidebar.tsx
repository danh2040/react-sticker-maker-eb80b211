import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Square, 
  Tag, 
  User, 
  ToggleLeft, 
  MessageSquare, 
  Info,
  Image as ImageIcon,
  ChevronDown
} from "lucide-react";
import logoLight from "@/assets/ecosia-logo-light.svg";
import logoDark from "@/assets/ecosia-logo-dark.svg";

const componentItems = [
  { title: "Logo", url: "#logo", icon: Square },
  { title: "Illustrations", url: "#illustrations", icon: ImageIcon },
  { title: "Photography", url: "#photography", icon: ImageIcon },
  { title: "Button", url: "#button", icon: Square },
  { title: "Badge", url: "#badge", icon: Tag },
  { title: "Avatar", url: "#avatar", icon: User },
  { title: "Switch", url: "#switch", icon: ToggleLeft },
  { title: "Tooltip", url: "#tooltip", icon: MessageSquare },
  { title: "Popover", url: "#popover", icon: Info },
  { title: "Slider", url: "#slider", icon: ImageIcon },
  { title: "Accordion", url: "#accordion", icon: ChevronDown },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentHash = location.hash;
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="px-4 py-6 border-b border-border">
          <img src={logoLight} alt="Ecosia" className="h-7 dark:hidden" />
          <img src={logoDark} alt="Ecosia" className="h-7 hidden dark:block" />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Components</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {componentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a 
                      href={item.url}
                      className={`hover:bg-muted/50 ${
                        currentHash === item.url ? 'bg-muted text-primary font-medium' : ''
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

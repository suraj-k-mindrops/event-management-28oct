import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  Settings,
  User,
  LogOut,
  Newspaper,
  Package,
  FilePlus2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const mainMenuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Event Directory", url: "/directory", icon: Calendar },
  { title: "Event Packages", url: "/event-packages", icon: Package },
  { title: "Students", url: "/students", icon: Users },
  { title: "Providers", url: "/fields", icon: FileText },
  { title: "News", url: "/trending-news", icon: Newspaper },
  { title: "Form Editor", url: "/form-editor", icon: FilePlus2 },
];

export function AdminSidebar() {
  const { open } = useSidebar();
  const { logout } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-sidebar-background shadow-xl">
      <div className="flex items-center justify-between px-3 py-5 border-b border-sidebar-border">
        {open && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-sidebar-foreground">
                EventPro Admin
              </h2>
            </div>
          </div>
        )}
        <SidebarTrigger className="text-sidebar-foreground pr-8 h-8 px-3 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:px-0" />
      </div>

      <SidebarContent className="px-3 py-4 group-data-[collapsible=icon]:px-0">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold text-sidebar-foreground/50 uppercase tracking-widest px-3 mb-3">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary text-white font-medium"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-4 bg-sidebar-border" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold text-sidebar-foreground/50 uppercase tracking-widest px-3 mb-3">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Profile">
                  <NavLink
                    to="/profile"
                    className={({ isActive}) =>
                      isActive
                        ? "bg-primary text-white font-medium"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"
                    }
                  >
                    <User className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">Profile</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-primary text-white font-medium"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"
                    }
                  >
                    <Settings className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full hover:bg-sidebar-accent rounded-md transition-all">
              <div className="flex items-center gap-2 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-white font-semibold text-xs">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="group-data-[collapsible=icon]:hidden flex flex-col items-start flex-1 min-w-0">
                  <span className="text-sm font-medium truncate text-sidebar-foreground">Admin User</span>
                  <span className="text-xs text-sidebar-foreground/60 truncate">admin@eventpro.com</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Logout" 
              className="text-sidebar-foreground/90 hover:bg-destructive/90 hover:text-white rounded-md transition-all"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

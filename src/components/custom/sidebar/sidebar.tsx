import { Card, CardContent,   } from "@/components/ui/card";
import { Sidebar, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader } from "../../ui/sidebar";
import PhoneDummyScreen from "./phone-dummy-screen";
import PhoneInfo from "./phone-info";
import NotificationSection from "./notification-section";

export default function SidebarComponent({...props}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
          <Card className="w-full p-0">
            <CardContent className="flex gap-2 p-2">
              <PhoneDummyScreen image={"https://wallpapercat.com/download/32268"} width={72} aspectRatio={"9/16"} />
              <PhoneInfo />
            </CardContent>
          </Card>
      </SidebarHeader>
      <SidebarGroup className="overflow-y-auto">
        <SidebarGroupLabel>
          <span className="text-lg text-card-foreground">Notifications</span>
        </SidebarGroupLabel>
        <SidebarGroupContent className="overflow-y-auto mr-2">
          <NotificationSection
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </Sidebar>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGrpcContext } from "@/lib/context/grpc-context";
import { Command, DeviceInfo, MessageType } from "@/lib/interfaces/syncer";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  FaLinux,
  FaSearch,
  FaWifi,
  FaClock,
  FaDesktop,
  FaRedo,
} from "react-icons/fa";
import { MdPhoneAndroid, MdComputer } from "react-icons/md";

export const Route = createFileRoute("/devices/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { devices, isReachable, sendMessage } = useGrpcContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    await sendMessage({
      id: crypto.randomUUID(),
      createdAt: Math.floor(Date.now() / 1000),
      type: MessageType.SERVER_COMMAND,
      ServerCommand: {
        command: Command.REFRESH_DEVICES,
        data: JSON.stringify({}),
      },
      for: "0",
    });
  };

  const filteredDevices = useMemo(() => {
    if (!searchQuery.trim()) return devices;
    return devices.filter(
      (device) =>
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.ip.includes(searchQuery) ||
        device.platform.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [devices, searchQuery]);

  return (
    <div className="flex flex-col w-full h-full p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Devices</h1>
            <p className="text-muted-foreground">
              Manage and connect to your synced devices
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <FaRedo
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div
              className={`w-2 h-2 rounded-full ${
                isReachable ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span>
              {isReachable ? "Server Reachable" : "Server Unreachable"}
            </span>
          </div>
        </div>
      </div>

      <Separator />

      <DeviceList devices={filteredDevices} isLoading={isRefreshing} />
    </div>
  );
}

function DeviceList({
  devices,
  isLoading,
}: {
  devices: DeviceInfo[];
  isLoading?: boolean;
}) {
  const sortedDevices = useMemo(
    () =>
      devices
        .sort((a, b) => {
          if (a.connected && !b.connected) return -1;
          if (!a.connected && b.connected) return 1;
          return 0;
        })
        .sort((a, b) => b.lastSeen - a.lastSeen),
    [devices]
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <DeviceSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (devices.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedDevices.map((device) => (
        <DeviceItem key={device.id} device={device} />
      ))}
    </div>
  );
}

function DeviceItem({ device }: { device: DeviceInfo }) {
  const router = useRouter();
  const getPlatformIcon = () => {
    switch (device.platform.toLowerCase()) {
      case "android":
        return <MdPhoneAndroid className="w-6 h-6" />;
      case "linux":
        return <FaLinux className="w-6 h-6" />;
      case "windows":
        return <MdComputer className="w-6 h-6" />;
      default:
        return <FaLinux className="w-6 h-6" />;
    }
  };

  const getPlatformName = () => {
    return device.platform.charAt(0).toUpperCase() + device.platform.slice(1);
  };

  const formatLastSeen = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const handleDeviceClick = () => {
    if (device.connected) {
      router.navigate({ to: `/devices/${device.id}` });
    }
  };

  return (
    <Card
      className={`transition-all duration-200 ${
        device.connected
          ? "hover:shadow-md hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/20"
          : "opacity-60 cursor-not-allowed"
      }`}
      onClick={handleDeviceClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`rounded-full p-3 ${
                device.connected
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {getPlatformIcon()}
            </div>
            <div>
              <CardTitle className="text-lg">{device.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {getPlatformName()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {device.connected ? (
              <div className="flex items-center space-x-1 text-green-600">
                <FaWifi className="w-4 h-4" />
                <span className="text-xs font-medium">Online</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-red-500">
                <FaWifi className="w-4 h-4 opacity-50" />
                <span className="text-xs font-medium">Offline</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">IP Address</span>
            <span className="font-mono">{device.ip}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Seen</span>
            <div className="flex items-center space-x-1">
              <FaClock className="w-3 h-3 text-muted-foreground" />
              <span>{formatLastSeen(device.lastSeen)}</span>
            </div>
          </div>

          {device.connected && (
            <>
              <Separator />
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                <span>Click to connect</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DeviceSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Separator />
          <div className="flex space-x-2">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 w-10" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <FaDesktop className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No devices found</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">
        No devices are currently available. Make sure your devices are connected
        to the same network and running the syncer app.
      </p>
      <Button variant="outline">
        <FaRedo className="w-4 h-4 mr-2" />
        Refresh Devices
      </Button>
    </div>
  );
}

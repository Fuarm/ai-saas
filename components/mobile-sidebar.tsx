"use client"

import {Button} from "@/components/ui/button";
import {Menu} from "lucide-react";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import Sidebar from "@/components/sidebar";
import {useEffect, useState} from "react";

interface MobileSidebarProps {
  isPro: boolean;
  apiLimitCount: number;
}
const MobileSidebar = ({
  isPro = false,
 apiLimitCount = 0
}: MobileSidebarProps) => {

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} />
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar;

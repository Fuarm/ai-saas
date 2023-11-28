"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {useProModal} from "@/hooks/use-pro-modal";
import {Badge} from "@/components/ui/badge";
import {tools} from "@/constants";
import {Card} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {CheckIcon, LoaderIcon, ZapIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import axios from "axios";
import {useState} from "react";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import toast from "react-hot-toast";

const ProModal = () => {
  const proModal = useProModal();

  const [loading, setLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/stripe");
      window.open(response.data.url, "mozillaTab");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center font-bold gap-x-3">
            Upgrade to Genius
            <Badge variant="premium" className="uppercase text-sm">Pro</Badge>
          </DialogTitle>
        </DialogHeader>
        <DialogBody className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
          {
            tools.map(tool => (
              <Card
                key={tool.href}
                className="p-3 border-black/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-x-4">
                  <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                    <tool.icon className={cn("w-6 h-6", tool.color)} />
                  </div>
                  <div className="font-semibold text-sm">{ tool.label }</div>
                </div>
                <CheckIcon className="text-primary w-5 h-5" />
              </Card>
            ))
          }
        </DialogBody>
        <DialogFooter>
          <Button disabled={loading} size="lg" variant="premium" className="w-full relative" onClick={onSubscribe}>
            {
              loading && <LoaderIcon className="w-4 h-4 fill-white animate-spin absolute left-1/3" />
            }
            Upgrade
            <ZapIcon className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProModal;
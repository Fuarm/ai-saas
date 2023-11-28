"use client";

import {Button} from "@/components/ui/button";
import {LoaderIcon, ZapIcon} from "lucide-react";
import axios from "axios";
import {useState} from "react";
import toast from "react-hot-toast";

interface SubscriptionButtonProps {
  isPro: boolean;
}

const SubscriptionButton = ({
  isPro = false
}: SubscriptionButtonProps) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
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
    <Button disabled={loading} variant={isPro ? "default": "premium"} onClick={onClick}>
      {
        loading && <LoaderIcon className="w-4 h-4 mr-2 fill-white animate-spin" />
      }
      { isPro ? "Manage Subscription" : "Upgrade" }
      { !isPro && <ZapIcon className="w-4 h-4 ml-2 fill-white" /> }
    </Button>
  )
}

export default SubscriptionButton;

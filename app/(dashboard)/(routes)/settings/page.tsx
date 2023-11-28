import {SETTINGS} from "@/constants";
import Heading from "@/components/heading";
import {checkSubscription} from "@/lib/subscription";
import SubscriptionButton from "@/components/subscription-button";

const SettingsPage = async () => {
  const isPro = await checkSubscription();

  return (
    <>
      <Heading
        title={SETTINGS.label}
        description={SETTINGS.desc}
        icon={SETTINGS.icon}
        iconColor={SETTINGS.color}
        bgColor={SETTINGS.bgColor}
      />

      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro ? "You are currently on a Pro plan." : "You are currently on a free plan."}
        </div>
        <SubscriptionButton isPro={isPro}/>
      </div>
    </>
  )
}

export default SettingsPage;

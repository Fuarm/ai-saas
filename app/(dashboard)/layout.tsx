import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import {getApiLimitCount} from "@/lib/api-limit";
import {checkSubscription} from "@/lib/subscription";

const DashboardLayout = async ({children}: {
  children: React.ReactNode
}) => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:fixed md:flex-col md:w-64 md:inset-y-0 bg-gray-900">
        <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} />
      </div>
      <main className="md:pl-64">
        <Navbar isPro={isPro} apiLimitCount={apiLimitCount} />
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout;

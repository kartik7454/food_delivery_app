import { FC, Suspense } from "react";
import Dashboardmenuitemcomponent from "@/components/dashboardmenuitemcomponent";
import Link from "next/link";
import Loading from "../../loading";

interface PageProps {}

const Page: FC<PageProps> = () => {
  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      {/* Container */}
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
            Menu Items
          </h1>

          <Link href="/dashboard/addmenuitem">
            <button
              type="button"
              className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              + Add New
            </button>
          </Link>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <Suspense fallback={<Loading />}>
            <Dashboardmenuitemcomponent />
          </Suspense>
        </div>

      </div>
    </div>
  );
};

export default Page;
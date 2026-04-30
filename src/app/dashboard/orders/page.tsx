"use client"

import { FC, Suspense, useState, useEffect } from "react";
import { isadmin } from "@/lib/isadmin";
import Loading from "../../loading";
import Orders from "@/components/orders";

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchtodo = async () => {
      setIsLoading(true);
      const alo = await isadmin();

      try {
        let response, json;
        if (alo === true) {
          response = await fetch("/order");
        } else {
          response = await fetch("/indorder");
        }
        json = await response.json();

        if (!response.ok) {
          console.error(json.error);
          setOrders([]);
        } else {
          setOrders(json.mssg);
        }
      } catch (err) {
        setOrders([]);
        console.error("Failed to fetch orders.", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchtodo();
  }, []);

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 sm:px-8 pb-20">
      <div className="flex flex-col items-center mb-12 relative">
        <div className="w-full">
          <div className="flex flex-col items-center justify-center">
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-sans text-gray-900 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent tracking-tight text-center drop-shadow mb-2">
              Orders Overview
            </h1>
            <p className="text-lg text-slate-600 text-center max-w-2xl mt-2">
              Track your placed orders and review their status in one central place.
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-xl shadow-lg bg-white/80 border border-slate-200 px-4 sm:px-8 py-6">
        <Suspense fallback={<Loading />}>
          {isLoading ? (
            <Loading />
          ) : orders.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-24">
              <img src="/empty-orders.svg" alt="No Orders" className="w-40 h-40 mb-6 opacity-70" />
              <h2 className="text-2xl font-semibold text-slate-700 mb-2">No orders found</h2>
              <p className="text-slate-500 mb-6">
                You haven't placed any orders yet.{` `}
                <a className="text-red-500 underline hover:text-red-600 transition" href="/menu">
                  Browse the menu
                </a>
              </p>
            </div>
          ) : (
            <Orders orders={orders} />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
import { FC } from "react";
import Link from "next/link";

interface ordersProps {
  orders: Orders[];
}

// Helper to format date more elegantly
function convertDateFormat(isoString: string): string {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
}

// Improved, non-async version for better React interoperability and style
const Orders: FC<ordersProps> = ({ orders }) => {
  // Spread and reverse to avoid mutating input array
  const displayOrders = [...orders].reverse();

  return (
    <div className="space-y-8">
      {displayOrders.map((item) => {
        const formattedDate = item?.createdAt ? convertDateFormat(item.createdAt) : "Unknown date";
        return (
          <div
            key={item._id}
            className="bg-white border border-slate-300 shadow-sm rounded-xl px-6 py-5 flex flex-col md:flex-row items-center md:items-start justify-between gap-4 hover:shadow-lg transition mb-2"
          >
            <div className="flex items-center gap-5 flex-1">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg border-2 font-semibold text-base font-sans ${
                  item.status === "pending"
                    ? "border-yellow-400 bg-yellow-100 text-yellow-700"
                    : item.status === "delivered"
                    ? "border-green-400 bg-green-100 text-green-700"
                    : "border-blue-400 bg-blue-100 text-blue-700"
                }`}
                style={{ minWidth: 100 }}
                disabled
              >
                {item.status}
              </button>
              <div className="ml-2">
                <div className="flex flex-col sm:flex-row items-baseline gap-4">
                  <span className="font-bold text-lg text-slate-900">{item.name}</span>
                  <span className="text-slate-500 text-sm">{formattedDate}</span>
                </div>
                <div className="text-slate-600 text-base mt-1 font-light">
                  {item.cartitem && item.cartitem.length > 0 ? (
                    <span>
                      <span className="font-medium">First item:</span>{" "}
                      {item.cartitem[0].title}
                      {item.cartitem.length > 1 ? (
                        <span className="ml-2 text-xs text-slate-400">{`+${item.cartitem.length - 1} more`}</span>
                      ) : null}
                    </span>
                  ) : (
                    <span>No items</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex-shrink-0">
              <Link href={`/orders/${item._id}`} passHref legacyBehavior>
                <a>
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2 transition-colors shadow-sm"
                  >
                    View
                  </button>
                </a>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Orders;
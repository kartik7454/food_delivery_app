import { FC, useMemo, useState } from "react";

interface AddtocartdivProps {
  menuitems: Menuitem | undefined;
  id: string | undefined;
  setvisi: () => void;
}

const Addtocartdiv: FC<AddtocartdivProps> = ({ menuitems, id, setvisi }) => {
  const [cartitem, setcartitem] = useState<Cartitem>({
    _id: "",
    key: id || "",
    title: menuitems?.title || "",
    discription: menuitems?.discription || "",
    image: menuitems?.image || "",
    price: menuitems?.price || 0,
    type: menuitems?.type || "",
    file: null,
    size: menuitems?.size?.length ? [menuitems.size[0]] : [{ name: "", price: 0 }],
    extraIngredientPrices: [],
    total: menuitems?.size?.[0]?.price || 0,
  });

  const cartitemtotal = useMemo(() => {
    const basePrice = cartitem.size?.[0]?.price || 0;
    const extrasTotal = cartitem.extraIngredientPrices.reduce((sum, item) => sum + item.price, 0);
    return basePrice + extrasTotal;
  }, [cartitem.size, cartitem.extraIngredientPrices]);

  function handleSizeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const [name, price] = event.target.value.split("_");
    setcartitem((prevState) => ({
      ...prevState,
      size: [{ name, price: Number(price) }],
    }));
  }

  function handleExtrasChange(event: React.ChangeEvent<HTMLInputElement>) {
    const [name, price] = event.target.value.split("_");
    const parsedPrice = Number(price);

    setcartitem((prevState) => {
      if (event.target.checked) {
        return {
          ...prevState,
          extraIngredientPrices: [
            ...prevState.extraIngredientPrices,
            { name, price: parsedPrice },
          ],
        };
      }

      return {
        ...prevState,
        extraIngredientPrices: prevState.extraIngredientPrices.filter(
          (item) => item.name !== name,
        ),
      };
    });
  }

  async function handleAddToCart() {
    const payload: Cartitem = {
      ...cartitem,
      total: cartitemtotal,
    };

    const response = await fetch("/addtocart", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    if (!response.ok) {
      console.log(json.error);
      return;
    }

    setvisi();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <section className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="grid gap-0 md:grid-cols-[1.05fr_1fr]">
          <div className="relative">
            <img
              className="h-64 w-full object-cover md:h-full"
              src={`/images/${menuitems?.image}`}
              alt={menuitems?.title || "Menu item"}
            />
            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-800 shadow-sm">
              ${cartitemtotal}
            </div>
          </div>

          <div className="flex flex-col p-6">
            <h2 className="text-2xl font-bold text-slate-900">{menuitems?.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{menuitems?.discription}</p>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-500">
                Size
              </label>
              <select
                onChange={handleSizeChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                value={`${cartitem.size?.[0]?.name}_${cartitem.size?.[0]?.price}`}
              >
                {menuitems?.size.map((item) => (
                  <option key={item.name} value={`${item.name}_${item.price}`}>
                    {item.name} (${item.price})
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Extra Toppings
              </h3>
              <div className="max-h-36 space-y-2 overflow-y-auto pr-1">
                {menuitems?.extraIngredientPrices.map((item) => (
                  <label
                    key={item.name}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                  >
                    <span className="text-slate-700">{item.name}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">+${item.price}</span>
                      <input
                        type="checkbox"
                        value={`${item.name}_${item.price}`}
                        checked={cartitem.extraIngredientPrices.some(
                          (extra) => extra.name === item.name,
                        )}
                        onChange={handleExtrasChange}
                        className="h-4 w-4 accent-red-600"
                      />
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="h-11 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-sm font-semibold text-white transition hover:from-red-700 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-red-200"
              >
                Add to Cart - ${cartitemtotal}
              </button>
              <button
                type="button"
                onClick={setvisi}
                className="h-11 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Addtocartdiv;
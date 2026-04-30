
import { FC } from "react";

interface PizzaItemProps {
  menuitem: Menuitem;
  addtocart: (item: Menuitem) => void;
}

const PizzaItem: FC<PizzaItemProps> = ({ menuitem, addtocart }) => {
  const imageSrc = `/images/${menuitem.image}`;

  return (
    <article className="group my-10 mb-11 flex h-[26rem] w-96 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <img
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={imageSrc}
          alt={menuitem.title}
          loading="lazy"
        />
        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur">
          ${menuitem.price}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">{menuitem.title}</h2>

        <p className="mt-2 flex-1 break-words text-sm leading-6 text-slate-600 line-clamp-3">
          {menuitem.discription}
        </p>

        <button
          type="button"
          onClick={() => addtocart(menuitem)}
          className="mt-5 h-11 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:from-red-700 hover:to-orange-600 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-red-200"
          aria-label={`Add ${menuitem.title} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
};

export default PizzaItem;
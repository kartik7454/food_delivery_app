

import { getUserSession } from '@/lib/session'
import HomeMenuComponent from "@/components/homemenucomponent"

export default async function Home() {
  const user = await getUserSession()
  const userId = user?.id ?? ""

  return (
    <main className="bg-slate-100 pb-20">
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-16 pt-16 md:grid-cols-2 md:items-center md:px-10 lg:px-16">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl">
            Everything is better
            <span className="block text-red-500">with a Pizza</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Pizza is the missing piece that makes every day complete. A simple yet
            delicious joy in life.
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          <img
            src="https://www.easypages.url.tw/w3layouts061/assets/images/products/3.jpg"
            alt="Freshly baked pizza"
            className="h-auto w-full max-w-md rounded-3xl border-4 border-white object-cover shadow-xl"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl rounded-3xl bg-white px-6 py-10 shadow-sm md:px-10 lg:px-14">
        <h2 className="text-center text-4xl font-bold italic text-red-500 sm:text-5xl">
          Our Best Seller
        </h2>
        <div className="mt-8">
          <HomeMenuComponent id={userId} />
        </div>
      </section>

      <section className="mx-auto mt-10 w-full max-w-7xl rounded-3xl bg-white px-6 py-10 shadow-sm md:px-10 lg:px-14">
        <h2 className="text-center text-4xl font-bold italic text-red-500 sm:text-5xl">
          About us
        </h2>
        <div className="mx-auto mt-8 max-w-4xl space-y-6 text-center text-base leading-8 text-slate-600 sm:text-lg">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu dictum
            varius duis at consectetur lorem. Ornare arcu odio ut sem nulla.
            Amet aliquam id diam maecenas ultricies.
          </p>
          <p>
            Felis donec et odio pellentesque diam volutpat commodo sed. Quis
            imperdiet massa tincidunt nunc pulvinar sapien et. Tincidunt tortor
            aliquam nulla facilisi cras fermentum. Felis eget nunc lobortis
            mattis aliquam faucibus purus in.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-10 w-full max-w-7xl rounded-3xl bg-white px-6 py-10 text-center shadow-sm md:px-10 lg:px-14">
        <h2 className="text-4xl font-bold italic text-red-500 sm:text-5xl">
          Contact us
        </h2>
        <p className="mt-8 text-2xl font-semibold text-slate-700 underline decoration-red-400 underline-offset-8 sm:text-4xl">
          +91 887 4882 3483
        </p>
      </section>
    </main>
  );
}

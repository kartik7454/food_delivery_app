import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { authOptions } from "@/utils/authoptions"
import Cartcomponent from "@/components/cartcomponent"

export default async function Cart() {
  const session = await getServerSession(authOptions)
  const user = (session?.user ?? undefined) as User | undefined

  return (
    <main className="min-h-screen bg-gradient-to-b from-red-50 to-white py-10">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-red-100">
          <h1 className="text-3xl font-bold tracking-tight text-red-600 md:text-4xl">Your cart</h1>
          <p className="mt-2 text-sm text-gray-600 md:text-base">
            Review items, confirm delivery details, and continue to secure checkout.
          </p>
        </div>

        {!user ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-red-100">
            <h2 className="text-xl font-semibold text-gray-900">Please sign in to view your cart</h2>
            <p className="mt-2 text-sm text-gray-600">
              Login is required to load cart items and complete checkout.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex rounded-lg bg-red-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-600"
            >
              Go to login
            </Link>
          </div>
        ) : (
          <section className="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-red-100 md:p-4">
            <Cartcomponent user={user} />
          </section>
        )}
      </div>
    </main>
  )
}

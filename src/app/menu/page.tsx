
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import Loading from '../loading'
import MenuComponent from '@/components/menuComponent'
import { getUserSession } from '@/lib/session'

export default async function Menu() {
  const user = await getUserSession()

  if (!user?.id) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto mb-8 max-w-5xl rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur sm:p-10">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-red-500 sm:text-5xl">
          Our Menu
        </h1>
        <p className="mt-3 text-center text-sm text-slate-600 sm:text-base">
          Freshly prepared meals, classic favorites, and seasonal specials.
        </p>
      </section>

      <section className="mx-auto max-w-6xl">
        <Suspense fallback={<Loading />}>
          <MenuComponent id={user.id} />
        </Suspense>
      </section>
    </main>
  )
}

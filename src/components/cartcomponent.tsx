"use client"

import { FC, FormEvent, useEffect, useMemo, useState } from "react"
import { getUserSession } from '@/lib/session'
import { useRouter } from "next/navigation"

interface CartcomponentProps {
  user: User | undefined
}

const Cartcomponent: FC<CartcomponentProps> = ({ user }) => {
  const [cartitem, setcartitem] = useState<Cartitem[]>([])
  const [isLoadingCart, setIsLoadingCart] = useState(true)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showOrderPopup, setShowOrderPopup] = useState(false)
  const router = useRouter();

  const carttotal = useMemo(
    () => cartitem.reduce((sum, item) => sum + Number(item.total), 0),
    [cartitem]
  )

  useEffect(() => {
    const fetchCart = async () => {
      setErrorMessage(null)
      try {
        const sessionUser = await getUserSession()
        if (!sessionUser?.id) {
          setcartitem([])
          return
        }

        const response = await fetch('/addtocart/' + sessionUser.id)
        const json = await response.json()

        if (!response.ok) {
          setErrorMessage(json.error ?? "Failed to load cart items.")
          return
        }

        setcartitem(json.mssg ?? [])
      } catch (error) {
        console.error(error)
        setErrorMessage("Something went wrong while loading your cart.")
      } finally {
        setIsLoadingCart(false)
      }
    }

    fetchCart()
  }, [])

  async function handleRemoveItem(id: string) {
    const previousItems = cartitem
    const newarr = cartitem.filter((item) => item._id !== id)
    setcartitem(newarr)
    setErrorMessage(null)

    try {
      const response = await fetch('/addtocart/' + id, {
        method: "POST",
        body: JSON.stringify(id),
      })
      const json = await response.json()
      if (!response.ok) {
        setcartitem(previousItems)
        setErrorMessage(json.error ?? "Unable to remove cart item.")
      }
    } catch (error) {
      console.error(error)
      setcartitem(previousItems)
      setErrorMessage("Something went wrong while removing the item.")
    }
  }

  async function proceedToCheckout(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    if (!cartitem.length) return

    setIsCheckingOut(true)
    setErrorMessage(null)

    // ALWAYS redirect to menu, even on error
    let shouldShowPopup = true
    try {
      const address = user?.address
      const postalCode = user?.postalcode
      // Only create order in db, do not show payment, show popup, then redirect to menu
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          postalCode,
          cartitem,
        }),
      })

      if (!response.ok) {
        setErrorMessage("Order creation failed. Please try again.")
        shouldShowPopup = false
      } else {
        setShowOrderPopup(true)
        // Optionally also send the email as before, if this is still needed
        const [link, id] = await response.json()
        const response1 = await fetch('/order/' + id)
        const json = await response1.json()
        const item = json.mssg?.[0]

        if (item) {
          await fetch('/api/sendEmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item }),
          })
        }
      }
    } catch (error) {
     
    } finally {
      setIsCheckingOut(false)
      setTimeout(() => {
        router.push("/menu")
      }, 1700)
      // Popup should display only if success, but redirect always
      if (!shouldShowPopup) setShowOrderPopup(false)
    }
  }

  return (
    <div className='rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 md:p-6'>
      {/* Pop up on success */}
      {showOrderPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-xl bg-white px-8 py-6 border border-slate-200 shadow-lg text-center">
            <h1 className="text-xl font-semibold text-green-700 mb-2">Order placed!</h1>
            <div className="mb-2 text-slate-600">Your order has been received. Redirecting to menu...</div>
          </div>
        </div>
      )}

      {isLoadingCart ? (
        <h1 className="py-16 text-center text-2xl font-bold font-sans text-slate-700">Loading cart...</h1>
      ) : (
        <>
          {cartitem.length > 0 ? <div className='grid gap-6 lg:grid-cols-[1fr_320px]'>
            <div className='space-y-4'>
              {cartitem.map((item) => {
                return <div key={item._id} className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md md:p-5'>
                  <div className="flex items-start gap-4">
                    <img className='h-24 w-32 rounded-lg object-cover' src={"/images/" + item.image} alt={item.title}></img>

                    <div className="flex-1">
                      <p className="text-lg font-semibold font-sans text-slate-900 md:text-xl">{item.title}</p>
                      <p className="mt-1 text-sm font-medium font-sans text-slate-600">{item.size[0].name + " $" + item.size[0].price}</p>
                      {item.extraIngredientPrices.map((extra) => { return <p key={extra.name} className='text-sm font-medium font-sans text-slate-600'>{extra.name + " $" + extra.price}</p> })}
                    </div>
                    <div className="text-right" ><h1 className='text-lg font-bold font-sans text-slate-800'>{"$" + item.total}</h1></div>
                    <button type="button" aria-label="Remove item from cart" onClick={() => { handleRemoveItem(item._id) }} className="rounded-md p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-500" >  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                      <path d="M 21 0 C 19.355469 0 18 1.355469 18 3 L 18 5 L 10.1875 5 C 10.0625 4.976563 9.9375 4.976563 9.8125 5 L 8 5 C 7.96875 5 7.9375 5 7.90625 5 C 7.355469 5.027344 6.925781 5.496094 6.953125 6.046875 C 6.980469 6.597656 7.449219 7.027344 8 7 L 9.09375 7 L 12.6875 47.5 C 12.8125 48.898438 14.003906 50 15.40625 50 L 34.59375 50 C 35.996094 50 37.1875 48.898438 37.3125 47.5 L 40.90625 7 L 42 7 C 42.359375 7.003906 42.695313 6.816406 42.878906 6.503906 C 43.058594 6.191406 43.058594 5.808594 42.878906 5.496094 C 42.695313 5.183594 42.359375 4.996094 42 5 L 32 5 L 32 3 C 32 1.355469 30.644531 0 29 0 Z M 21 2 L 29 2 C 29.5625 2 30 2.4375 30 3 L 30 5 L 20 5 L 20 3 C 20 2.4375 20.4375 2 21 2 Z M 11.09375 7 L 38.90625 7 L 35.3125 47.34375 C 35.28125 47.691406 34.910156 48 34.59375 48 L 15.40625 48 C 15.089844 48 14.71875 47.691406 14.6875 47.34375 Z M 18.90625 9.96875 C 18.863281 9.976563 18.820313 9.988281 18.78125 10 C 18.316406 10.105469 17.988281 10.523438 18 11 L 18 44 C 17.996094 44.359375 18.183594 44.695313 18.496094 44.878906 C 18.808594 45.058594 19.191406 45.058594 19.503906 44.878906 C 19.816406 44.695313 20.003906 44.359375 20 44 L 20 11 C 20.011719 10.710938 19.894531 10.433594 19.6875 10.238281 C 19.476563 10.039063 19.191406 9.941406 18.90625 9.96875 Z M 24.90625 9.96875 C 24.863281 9.976563 24.820313 9.988281 24.78125 10 C 24.316406 10.105469 23.988281 10.523438 24 11 L 24 44 C 23.996094 44.359375 24.183594 44.695313 24.496094 44.878906 C 24.808594 45.058594 25.191406 45.058594 25.503906 44.878906 C 25.816406 44.695313 26.003906 44.359375 26 44 L 26 11 C 26.011719 10.710938 25.894531 10.433594 25.6875 10.238281 C 25.476563 10.039063 25.191406 9.941406 24.90625 9.96875 Z M 30.90625 9.96875 C 30.863281 9.976563 30.820313 9.988281 30.78125 10 C 30.316406 10.105469 29.988281 10.523438 30 11 L 30 44 C 29.996094 44.359375 30.183594 44.695313 30.496094 44.878906 C 30.808594 45.058594 31.191406 45.058594 31.503906 44.878906 C 31.816406 44.695313 32.003906 44.359375 32 44 L 32 11 C 32.011719 10.710938 31.894531 10.433594 31.6875 10.238281 C 31.476563 10.039063 31.191406 9.941406 30.90625 9.96875 Z"></path>
                    </svg></button>
                  </div></div>
              })}
              <div className='rounded-xl bg-slate-100 px-4 py-3'>
                <h1 className='text-xl font-semibold font-sans text-slate-800'>{ "Cart total: $" + carttotal}</h1>
              </div>
            </div>
            <div className='h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5'>
              <h2 className="mb-4 text-lg font-semibold text-slate-800">Checkout details</h2>
              <form onSubmit={proceedToCheckout} className="mx-auto my-2 w-full max-w-xs space-y-4">
                <div className="w-full">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Name</label>
                  <input readOnly className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none" defaultValue={user?.name} />
                </div>
                <div className="w-full">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Address</label>
                  <input readOnly className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none" defaultValue={user?.address} />
                </div>
                <div className="w-full">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Postal code</label>
                  <input readOnly className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none" defaultValue={user?.postalcode} />
                </div>
                <div className="w-full">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Phone number</label>
                  <input readOnly className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none" defaultValue={user?.phonenumber} />
                </div>
                <button disabled={isCheckingOut} type="submit" className="w-full rounded-lg bg-red-500 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-70">{isCheckingOut ? "Processing..." : "Place Order"}</button>
              </form>
            </div>
          </div> : <h1 className="py-16 text-center text-2xl font-bold font-sans text-slate-700">Your cart is empty</h1>}
          {errorMessage ? <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{errorMessage}</p> : null}
        </>
      )}
    </div>
  )
}

export default Cartcomponent
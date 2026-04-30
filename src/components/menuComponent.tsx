"use client"
import { FC } from 'react'
import { useState,useEffect } from "react"
import PizzaItem from './MenuItem'
import Addtocartdiv from "@/components/addtocartdiv"
import toast, { Toaster } from 'react-hot-toast';
interface MenuProps {
  id:string
}

const MenuComponent: FC<MenuProps> =({id}) => {
  
  const [menuitem, setmenuitem] = useState<Menuitem[]>([])
  const [visi, setvisi] = useState<boolean>(false)
  const [cartitem, setcartitem] = useState<Menuitem>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  
  

    useEffect( ()=>{
        const fetchMenuItems  = async ()=>{
          try {
            setIsLoading(true)
            setError("")
            const response = await fetch('/fooditem')
            const json = await response.json()
            if(!response.ok){
              setError(json.error || "Failed to load menu items.")
              return
            }
            setmenuitem(json.mssg || [])
          } catch {
            setError("Something went wrong while loading the menu.")
          } finally {
            setIsLoading(false)
          }
        }
        fetchMenuItems()
    },[])


                function addtocart(menuitem:Menuitem){
console.log(menuitem)
                 setcartitem(menuitem)
                 setvisi(true)
                }
                function setvisitofalse(){
                  
                                 
                                   setvisi(false)
toast.success("item added to cart")
                                  }
                
  return(<div className="px-6 pb-8">
    <Toaster />
    {isLoading ? (
      <p className="py-10 text-center text-lg font-medium text-slate-600">Loading menu...</p>
    ) : null}
    {!isLoading && error ? (
      <p className="py-10 text-center text-lg font-medium text-red-600">{error}</p>
    ) : null}
    {!isLoading && !error && menuitem.length === 0 ? (
      <p className="py-10 text-center text-lg font-medium text-slate-600">No menu items available right now.</p>
    ) : null}
    {!isLoading && !error && menuitem.length > 0 ? (
      <div className="mx-auto grid max-w-7xl grid-cols-1 justify-items-center gap-20 sm:grid-cols-2 xl:grid-cols-3">
        {menuitem.map((item)=>(
          <PizzaItem
            key={item._id}
            menuitem={item}
            addtocart={addtocart}
          />
        ))}
      </div>
    ) : null}
<div>



  {  cartitem!== undefined &&visi==true? (<Addtocartdiv
  menuitems={cartitem}
  id={id}
  setvisi={setvisitofalse}
  />):null }
  
</div>
    
  </div>) 
}

export default MenuComponent
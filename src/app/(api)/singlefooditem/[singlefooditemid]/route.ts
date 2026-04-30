import { NextRequest ,NextResponse} from "next/server"
import  { connectToDB} from "../../../../lib/connectDb.js"
import menuItem from "../../../../lib/models.js"

import mongoose from "mongoose";
interface Props {
    params: {
        singlefooditemid: string
      }
}


export async function GET (request: NextRequest,Props:Props){
    try {connectToDB()
        const {params } = Props
        const {singlefooditemid } = params

        
       const id =   new   mongoose.Types.ObjectId(singlefooditemid)
       
        const itemExists  =await menuItem.find({_id:id});
        
        if(itemExists){
            
            return NextResponse.json({mssg: itemExists}, {status: 200})
            }
         if(!itemExists){
            
            return NextResponse.json({error: "not found"}, {status: 404})
            
         }
    } catch (error) {
        return NextResponse.json({error: error}, {status: 400})
        
    }
    
   }





export async function PATCH (request: NextRequest,Props:Props){
   
     

    try{
        connectToDB()

        const {params } = Props
        const {singlefooditemid } = params
        
        const data = await request.formData();





        const id =   new   mongoose.Types.ObjectId(singlefooditemid)

        const title =  data.get('title')
       const discription =  data.get('discription')
       const image =  data.get('image')
       const price =   Number(data.get('price'))
        
       const type =  data.get('type')
       const rawsize =  data.get('size')
       const rawextraIngredientPrices =  data.get('extraIngredientPrices')
       const size = rawsize ? JSON.parse(rawsize.toString()) : []
       const extraIngredientPrices = rawextraIngredientPrices
         ? JSON.parse(rawextraIngredientPrices.toString())
         : []
       

  const event =  await menuItem.findOneAndUpdate({_id:id},{title:title,discription:discription,image:image,price:price,type:type,size:size,extraIngredientPrices:extraIngredientPrices})

        return NextResponse.json({mssg: "added"}, {status: 200})
 
        
        
    }
     catch(error ){return NextResponse.json({error: error}, {status: 400})}



    
}
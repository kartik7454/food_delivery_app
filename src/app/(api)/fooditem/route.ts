import { NextRequest ,NextResponse} from "next/server"
import  { connectToDB} from "../../../lib/connectDb.js"
import menuItem from "../../../lib/models.js"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import formidable from "formidable";


export async function GET (request: NextRequest){
    try {connectToDB()
        const itemExists  =await menuItem.find({});
        
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





export async function POST (request: NextRequest,req:NextApiRequest,res:NextApiResponse){
   
     

    try{
        connectToDB()
        const data = await request.formData();







        const title =  data.get('title')
       const discription =  data.get('discription')
       const image =  data.get('image')
       const price =  data.get('price')
        
       const type =  data.get('type')
       const rawsize =  data.get('size')
       const rawextraIngredientPrices =  data.get('extraIngredientPrices')
       const file =  data.get('file')
       
       const size = JSON.parse(rawsize as string);
       const extraIngredientPrices = JSON.parse(rawextraIngredientPrices as string);


     
       
        const event =  await menuItem.create({title:title,discription:discription,image:image,price:price,type:type,size:size,extraIngredientPrices:extraIngredientPrices})
        


        
      
          
        return NextResponse.json({mssg: size}, {status: 200})
 
        
        
    }
     catch(error ){return NextResponse.json({error: error}, {status: 400})}



    
}
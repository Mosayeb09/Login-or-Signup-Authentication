import  {connect} from '@/dbConnection/dbConfig'

import User from '@/models/userModels'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'



import { NextRequest,NextResponse } from 'next/server' 


connect()

export async function POST(request:NextRequest) {
    try {
        const reqbody= await request.json()
       const {email,password}= reqbody
       // validation
       console.log(reqbody);

      const user = await User.findOne({email})

      if (!user) {
        return NextResponse.json({error:"User does not exists"},
            {status: 500})
      }
      console.log('User exits');
      const validPassword= await bcryptjs.compare(password, user.password)
      if(!validPassword){
        return NextResponse.json({error:"Chedk your credentials"},
            {status: 400}
            )
      }

      const tokenData = {
        id:user._id,
        username:user.username,
        email:user.email
      }
     const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET as string,{expiresIn:'1d'})

     const response = NextResponse.json({
        message:'Logged In Success',
        success:true
     })

     response.cookies.set('token',token,{
        httpOnly:true
     })
     return response
        
    } catch (error:unknown) {
        if (error instanceof Error)
            {return NextResponse.json({error:error.message},
            {status: 500}
            )}
        
    }
}


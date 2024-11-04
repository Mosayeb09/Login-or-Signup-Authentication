import  {connect} from '@/dbConnection/dbConfig'

import User from '@/models/userModels'

import { sendEmail } from '@/helpers/mailer'

import { NextRequest,NextResponse } from 'next/server' 
import bcryptjs from 'bcryptjs'

connect()

export async function POST(request : NextRequest) {
    try {
       const reqbody= await request.json()
       const {username,email,password}= reqbody
       // validation
       console.log(reqbody);

      const user=  await User.findOne({email})
      if (user ){
        return NextResponse.json({error:'User already exists'},{status:400})
      }
      const salt = await bcryptjs.genSalt(10);

      const hashedpassword = await bcryptjs.hash(password,salt)

      const newUser =new User({
        username,
        email,
        password:hashedpassword
      })

      const saveUser = await newUser.save()
      console.log(saveUser);

      //send verification email

        await sendEmail({email,emailType:'VERIFY',userId:saveUser._id})

        return NextResponse.json({
            message:"User registration successfully",
            success:true,
            saveUser
        })



    } catch (error: unknown) {
        if (error instanceof Error){
            return NextResponse.json({error: error.message},
                {status:500})

        }
    
       
    }
}
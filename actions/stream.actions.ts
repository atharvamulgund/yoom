'use server'

import { currentUser } from "@clerk/nextjs";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecretKey = process.env.STREAM_SECRET_KEY;

export const tokenProvider =async ()=>{
const user = await currentUser()

if(!user) throw new Error('User is not logged in!')
if(!apiKey) throw new Error("No API KEY")
if(!apiSecretKey) throw new Error("No API SECRET KEY")

const streamClient = new StreamClient(apiKey, apiSecretKey)
const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;

const issued = Math.floor(Date.now() / 1000) - 60

const token = streamClient.createToken(user?.id, exp, issued)
return token
}
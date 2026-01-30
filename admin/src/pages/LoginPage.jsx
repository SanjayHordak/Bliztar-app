import { SignalMediumIcon } from "lucide-react";
import { SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/clerk-react'

export default function LoginPage(){
    return(
        <>
        <div style={{display:"flex",alignItems:"center",textAlign:"center"}}>
            <h1>Login Page</h1>
            <SignedOut>
                <SignInButton mode="modal" />
            </SignedOut>

            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
        </>
    )
}
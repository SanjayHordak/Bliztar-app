import { SignalMediumIcon } from "lucide-react";


export default function LoginPage(){
    return(
        <>
        <div style={{display:"flex",alignItems:"center",textAlign:"center"}}>Login Page</div>
        <SignedOut>
            <SignInButton mode="model"/>
        </SignedOut>

        <SignedIn>
            <UserButton/>
        </SignedIn>
        </>
    )
}
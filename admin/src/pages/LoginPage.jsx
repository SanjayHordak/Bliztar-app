import { SignalMediumIcon } from "lucide-react";


export default function LoginPage(){
    return(
        <>
        <div style={{display:"flex",alignItems:"center",textAlign:"center"}}>
            <h1>Login Page</h1>
        <SignedOut>
            <SignInButton mode="model"/>
        </SignedOut>

        <SignedIn>
            <UserButton/>
        </SignedIn>
        </div>
        </>
    )
}
import { SignalMediumIcon } from "lucide-react";


export default function LoginPage(){
    return(
        <>
        <div style={{display:"flex",alignItems:"center",textAlign:"center"}}>Login Page
            <Signedout>
                <SignIn/>
            </Signedout>

            <SignedIn>
              <UserButton/>
            </SignedIn>
        </div>
        </>
    )
}
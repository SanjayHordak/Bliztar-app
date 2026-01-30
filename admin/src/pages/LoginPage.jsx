import { SignalMediumIcon } from "lucide-react";


export default function LoginPage(){
    return(
        <>
        <div style={{display:"flex",alignItems:"center",textAlign:"center"}}>Login Page
            <Signedout>
                <SignedIn/>
            </Signedout>

            <SignedIn>
              <UserButton/>
            </SignedIn>
        </div>
        </>
    )
}
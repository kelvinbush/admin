import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <SignIn 
    forceRedirectUrl="/"
    signUpUrl="/sign-up"
  />
}
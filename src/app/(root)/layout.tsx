import React, { ReactNode } from 'react'
import StreamVideoProvider from '../../../providers/stremClientProvider'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "YOOM",
  description: "Video calling App",
  icons: {
    icon: "/icons/logo.svg",
  },
};
const RootLayout = ({children}:{children: ReactNode}) => {
  return (
    <main>
      <StreamVideoProvider>
      {children}
      </StreamVideoProvider>
    </main>
  )
}

export default RootLayout

import React, { ReactNode } from 'react'
import StreamVideoProvider from '../../../providers/stremClientProvider'

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

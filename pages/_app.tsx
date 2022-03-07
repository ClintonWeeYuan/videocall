import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import {UserProvider} from '../components/UserContext'

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })

function MyApp({ Component, pageProps }: AppProps) {
  return (<UserProvider><ChakraProvider theme={theme}><Component {...pageProps} /></ChakraProvider></UserProvider>)
}

export default MyApp

import ReactDOM from 'react-dom'
import TagManager from 'react-gtm-module'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import LogoProvider from './contextLogo'

import theme from './theme'
import App from './App'

import './index.css'

TagManager.initialize({ gtmId: 'GTM-KL849C7' })

ReactDOM.render(
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <LogoProvider>
        <App />
      </LogoProvider>
    </ChakraProvider>
  </BrowserRouter>,
  document.getElementById('root')
)

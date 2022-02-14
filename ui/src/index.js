import { ChakraProvider } from '@chakra-ui/react'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import ReactDOM from 'react-dom'
import TagManager from 'react-gtm-module'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import LogoProvider from './contextLogo'
import WidgetProvider from './contextWidget'
import './index.css'
import theme from './theme'

dayjs.locale('fr')

TagManager.initialize({ gtmId: 'GTM-KL849C7' })

ReactDOM.render(
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <WidgetProvider>
        <LogoProvider>
          <App />
        </LogoProvider>
      </WidgetProvider>
    </ChakraProvider>
  </BrowserRouter>,
  document.getElementById('root')
)

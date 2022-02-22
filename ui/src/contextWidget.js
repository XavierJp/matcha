import { createContext, useState } from 'react'

const WidgetContext = createContext({
  widget: false,
  setWidget: () => {},
})

const WidgetProvider = (props) => {
  const [widget, setWidget] = useState(false)
  let state = { widget, setWidget }

  return <WidgetContext.Provider value={state}>{props.children}</WidgetContext.Provider>
}

export { WidgetContext }
export default WidgetProvider

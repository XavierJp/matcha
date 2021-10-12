import { useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'

export default () => {
  let history = useHistory()
  useEffect(() => {
    const { token } = useParams()

    if (!token) {
      history.push('/')
    }

    // send token to back office

    // redirect to confirmation page
  })
}

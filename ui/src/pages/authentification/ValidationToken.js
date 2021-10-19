import { useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { validateToken } from '../../api'
import useAuth from '../../common/hooks/useAuth'

export default () => {
  let history = useHistory()
  const { token } = useParams()
  const [, setAuth] = useAuth()

  useEffect(() => {
    if (!token) {
      history.push('/')
    }

    // send token to back office
    validateToken({ token })
      .then(({ data }) => {
        setAuth(data?.token)
        history.push('/admin')
      })
      .catch(() => {
        history.push('/')
      })
  })

  return <div></div>
}

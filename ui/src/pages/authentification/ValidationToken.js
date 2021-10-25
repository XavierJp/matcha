import { useEffect } from 'react'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { validateToken } from '../../api'
import useAuth from '../../common/hooks/useAuth'

export default () => {
  let history = useHistory()
  const { search } = useLocation()
  const [, setAuth] = useAuth()

  let params = new URLSearchParams(search)
  let token = params.get('token')

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

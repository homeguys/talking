import React from 'react'
import { Link } from 'react-router-dom'
import './login.scss'

export default class Login extends React.Component {
  render () {
    return <div className="login">
      Login
      <Link to='/register'>
        跳转
      </Link>
    </div>
  }
}

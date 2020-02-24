import React, { useState } from 'react'
import axios from 'axios'
import { Button, Form, Label, Input, FormGroup } from 'reactstrap'
import './App.css'

const App = () => {
  const [user, setUser] = useState({
    username: '',
    password: '',
  })
  const [jokes, setJokes] = useState([])

  const handleSubmit = e => {
    e.preventDefault()

    console.log(user)

    axios.post(`http://localhost:3300/api/auth/register`, user).then(res => {
      localStorage.setItem('token', res.data.token).then(() => {
        axios.get('http://localhost:3300/api/jokes').then(res => {
          setJokes(res.data)
        })
      })
    })
  }

  const handleChange = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="SignUp Page">
      <h2>Create an Account</h2>
      <p>Sign up below to access all of our great features.</p>
      <hr />
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="username">Username: </Label>
          <Input
            type="text"
            name="username"
            id="username"
            placeholder="  username"
            value={user.username}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password: </Label>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="  password"
            value={user.password}
            onChange={handleChange}
          />
        </FormGroup>
        <Button>Sign Up + Jokes</Button>
      </Form>
    </div>
  )
}

export default App

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

class App extends Component {
  constructor() {
    super()
    this.state = {
      user: null,
      name: '',
      email: '',
      password: '',
      isAdmin: false,
      view: 'login'
    }
  }

  componentDidMount() {
    axios.get('/auth/currentUser').then(response => {
      this.setState({
        user: response.data
      })
    })
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  toggleView = () => {
    this.setState({
      view: this.state.view === 'login' ? 'register' : 'login'
    })
  }

  register = () => {
    const { name, email, password, isAdmin } = this.state
    axios.post('/auth/register', { name, email, password, isAdmin }).then(response => {
      this.setState({
        user: response.data,
        name: '',
        email: '',
        password: '',
        isAdmin: false
      })
    })
  }

  login = () => {
    const { email, password } = this.state
    axios.post('/auth/login', { email, password }).then(response => {
      console.log(11111111, response)
      this.setState({
        user: response.data,
        email: '',
        password: ''
      })
    })
  }

  render() {
    return (
      <div className="App">
        { 
          this.state.user ? 
          <div>
            <h1>Welcome, {this.state.user.name}</h1>
          </div> : 
          this.state.view === 'login' ? 
          <div className="login">
            <h1>Login</h1>
            email <input type="email" name="email" value={this.state.email} onChange={this.handleChange}/>
            password <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
            <button onClick={this.login}>login</button>
            <p>Don't have an account?  <a href="#/register" onClick={this.toggleView}>Click here</a> to register.</p>
          </div> :
          <div className="register">
            <h1>Registration</h1>
            name <input type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
            email <input type="email" name="email" value={this.state.email} onChange={this.handleChange}/>
            password <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
            <button onClick={this.register}>register</button>
          </div>
        }
      </div>
    );
  }
}

export default App;

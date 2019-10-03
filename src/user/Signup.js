import React, { Component } from 'react';
import {signup} from '../auth';
import {Link} from 'react-router-dom';


class Signup extends Component {
  constructor(){
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      success: false
    }
    this.handleClick = this.handleClick.bind(this);
  }
  handleChange = name => event => {
    this.setState({error: ""});
    this.setState({[name]: event.target.value});
  }
  handleClick(event) {
    event.preventDefault();
    const {name, email , password} = this.state;
    const user = {
      name,
      email,
      password
    }
    // console.log(user)
    signup(user)
      .then(data => {
        if(data.error) this.setState({error: data.error})
        else this.setState({
          error: "",
          name: "",
          email: "",
          password: "",
          success: true
        })
      })
  };


  signupForm = (name, email, password) => (
    <form>
      <div className="form-group">
        <label className="col-sm-2 col-form-label">Name</label>
        <input onChange={this.handleChange("name")} type="text" 
          value={name} className="form-control" placeholder="your name" />
      </div>
      <div className="form-group">
        <label className="col-sm-2 col-form-label">Email</label>
        <input onChange={this.handleChange("email")} type="email" 
          value={email} className="form-control" placeholder="your Email" />
      </div>
      <div className="form-group">
        <label className="col-sm-2 col-form-label">Password</label>
        <input onChange={this.handleChange("password")} type="password" 
          value={password} className="form-control" placeholder="your password" />
      </div>

      <button onClick={this.handleClick} type="submit" className="btn btn-primary">Submit</button>
    </form>
  )

  render() {
    const {name, email, password, error, success} = this.state;
    return (
      <div className="container">
        <legend>Sign Up</legend>
        <div className="alert alert-dismissible alert-primary"
          style={{display: error ? "" : "none"}}>
          <button type="button" className="close" data-dismiss="alert">&times;</button>
          <strong>{error}</strong> .. please.. try submitting again.
        </div>
        <div className="alert alert-dismissible alert-success"
          style={{display: success ? "" : "none"}}>
          <button type="button" className="close" data-dismiss="alert">&times;</button>
          <strong>{error}</strong> . signup is successful. please..
          <Link to="/signin">Sign In</Link>
        </div>

        {this.signupForm(name, email, password)}
      </div>
    )
  }
}

export default Signup;
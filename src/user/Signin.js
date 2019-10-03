import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import SocialLogin from "./SocialLogin";
import {signin,authenticate} from '../auth';

class Signin extends Component {
  constructor(){
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      redirectTo: false,
      loading: false
    }
    this.handleClick = this.handleClick.bind(this);
  }
  handleChange = name => event => {
    this.setState({error: ""});
    this.setState({[name]: event.target.value});
  }


  handleClick(event) {
    event.preventDefault();
    this.setState({loading: true})
    const {email , password} = this.state;
    const user = {
      email,
      password
    }
    // console.log(user)
    signin(user)
      .then(data => {
        if(data.error){
          this.setState({error: data.error, loading: false})
        } else {
          authenticate(data, () => {
            this.setState({redirectTo: true})
          })
        }
      })
  };


  signinForm = (email, password) => (
    <form>
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
    const {email, password, error,redirectTo, loading} = this.state;
      if(redirectTo){
        return <Redirect to="/"/>;
      }
    return (
      <div className="container">
        <legend>Sign In</legend>

        <hr />
          <SocialLogin />
        <hr />

        <div className="alert alert-dismissible alert-primary"
          style={{display: error ? "" : "none"}}>
          <button type="button" className="close" data-dismiss="alert">&times;</button>
          <strong>{error}</strong> .. please.. try again.
        </div>
        {loading ? (
        
          <div className="alert alert-dismissible alert-success">
            <h1>Loading......</h1>
        </div> ) : ( ""
        )}
        {this.signinForm(email, password)}

        <p>
          <Link to="/forgot-password" className="text-danger">
              {" "}
              Forgot Password
          </Link>
        </p>
      </div>
    )
  }
}

export default Signin;
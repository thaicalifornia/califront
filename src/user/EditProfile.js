import React, { Component } from 'react'
import {isAuthenticated} from '../auth';
import {read, update,updateUser} from './apiUser';
import {Redirect} from 'react-router-dom';
import DefaultProfile from '../images/user_avatar.png';

export class EditProfile extends Component {
  constructor(){
    super()
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      error: "",
      redirectToProfile: false,
      fileSize: 0,
      loading: false,
      about: ""
    }
    this.handleClick = this.handleClick.bind(this);
  }
  init = (userId) => {
    const token = isAuthenticated().token
    read(userId, token)
      .then(data => {
        if(data.error){
          this.setState({redirectToProfile: true});
        } else {
          this.setState({
            id: data._id, 
            name: data.name,
            email: data.email,
            error: "",
            about: data.about
            
          })
        }
      })
  }

  componentDidMount(){
    this.userData = new FormData()
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const {name,email,password, fileSize} = this.state
    if(fileSize > 200000){
      this.setState({error: "file is too big"});
      return false
    }
    if(name.length === 0){
      this.setState({error: "name is required", loading: false})
      return false
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({error: "valid Email is required"})
      return false
    }
    if(password.length >= 1 && password.length <= 6){
      this.setState({error: "password must be 6 characters"})
      return false
    }
    return true
  }

  handleChange = name => event => {
    this.setState({error: ""});
    const value = name === 'photo' ? event.target.files[0] :event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;

    this.userData.set(name, value)
    this.setState({[name]: value, fileSize});
  }
  handleClick(event) {
    event.preventDefault();

    this.setState({loading: true})
    if(this.isValid()) {
    const userId = this.props.match.params.userId;
    const token = isAuthenticated().token;

    update(userId, token, this.userData).then(data => {
      if (data.error) {
          this.setState({ error: data.error });
          // if admin only redirect
      } else if (isAuthenticated().user.role === "admin") {
          this.setState({
              redirectToProfile: true
          });
      } else {
          // if same user update localstorage and redirect
          updateUser(data, () => {
              this.setState({
                  redirectToProfile: true
              });
          });
      }
  });
    // update(userId, token, this.userData)
    //   .then(data => {
    //     if(data.error) this.setState({error: data.error})
    //     else 
    //     updateUser(data, () => {
    //       this.setState({
    //       redirecToProfile: true
    //     })
    //     })
    //   })
    }
  };

  signupForm = (name, email,password,about) => (
    <form>
      
      <div className="custom-file">
        <input type="file" onChange={this.handleChange("photo")}
          accept="image/*" className="custom-file-input" id="inputGroupFile02" />
        <label className="custom-file-label" htmlFor="inputGroupFile02">Photo</label>
      </div>
      <div className="form-group has-success">
        <label className="col-sm-2 col-form-label">Name</label>
        <input onChange={this.handleChange("name")} type="text" 
          value={name} className="form-control is-valid" placeholder="your name" />
      </div>
      <div className="form-group">
        <label className="col-sm-2 col-form-label">Email</label>
        <input onChange={this.handleChange("email")} type="email" 
          value={email} className="form-control" placeholder="your Email" />
      </div>
      <div className="form-group has-success">
        <label className="col-sm-2 col-form-label">About</label>
        <textarea onChange={this.handleChange("about")} type="text" 
          value={about} className="form-control" placeholder="your about" />
      </div>
      <div className="form-group">
        <label className="col-sm-2 col-form-label">Password</label>
        <input onChange={this.handleChange("password")} type="password" 
          value={password} className="form-control" placeholder="your password" />
      </div>

      <button onClick={this.handleClick} type="submit" className="btn btn-outline-success">Update</button>
    </form>
  )
  render() {
    const {id,name,email,password,redirectToProfile,
      error, loading, about} = this.state;
      
    if(redirectToProfile){
      return <Redirect to={`/user/${id}`} />
    }

    const photoUrl = id ? 
      `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` 
      : DefaultProfile;

    return (
      <div className="container">
        <h5>Edit Profile</h5>
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

        <img
          style={{height:'200px', width:"auto"}}
          className="img-thumbnail"
          src={photoUrl} 
          onError={i => (i.target.src = `${DefaultProfile}`)} 
          alt={name} />

        {/* {this.signupForm(name,email,password, about)} */}
        {isAuthenticated().user.role === "admin" &&
          this.signupForm(name, email, password, about)}

        {isAuthenticated().user._id === id &&
          this.signupForm(name, email, password, about)}
       

        <br/>
        <br/>
      </div>
    )
  }
}

export default EditProfile

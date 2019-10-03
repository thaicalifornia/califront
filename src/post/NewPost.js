import React, { Component } from 'react'
import {isAuthenticated} from '../auth';
import {create} from './apiPost';
import {Redirect} from 'react-router-dom';


class NewPost extends Component {
  constructor(){
    super()
    this.state = {
      title: "",
      body: "",
      photo: "",
      error: "",
      user: {},
      fileSize: 0,
      loading: false,
      redirecToProfile: false
    }
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
    this.postData = new FormData();
    this.setState({user: isAuthenticated().user})
  }

  isValid = () => {
    const {title,body, fileSize} = this.state
    if(fileSize > 200000){
      this.setState({error: "file is too big"});
      return false
    }
    if(title.length === 0 || body.length === 0){
      this.setState({error: "all fields are required", loading: false})
      return false
    }

    return true
  }

  handleChange = name => event => {
    this.setState({error: ""});
    const value = name === 'photo' ? event.target.files[0] :event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;

    this.postData.set(name, value)
    this.setState({[name]: value, fileSize});
  }
  handleClick(event) {
    event.preventDefault();

    this.setState({loading: true})
    
    if(this.isValid()) {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    create(userId, token, this.postData)
      .then(data => {
        if(data.error) this.setState({error: data.error})
        else {
          this.setState({ 
            loading: false,
            title: "",
            body: "",
            photo: "",
            redirecToProfile: true
          });
        }       
      })
    }
  };

  newPostForm = (title, body) => (
    <form>
      
      <div className="custom-file">
        <input type="file" onChange={this.handleChange("photo")}
          accept="image/*" className="custom-file-input" id="inputGroupFile02" />
        <label className="custom-file-label" htmlFor="inputGroupFile02">Photo</label>
      </div>
      <div className="form-group has-success">
        <label className="col-sm-2 col-form-label">Title</label>
        <input onChange={this.handleChange("title")} type="text" 
          value={title} className="form-control is-valid" placeholder="your title" />
      </div>
      
      <div className="form-group has-success">
        <label className="col-sm-2 col-form-label">Comments</label>
        <textarea onChange={this.handleChange("body")} type="text" 
          value={body} className="form-control" placeholder="typing here" />
      </div>

      <button onClick={this.handleClick} type="submit" 
        className="btn btn-outline-success">Create Post</button>
    </form>
  )
  render() {
    const {title,body,user, error,
      loading, redirecToProfile} = this.state;
      
    if(redirecToProfile){
      return <Redirect to={`/user/${user._id}`} />
    }

    return (
      <div className="container">
        <h5>Create New Post</h5>
        <div className="alert alert-dismissible alert-primary"
          style={{display: error ? "" : "none"}}>
          <button type="button" className="close" data-dismiss="alert">&times;</button>
          <strong>{error}</strong> .. please.. post again.
        </div>

        {loading ? (
        
        <div className="alert alert-dismissible alert-success">
          <h1>Loading......</h1>
        </div> ) : ( ""
        )}
        {this.newPostForm(title, body)}
      </div>
    )
  }
}

export default NewPost;

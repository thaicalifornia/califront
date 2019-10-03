import React, { Component } from 'react';
import {singlePost,update} from './apiPost';
import {isAuthenticated} from '../auth';
import {Redirect} from 'react-router-dom';
import DefaultPost from '../images/woman-b.jpg'

class EditPost extends Component {
  constructor(){
    super()
    this.state = {
      id: "",
      title: "",
      body: "",
      redirecToProfile: false,
      error: "",
      fileSize: 0,
      loading: false
    }
    this.handleClick = this.handleClick.bind(this)
  }
  init = (postId) => {
    singlePost(postId)
      .then(data => {
        if(data.error){
          this.setState({redirecToProfile: true});
        } else {
          this.setState({
            // id: data._id, 
            id: data.postedBy._id,
            title: data.title,
            body: data.body,
            error: ""         
          })
        }
      })
  }

  componentDidMount(){
    this.postData = new FormData()
    const postId = this.props.match.params.postId;
    this.init(postId);
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
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;

    update(postId, token, this.postData)
      .then(data => {
        if(data.error) this.setState({error: data.error})
        else {
          this.setState({ 
            loading: false,
            title: "",
            body: "",
            redirecToProfile: true
          });
        }       
      })
    }
  };

  editPostForm = (title, body) => (
    <form>
      
      <div className="custom-file">
        <input type="file" onChange={this.handleChange("photo")}
          accept="image/*" className="custom-file-input" id="inputGroupFile02" />
        <label className="custom-file-label" htmlFor="inputGroupFile02">Photo</label>
      </div>
      <div className="form-group has-success">
        <label className="col-sm-2 col-form-label">Title</label>
        <input onChange={this.handleChange("title")} type="text" 
          value={title} className="form-control is-valid" placeholder="your name" />
      </div>
      
      <div className="form-group has-success">
        <label className="col-sm-2 col-form-label">Comments</label>
        <textarea onChange={this.handleChange("body")} type="text" 
          value={body} className="form-control" placeholder="typing here" />
      </div>

      <button onClick={this.handleClick} type="submit" 
        className="btn btn-outline-success">Update Post</button>
    </form>
  )

  render() {
    const {id,title,body,redirecToProfile, error,loading} = this.state;

    if(redirecToProfile){
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />
    }

    return (
      <div className="container">
        <h2 className="display-8 mt-5 mb-3">{title}</h2>

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
          src={`${process.env.REACT_APP_API_URL}/post/photo/${id}?${new Date().getTime()}`} 
          onError={i => (i.target.src = `${DefaultPost}`)} 
          alt={title} />

        {/* {this.editPostForm(title,body)} */}

        {isAuthenticated().user.role === "admin" &&
                    this.editPostForm(title, body)}

                {isAuthenticated().user._id === id &&
                    this.editPostForm(title, body)}
      </div>
    )
  }
}

export default EditPost;

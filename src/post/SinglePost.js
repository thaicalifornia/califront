import React, { Component } from 'react';
import {singlePost, remove, like, unlike} from './apiPost';
import DefaultPost from '../images/woman-b.jpg';
import {Link,Redirect} from 'react-router-dom';
import {isAuthenticated} from '../auth';
import Comment from './Comment';


class SinglePost extends Component {
  state = {
    post: "",
    redirectToHome: false,
    redirectToSignin: false,
    like: false,
    likes: 0,
    comments: []
  }
  checkLike = (likes) => {
    const userId = isAuthenticated() && isAuthenticated().user._id
    let match = likes.indexOf(userId) !== -1
    return match;
  }
  componentDidMount = () => {
    const postId = this.props.match.params.postId
    singlePost(postId).then(data => {
      if(data.error){
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments: data.comments
        })
      }
    })
  }

  updateComments = comments => {
    this.setState({comments})
  }

  likeToggle = () => {
    if(!isAuthenticated()){
      this.setState({redirectToSignin: true})
      return false
    }
    let callApi = this.state.like ? unlike : like
    const userId = isAuthenticated().user._id
    const postId = this.state.post._id
    const token = isAuthenticated().token

    callApi(userId,token, postId).then(data => {
      if(data.error){
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length
        })
      }
    })
  }

  deletePost = () => {
    const postId = this.props.match.params.postId
    const token = isAuthenticated().token;
    remove(postId, token).then(data => {
      if(data.error){
        console.log(data.error);
      } else {
        this.setState({redirectToHome: true})
      }
    })
  }
  deleteConfirmed = () => {
    let answer = window.confirm('Are you sure to delete this post ? ')
    if(answer){
      this.deletePost()
    }
  }
  renderPost = (post) => {
    const postedId = post.postedBy ? `/user/${post.postedBy._id}` : ""
    const postedName = post.postedBy ? post.postedBy.name : "Unknow"
    const {like,likes} = this.state;
    
    return (
      <div className="card-body">

        <img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
         alt={post.title} onError={i => (i.target.src = `${DefaultPost}`)}
         className="img-thumbnail mb-3" style={{height: '500px', width: '90%',
         objectFit: 'cover'}}  />

         {like ? (
           <div onClick={this.likeToggle}><i className="fa fa-thumbs-up text-info"
           style={{paddin: '20px', borderRadius: '60%'}}
           /> {" "}  {likes} Like </div>
         ) : (
          <div onClick={this.likeToggle}><i className="fa fa-thumbs-up text-secondary"
           style={{paddin: '20px', borderRadius: '60%'}}
           /> {" "}  {likes} Like </div>
         )}
    
    <div className="card-text">  
 
      <p className="text-info"> {post.body} </p> 
      
      <div className="d-inline-block"> 
        <Link to={`/`} >
          <button type="button" className="badge badge-info mr-2">
            Back </button>
        </Link>

        {isAuthenticated().user 
          && isAuthenticated().user._id === post.postedBy._id &&  (
          <>
          <Link to={`/post/edit/${post._id}`} >
          <button type="button" className="badge badge-danger mr-2">
          edit </button>
        </Link>

          <button onClick={this.deleteConfirmed} className="badge badge-primary">
            delete
          </button> 
          </>
         )}

{isAuthenticated().user &&
        isAuthenticated().user.role === "admin" && (

                <span className="card-body">
                    <Link
                        to={`/post/edit/${post._id}`}
                        className="badge badge-danger mr-3"
                    >
                        Edit Post
                    </Link>
                    <button
                        onClick={this.deleteConfirmed}
                        className="badge badge-primary"
                    >
                        Delete Post
                    </button>
                </span>

        )}
        
      </div>

       <div> 
         <span className="text-success"> Posted by 
        <Link to={`${postedId}`}>{postedName}</Link></span> 
        <br />
        <span className="text-secondary"> 
         on {new Date(post.created).toDateString()} 
        </span>
       </div>

    </div>
  </div>
    )
  }
  render() {

    const {post, redirectToHome,redirectToSignin,comments} = this.state;

    if(redirectToHome){
      return <Redirect to={`/`} />
    } else if(redirectToSignin) {
      return <Redirect to={`/signin`} />
    }

    return (
      <div className="container">
        <h3 className="display-6 mt-5 mb-3">{post.title}</h3>

        {!post ? (
        
        <div className="alert alert-dismissible alert-success">
          <h1>Loading......</h1>
        </div> ) : ( this.renderPost(post)
        )}

          <Comment 
            postId={post._id}
            comments={comments.reverse()}
            updateComments={this.updateComments}
          />
        
      </div>
    )
  }
}

export default SinglePost;

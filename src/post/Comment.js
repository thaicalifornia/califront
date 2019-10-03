import React, { Component } from 'react';
import {comment, uncomment} from './apiPost';
import {isAuthenticated} from '../auth';
import {Link} from 'react-router-dom';
import DefaultProfile from '../images/user_avatar.png'

class Comment extends Component {
  state = {
    text: "",
    error: ""
  }
  handleChange = event => {
    this.setState({error: ""})
    this.setState({text: event.target.value})
  }

  isValid = () => {
    const {text} = this.state
    if(!text.length > 0 || text.length > 200){
      this.setState({
        error: "comment should not be empty and not more than 200 characters long"
      })
      return false
    }
    return true
  }
  addComment = (event) => {
    event.preventDefault();

    if(!isAuthenticated()){
      this.setState({
        error: "please signin to give a comment"
      })
      return false
    }

    if(this.isValid()){
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = this.props.postId;

      comment(userId, token, postId, {text: this.state.text})
        .then(data => {
          if(data.error){
            console.log(data.error)
          } else {
            this.setState({text: ""});
            //dispatch fresh list of comments from singlePost
            this.props.updateComments(data.comments)
          }
        })
      }
  }

  deleteComment = (comment) => {
    const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = this.props.postId;

      uncomment(userId, token, postId, comment)
        .then(data => {
          if(data.error){
            console.log(data.error)
          } else {
            this.props.updateComments(data.comments)
          }
        })
  }
  deleteConfirmed = (comment) => {
    let answer = window.confirm('Are you sure to delete this comment ? ');
    if(answer){
      this.deleteComment(comment)
    }
  }

  render() {
    const {comments} = this.props;
    const {error} = this.state
    return (
      <div>
        <div className="form-group has-success">
          <form onSubmit={this.addComment}>
            <label className="form-control-label" htmlFor="inputSuccess1">Comments</label>
            <input onChange={this.handleChange} value={this.state.text}
              type="text" placeholder="Your Comment here"
              className="form-control is-valid mr-sm-1"/>
            <div className="valid-feedback">nice comment please !</div>
            <button className="btn btn-raised btn-success mt-2">Post
            </button>
          </form>
          {/* {JSON.stringify(comments)} */}

          <div className="alert alert-dismissible alert-primary"
          style={{display: error ? "" : "none"}}>
          <button type="button" className="close" data-dismiss="alert">&times;</button>
          <strong>{error}</strong> .. please.. try again.
          </div>

          <p></p>
          <div className="form-group has-danger">
          <div className=""> {comments.length} Comments</div>
          {comments.map((comment, i) => (
            <div key={i}> 
              <div>
                <div>
                  <Link to={`/user/${comment.postedBy._id}`} >
                    <img style={{height:'30px', width:"auto"}}
                    className="img-thumbnail" 
                    onError={i => (i.target.src = `${DefaultProfile}`)} 
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`} 
                    alt={comment.postedBy.name} />

                  </Link>
                  <span className="lead text-muted mr-2"
                    style={{fontSize:'1.0rem'}}>{comment.text}
                  </span>

                  <div> 
         <span className="text-success"> Posted by {" "}
        <Link to={`/user/${comment.postedBy._id}`}>{comment.postedBy.name} {" "}
        </Link></span> 

        <span className="text-secondary"> 
         on {" "} {new Date(comment.created).toDateString()} 
        </span>

        
          {isAuthenticated().user 
            && isAuthenticated().user._id === comment.postedBy._id &&  (
            <>
            <button onClick={() => this.deleteConfirmed(comment)} className="badge float-right badge-primary">
              Remove Comment
            </button> 
            </>
          )}
        

       </div>
                  <br />
                </div>
              </div>
            </div>
          ))}
          
          </div>

        </div>
      </div>
    )
  }
}

export default Comment;

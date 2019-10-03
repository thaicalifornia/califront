import React, { Component } from 'react';
import {list} from './apiPost';
import DefaultPost from '../images/woman-b.jpg'
import {Link} from 'react-router-dom';


class Posts extends Component {
  constructor(){
    super()
    this.state = {
      posts: []
    }
  }
  componentDidMount() {
    list().then(data => {
      if(data.error){
        console.log(data.error)
      } else {
        this.setState({posts:data})
      }
    })
  }
  renderPosts = (posts) => {
    
    return (
      <div className="row">
      {posts.map((post,i) => {
        const postedId = post.postedBy ? `/user/${post.postedBy._id}` : ""
        const postedName = post.postedBy ? post.postedBy.name : "Unknow"
        return (
          <div className="card-body" key={i}>

            <img src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
             alt={post.title} onError={i => (i.target.src = `${DefaultPost}`)}
             className="img-thumbnail mb-3" style={{height: '200px', width: 'auto'}}  />
        
        <div className="card-text">  
        <p> {post.title.substring(0,35)} </p> 
          <p className="text-info"> {post.body.substring(0,50)} </p> 
          
          <Link to={`/post/${post._id}`} >
            <button type="button" className="badge badge-info">
              Read More</button>
          </Link>
           <div> 
             <span className="text-success"> Posted by  {" "}
            <Link to={`${postedId}`}>{postedName}</Link></span> 
            <br />
            <span className="text-secondary"> 
             on {new Date(post.created).toDateString()} 
            </span>
           </div>
          
            

          
        </div>
      </div>
        )
  })} 
    </div>
    )
  }
     
  render() {
    const {posts} = this.state;
    return (
      <div className="container">
        <div className="card border-dark mb-3"
           style={{maxWidth: "80rem"}}>
        <div className="card-header"> 
        {!posts.length ? ' Loading..' : "All Posts"} </div>
          {this.renderPosts(posts)}
      </div>
      </div>
    )
  }
}

export default Posts;

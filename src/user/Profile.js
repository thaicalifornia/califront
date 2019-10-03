import React, { Component } from 'react';
import {isAuthenticated} from '../auth';
import {Redirect, Link} from 'react-router-dom'
import {read } from './apiUser';
import DefaultProfile from '../images/user_avatar.png'
import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';
import {listByUser} from '../post/apiPost';

class Profile extends Component {
  constructor(){
    super()
    this.state = {
      user: {following: [], followers: []},
      redirectToSignin: false,
      following: false,
      error: "",
      posts: []
    }
  }
  checkFollow = (user) => {
    const jwt = isAuthenticated()
    const match = user.followers.find(follower => {
      return follower._id === jwt.user._id
    })
    return match;
  }
  clickFollowButton = callApi => {
    const userId = isAuthenticated().user._id;
    // const userId = this.props.match.params.userId;
    const token = isAuthenticated().token;

    callApi(userId, token, this.state.user._id).then(data => {
      if(data.error){
        this.setState({error: data.error})
      } else {
        this.setState({user: data, following: !this.state.following})
      }
    })
  }
  init = (userId) => {
    const token = isAuthenticated().token
    read(userId, token)
      .then(data => {
        if(data.error){
          this.setState({redirectToSignin: true});
        } else {
          let following = this.checkFollow(data);
          this.setState({user: data, following});
          this.loadPosts(data._id);
        }
      })
  }
  loadPosts = userId => {
    const token = isAuthenticated().token;
    listByUser(userId, token).then(data => {
      if(data.error) {
        console.log(data.error)
      } else {
        this.setState({posts: data})
      }
    })
  }

  componentDidMount(){
    const userId = this.props.match.params.userId;
    this.init(userId);
  }
  //componentWillReceiveProps
  componentDidUpdate(props){
    const userId = props.match.params.userId;
    this.init(userId);
  }
  render() {
    const {redirectToSignin, user, posts} = this.state;
    if(redirectToSignin) return <Redirect to="/signin" />;

    const photoUrl = user._id ? 
      `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` 
      : DefaultProfile;

    return (
     <div className="container">
      <div className="card">
        <div className="card-body">
        <h4 className="card-title"> Profile </h4>

        <table className="table table-hover">
        
        <tbody>
          <tr>
            <td scope="row">
              <img
        style={{height:'200px', width:"auto"}}
        className="img-thumbnail"
        src={photoUrl}
        onError={i => (i.target.src = `${DefaultProfile}`)} 
        alt={user.name} />

        
        </td>

        <td>
          <h6 className="card-subtitle mb-2 text-muted"> {user.name} </h6>
            <p className="card-text"> Email: {user.email} </p>
            <p className="text-success">{user.about}</p>
            <div > Joined: {`${new Date(user.created).toDateString()}`} </div>

            <div className="card-text"> {isAuthenticated().user && isAuthenticated().user._id ===
              user._id ? (
              <div className="card-link"> 
              <Link to={`/post/create`} 
                  className="badge badge-info mr-3"> Create Post </Link>

                <Link to={`/user/edit/${user._id}`} 
                  className="badge badge-danger mr-3"> Edit Profile </Link>
                  
                  <DeleteUser userId={user._id}/>
              </div>
            ) : (
              <FollowProfileButton following={this.state.following}
                onButtonClick={this.clickFollowButton} />
            )} </div>

<div>
    {isAuthenticated().user &&
        isAuthenticated().user.role === "admin" && (
            
                <div className="card-body">
                    
                    <p className="mb-2 text-danger">
                        Edit/Delete as an Admin
                    </p>
                    <Link
                        className="badge badge-warning mr-5"
                        to={`/user/edit/${user._id}`}
                    >
                        Edit Profile
                    </Link>
                    <DeleteUser userId={user._id} />
                </div>
            
        )}
</div>
        </td>
          </tr>
        </tbody>
      </table>

            <ProfileTabs 
              followers={user.followers} 
              following={user.following}
              posts={posts} />
        </div>
      </div> 
    </div>
    )
  }
}

export default Profile;

import React, { Component } from 'react';
import {findPeople, follow} from './apiUser';
import DefaultProfile from '../images/user_avatar.png'
import {Link} from 'react-router-dom';
import {isAuthenticated} from '../auth'

class FindPeople extends Component {
  constructor(){
    super()
    this.state = {
      users: [],
      error: "",
      open: false
    }
  }
  componentDidMount() {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    findPeople(userId, token).then(data => {
      if(data.error){
        console.log(data.error)
      } else {
        this.setState({users:data})
      }
    })
  }
  clickFollow = (user, i) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    follow(userId, token, user._id)
    .then(data => {
      if(data.error){
        this.setState({ error: data.error})
      } else {
        let toFollow = this.state.users
        toFollow.splice(i,1)
        this.setState({
          users: toFollow,
          open: true,
          followMessage: `Following ${user.name}`
        })
      }
    })
  }
  renderUsers = (users) => (
    <div className="row">
      {users.map((user,i) => (
      <div className="card-body" key={i}>

        <img
          style={{height:'100px', width:"auto"}}
          className="img-thumbnail"
          src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` }
          onError={i => (i.target.src = `${DefaultProfile}`)} 
          alt={user.name} />

        <div className="card-text">  
          <p> {user.name} </p> 
          <p className="text-info"> {user.email} </p> 
          <Link to={`/user/${user._id}`} >
            <button type="button" className="badge badge-success mr-3">
              View Profile</button>
          </Link>

          <button onClick={() => this.clickFollow(user, i)} type="button" 
        className="badge badge-info">Follow</button>
        </div>
      </div>
      ))} 
    </div> 
  )
  render() {
    const {users,open,followMessage} = this.state;
    return (
      <div className="container">
        <div className="card border-dark mb-3"
           style={{maxWidth: "70rem"}}>
        <div className="card-header">Find Someone</div>

        {open && (<div className="alert alert-success"> 
          {followMessage}</div>)}

          {this.renderUsers(users)}
      </div>
      </div>
    )
  }
}

export default FindPeople;

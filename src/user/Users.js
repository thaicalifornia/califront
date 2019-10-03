import React, { Component } from 'react';
import {list} from './apiUser';
import DefaultProfile from '../images/user_avatar.png'
import {Link} from 'react-router-dom';


class Users extends Component {
  constructor(){
    super()
    this.state = {
      users: []
    }
  }
  componentDidMount() {
    list().then(data => {
      if(data.error){
        console.log(data.error)
      } else {
        this.setState({users:data})
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
            <button type="button" className="badge badge-info mr-3">
              View Profile</button>
          </Link>
        </div>
      </div>
      ))} 
    </div> 
  )
  render() {
    const {users} = this.state;
    return (
      <div className="container">
        <div className="card border-dark mb-3"
           style={{maxWidth: "70rem"}}>
        <div className="card-header">Users</div>
          {this.renderUsers(users)}
      </div>
      </div>
    )
  }
}

export default Users;

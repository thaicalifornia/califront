import React, { Component } from 'react';
import {follow, unfollow} from './apiUser';

class FollowProfileButton extends Component {

  followClick = () => {
      this.props.onButtonClick(follow)
    }
  unFollowClick = () => {
    this.props.onButtonClick(unfollow)
  }
  render() {
    
    return (
      <div>
        {!this.props.following ? ( 
        <button onClick={this.followClick} type="button" 
        className="badge badge-info mr-2">Follow</button>
        ) : (
        <button onClick={this.unFollowClick} type="button" 
        className="badge badge-secondary">UnFollow</button>
        )}
        </div>
    )
  }
}

export default FollowProfileButton;

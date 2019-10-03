import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import DefaultProfile from '../images/user_avatar.png'


class ProfileTabs extends Component {
  render() {
    const {following,followers,posts} = this.props;
    return (
      
        <div>
          <table className="table table-hover">
      <thead>
        <tr>
          <th scope="col">Followers</th>
          <th scope="col">Following</th>
          <th scope="col">Posts</th>      
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>

          <div>
          {followers.map((person, i) => (
            <div key={i}> 
              <div>
                <div>
                  <Link to={`/user/${person._id}`} >
                    <img style={{height:'50px', width:"auto"}}
                    className="img-thumbnail"
                    onError={i => (i.target.src = `${DefaultProfile}`)} 
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`} alt={person.name} />
                    <div style={{fontSize:'0.8rem'}} className="text-muted">{person.name}</div>
                    
                  </Link>
                  
                </div>
              </div>
            </div>
          ))}
          </div>
          </td>
          <td>
            
          <div>
          {following.map((person, i) => (
            <div key={i}> 
              <div>
                <div>
                  <Link to={`/user/${person._id}`} >
                    <img style={{height:'50px', width:"auto"}}
                    className="img-thumbnail"
                    onError={i => (i.target.src = `${DefaultProfile}`)} 
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`} alt={person.name} />
                    <div style={{fontSize:'0.8rem'}} className="text-muted">{person.name}</div>
                    
                  </Link>
                  
                </div>
              </div>
            </div>
          ))}
          </div>
          </td>
          <td> 
                  {/*   posts  */}
          <div> 
          {posts.map((post, i) => (
            <div key={i}> 
              <div>
                <div>
                  <Link to={`/post/${post._id}`} >
           
                    <div style={{fontSize:'0.8rem'}} 
                    className="text-muted">{post.title.substring(0,25)}  </div>
                    
                  </Link>
                  
                </div>
              </div>
            </div>
          ))}
           </div>

          </td>
        </tr>
      </tbody>
    </table> 

        </div>       
      
      
    
    )
  }
}

export default ProfileTabs;

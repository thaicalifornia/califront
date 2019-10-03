import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {signout, isAuthenticated} from '../auth';

const isActive = (history, path) => {
  if(history.location.pathname === path)
  return {color: "#ffffff"}
  else return {color: "#f9d5d4"}
}


function Navbar({history}) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <nav className="navbar-brand">
         <Link to="/" style={isActive(history, "/")}>Thai California </Link>
        </nav>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarColor01">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link to="/users" className="nav-link" style={isActive(history, "/users")}>Users</Link>
          </li>
        
          
         {!isAuthenticated() && (
           <>
           
            <li className="nav-item">
              <Link to="/signin" className="nav-link" style={isActive(history, "/signin")}>SignIn</Link>
            </li>
            <li className="nav-item">
              <Link to="/signup" className="nav-link" style={isActive(history, "/signup")}>SignUp</Link>
            </li>
          </>
         )}
         {isAuthenticated() && (
           <>
             <li className="nav-item active">
            <Link to="/findpeople" className="nav-link" style={isActive(history, "/findpeople")}>Find People</Link>
          </li>
          <li className="nav-item active">
            <Link to="/post/create" className="nav-link" style={isActive(history, "/post/create")}>Create Post</Link>
          </li>
          
           <li className="nav-item">
            <span className="nav-link" style={{ cursor: 'pointer', color: '#fff' }}
            onClick={() => signout(() => history.push('/'))}>SignOut</span>
          </li>

          <li className="nav-item">
              <Link className="nav-link" to={`/user/${isAuthenticated().user._id}`}
              style={isActive(history,`/user/${isAuthenticated().user._id}`)}>
                {`${isAuthenticated().user.name}'s profile`}
              </Link>
          </li>
          </>
         )}
          
          {isAuthenticated() && isAuthenticated().user.role === "admin" && (
            <li className="nav-item">
                <Link
                    to={`/admin`}
                    style={isActive(history, `/admin`)}
                    className="nav-link"
                >
                    Admin
                </Link>
            </li>
        )}
        </ul>
      </div>
    </nav>
    <p></p>
    </div>
  )
}
export default withRouter(Navbar);


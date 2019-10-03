import React, { Component } from 'react';
import Posts from '../post/Posts'
import Footer from './Footer';

class Home extends Component {
  render() {
    return (
      <div>
        <div className="jumbotron">
          <h1 className="display-7">Hello Homo sapiens !</h1>
          {/* <hr className="my-4" /> */}
          <p className="lead">  Algorithms</p>
          <p className="lead text-success">
            are unambiguous specifications for performing calculation, 
            data processing, automated reasoning, and other tasks.</p>
          
        </div>
        <div className="container">
          <Posts />
          <p></p>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home;

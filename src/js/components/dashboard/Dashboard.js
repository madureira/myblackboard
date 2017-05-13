import React, { Component } from 'react';
import Board                from './Board';

class Dashboard extends Component {

  render() {
    return (
      <div>
        <section id='app-content'>
          <Board/>
        </section>
      </div>
    )
  }

}

export default Dashboard;

import React, { Component } from 'react'
import Form from '../Form/Form'
import Navbar from '../Navbar/Navbar'
import Footer from "../Footer/Footer";
import { withRouter } from 'react-router';
class Home extends Component {
    render() {
        return (
            <div>
            <div className="form mt-4">
              <h2>Fund Transfer</h2>
              <Form history={this.props.history}/>
            </div>
          </div>
        )
    }
}
export default withRouter(Home);
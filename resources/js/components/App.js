import React, { Component } from "react";
import Form from "./Form/Form";
import Navbar from "./Navbar/Navbar";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import SuccessPage from "./SuccessPage/SuccessPage";
import Home from "./Home/Home";
import Footer from "./Footer/Footer";
export default class App extends Component {
    render() {
        return (
            <>
                <Navbar />
                <Switch>
                    <Route exact path="/" component={Home}></Route>
                    <Route exact path="/success" component={SuccessPage}></Route>
                </Switch>
                {/*<Footer />*/}
            </>
        );
    }
}

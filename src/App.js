import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import RestaurantAPI from './api'
import './App.css';

const styles = {
    margin: '0 auto',
    textAlign: 'center',
    width: '320px'
}

class Logo extends Component {
    render(){
        return (
            <div id="logo">makan<span>APA</span>?</div>
        )
    }
}

class Footer extends Component {
    render() {
        return (
            <div id="footer">Crafted by YT. Accomplished with ReactJS</div>
        )
    }
}


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        }

        this.handleClick = this.handleClick.bind(this);
    }

    // check is the props contains user name, set redirect to true if yes.
    // componentWillMount() is React's Life cycle Method, it will triggers before render() did.
    componentWillMount() {
        if(this.props.something != 'guest'){
            this.setState({
                redirect: true
            });
        }
    }

    handleClick(){
        if(this.input.value == ''){
            // prompt error
            alert('Please enter your name');
        } else {
            this.setState({
                redirect: true
            });
            this.props.registerUsername(this.input.value);
        }


    }

    render() {
        //console.log(this.props.something);

        if (this.state.redirect) {
            //console.log(this.state.username);
            return <Redirect push to="/home" />;
          } else {
            return (
                <div>
                    <Logo />
                    <div id="container">
                        <h1>Welcome {this.props.something}</h1>
                        <p>
                            May I have your name?
                        </p>
                        <p>
                            My name is:
                        </p>
                        <p>
                            <input type="text" ref={(node) => {this.input = node}} placeholder="type your name here..." />
                        </p>
                        <button type="button" onClick={this.handleClick}>Go</button>
                    </div>
                    <Footer />
                </div>
            )
          }
        
    }
}


class Home extends Component {
    constructor(props){
        super(props);

        this.state = {
            redirect: false
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
        
    }

    handleClick(){
        document.getElementById('item-name').classList.remove('highlight');
        this.animateCarousel();
    }

    handleLogOut() {
        this.props.registerUsername('');
        this.setState({
            redirect: true
        });
    }

    animateCarousel(){
        var randomAnswer;
        var carousel = setInterval(function() { 
            randomAnswer = RestaurantAPI[Math.floor(Math.random() * RestaurantAPI.length)];
            document.getElementById('item-name').innerHTML = randomAnswer;
        }.bind(this), 100);

        setTimeout(function(){ 
            clearInterval(carousel);
            document.getElementById('item-name').innerHTML = randomAnswer;
            document.getElementById('item-name').classList.add('highlight');
        }, 3000);
    }



    render() {
        if(this.state.redirect){
            return <Redirect push to="/" />;
        } else {
            return (
                <div>
                    <Logo />
                    <div id="container">
                        <h1>Headache?</h1>
                        <p>No idea what do you want to have for your lunch / dinner?</p>
                        <p>
                            No worries, <strong>{this.props.something}</strong><br />
                            Let me decide for you!
                        </p>
                        <button onClick={this.handleClick}>Choose for me!</button>

                        <div id="item-name">
                            ...
                        </div>
                        <button onClick={this.handleLogOut}>Log out</button>
                    </div>
                    <Footer />
                </div>
            )
        }
    }
}



class App extends Component {
    constructor(){
        super();
        let user_name = localStorage.getItem('makanAPA');
        user_name = (user_name) ? user_name : 'guest';

        this.state = {
            username: user_name
        }

        this.registerUsername = this.registerUsername.bind(this);
    }

    registerUsername(param) {
        if(param != ''){
            // store cache
            this.setState({
                username: param
            });
            localStorage.setItem('makanAPA', param);
        } else {
            // clear cache
            this.setState({
                username: 'guest'
            });
            localStorage.removeItem('makanAPA');
        }
    }

  render() {
    return (
        <BrowserRouter>
            <div style={styles}>
                <Route exact path="/" render={() => (<Login something={this.state.username} registerUsername={this.registerUsername} />)} />
                <Route path="/home" render={() => (<Home something={this.state.username} registerUsername={this.registerUsername} />)} />
            </div>
        </BrowserRouter>
    );
  }
}

export default App;

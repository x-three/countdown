import React, { Component } from 'react';
import FlipNumber from './FlipNumber';
import Time from '../modules/time';


class App extends Component {
    constructor(props) {
        super(props);
        this.time = new Time()
        this.state = this.time.getState();
    }


    componentDidMount() {
        setTimeout(() => {
            this.setState(this.time.getState());
        }, 0);
        this.idInterval = setInterval(() => {
            this.setState(this.time.getState());
        }, 1000);
    }


    componentWillUnmount() {
        clearInterval(this.idInterval);
    }


    render() {
        return <>
            {this.time.showDays &&
                <div className="l-group">
                    <FlipNumber value={this.state.days} length={3}/>
                </div>
            }
            <div className="l-group">
                <FlipNumber value={this.state.hours} length={2}/>
                <FlipNumber value={this.state.minutes} length={2}/>
                <FlipNumber value={this.state.seconds} length={2}/>
            </div>
        </>
    }
}


export default App;
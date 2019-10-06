import $ from 'jquery';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cssAnimate from '../modules/css-animate';


class FlipDigit extends Component {
    constructor(props) {
        super(props);
        this.state = { curValue: this.props.value, newValue: null };
        this.rDigit = React.createRef();
    }


    static getDerivedStateFromProps(props, state) {
        if (state.curValue !== props.value && state.newValue == null) {
            return { newValue: props.value };
        }
        return null;
    }


    componentDidUpdate() {
        const $el = $(this.rDigit.current);
        if (this.state.newValue != null && !cssAnimate.is($el)) {
            cssAnimate.queue($el, 'fx-flip', true, () => {
                this.setState({ curValue: this.state.newValue, newValue: null });
            });
        }
    }


    render() {
        if (this.state.newValue == null) {
            var jParts = <>
                <div className="e-part m-top"><span>{this.state.curValue}</span></div>
                <div className="e-part m-bottom"><span>{this.state.curValue}</span></div>
            </>
        } else {
            jParts = <>
                <div className="e-part m-top m-cur"><span>{this.state.curValue}</span><i></i></div>
                <div className="e-part m-bottom m-cur"><span>{this.state.curValue}</span><i></i></div>
                <div className="e-part m-top m-new"><span>{this.state.newValue}</span></div>
                <div className="e-part m-bottom m-new"><span>{this.state.newValue}</span></div>
            </>
        }
        return <div className="b-flip-digit" ref={this.rDigit}>{jParts}</div>
    }
}


FlipDigit.propTypes = {
    value: PropTypes.number.isRequired
};


export default FlipDigit;
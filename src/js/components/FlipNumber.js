import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlipDigit from './FlipDigit';


class FlipNumber extends Component {
    render() {
        const value = this.getValue();
        if (value == null) return null;
        const digits = value.split('').map((el, i) => <li key={i}><FlipDigit value={+el}/></li>);
        return <ul className="b-flip-number">{digits}</ul>;
    }


    getValue() {
        const str = this.props.value.toString();
        if (!/^[0-9]+$/.test(str) || this.props.length <= 0) {
            return null;
        }
        if (str.length > this.props.length) {
            return str.substring(str.length - this.props.length);
        }
        return new Array(this.props.length - str.length).fill(0).join('') + str;
    }
}


FlipNumber.propTypes = {
    value: PropTypes.number.isRequired,
    length: PropTypes.number.isRequired
};


export default FlipNumber;
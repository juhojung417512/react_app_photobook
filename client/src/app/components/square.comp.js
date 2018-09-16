import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Square extends Component {
    static propTypes = {
        black: PropTypes.bool
    };

    render() {
        const { black } = this.props;
        const fill = black ? 'black' : 'white';
        const stroke = black ? 'white' : 'black';

        return (
        <div className="squre" style={{backgroundColor: fill, color: stroke}}>
            {this.props.children}
        </div>
        );
    }
}
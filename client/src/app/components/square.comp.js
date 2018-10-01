import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Square extends Component {
    static propTypes = {
        black: PropTypes.bool
    };

    render() {
        return (
        <div className="squre">
            {this.props.children}
        </div>
        );
    }
}
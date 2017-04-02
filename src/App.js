import React, { Component } from 'react';
import { connect } from 'react-redux'

import { Add } from './actions'

import Board from './Board'

const App = ({ data, Add }) => (
    <div>
        <div>{data}</div>
        <div onClick={Add}> add </div>
        <Board/>
    </div>
)


export default connect(
    state => ({ ...state }),
    dispatch => ({
        Add: () => dispatch( Add() )
    })
)(App)

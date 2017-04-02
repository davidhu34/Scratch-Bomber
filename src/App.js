import React, { Component } from 'react';
import { connect } from 'react-redux'

import { Add, runStage } from './actions'

import Board from './Board'

const App = ({ data, runStage }) => (
    <div>
        <div>{data}</div>
        <div onClick={runStage}> run one stage </div>
        <Board/>
    </div>
)


export default connect(
    state => ({ ...state }),
    dispatch => ({
        runStage: () => dispatch( runStage() )
    })
)(App)

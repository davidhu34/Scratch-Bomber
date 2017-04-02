import React, { Component } from 'react'
//import { connect } from 'react-redux'

import GameObject from './GameObject'

const Board = () => {
    const objs = [
        <GameObject status={{
            position: { x:10, y:50 },
            direction: 'left'
        }}/>
    ]
    return <div className='container'
        style={{
            border: '1px solid black',
            backgroundColor: 'rgba(0,0,0,0.3)',
            width: 600,
            height: 600
        }}>
        Board
        {objs}
    </div>
}

export default Board

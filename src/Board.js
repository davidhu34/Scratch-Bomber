import React, { Component } from 'react'
import { connect } from 'react-redux'

import GameObject from './GameObject'

const Board = ({ gameObjects }) => {
    const objs = gameObjects.map( go =>
        <GameObject status={{...go}} />
    )
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

export default connect(
    state => {
        const game = state.game
        const gos = game.gameObjects
        const gosDetail = gos.map( go => {
            switch (go.type) {
                case 'player':
                    return {
                        ...go,
                        ...game.players[go.linkId]
                    }
                default:
                    return {...go}
            }
        })
        return {
            gameObjects: gosDetail
        }
    }
)(Board)

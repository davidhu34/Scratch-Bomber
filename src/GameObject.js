import React, { Component } from 'react'
const rotation = dir => {
    switch (dir) {
        case 'right':
            return 'rotate(90deg)'
        case 'down':
            return 'rotate(180deg)'
        case 'left':
            return 'rotate(270deg)'
        case 'up':
        default:
            return ''
    }
}
const GameObject = ({ status }) => {
    const { position, direction } = status

    return <div
        style={{
            position: 'absolute',
            width: 50,
            height: 50,
            left: position.x,
            top: position.y
        }}>
        <img src='falcon.png'
            style={{
                width: '100%',
                height: '100%',
                transform: rotation(direction)
            }}/>
    </div>
}
export default GameObject

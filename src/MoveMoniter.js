import React, { Component } from 'react';
import { connect } from 'react-redux'

const MoveMoniter = ({ players }) => {
    const ps = players.map(p => ({
        ...p,
        moves: p.moves.map( move => {
            for (let i = 0; i < p.moniter.length; i++)
                if (p.moniter[i].idx === move.idx)
                    return {...move, monitering: true}
            return move
        })
    }))
    const moniterColor = e =>
        <span style={{color: 'blue'}}>{e}</span>
    const statement = move => {
        const element = (move.type === 'forward')?
            <li>{move.type}</li>
        : (move.type === 'turn')?
            <li>{move.type + move.clockwise? ' right': ' left'}</li>
        : <li>~</li>
        return (move.monitering)? moniterColor(element): element
    }
    const list = moves => {
        const clause = ['if', 'else', 'loop']
        let ms = moves
        let elements = []
        while (ms.length > 0) {
            const move = ms[0]
            if (clause.indexOf(move.type) > -1) {
                const stat = move.type + ((move.times)? " "+String(move.times):'')
                const el = <li>{move.monitering? moniterColor(stat): stat}
                    <ul>{list(ms.slice(1, move.size+1))}</ul>
                </li>
                elements.push(el)
                for (let i = 0; i < move.size+1; i ++)
                    ms.shift()
            } else {
                const el = statement(move)
                elements.push( move.monitering? moniterColor(el): el )
                ms.shift()
            }
        }
        return elements
    }
    const moniters = ps.map( p => {
        return <div>{p.name}
            <ul>{list(p.moves)}</ul>
        </div>
    })
    return <div>
        {moniters}
    </div>
}

export default connect(
    state => {
        const ps = state.game.players
        const gos = state.game.gameObjects
        let moniters = {}
        Object.keys(gos).map( gok => {
            const go = gos[gok]
            if(go.type === 'player')
                moniters[go.linkId] = go.moniter
        })
        console.log(moniters)
        return {
            players: Object.keys(ps).map( pk => ({
                ...ps[pk], moniter: moniters[ps[pk].id]
            }) )
        }
    }
)(MoveMoniter)

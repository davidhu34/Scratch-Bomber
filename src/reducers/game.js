const initGame = {
    gameObjects: [{
        type: 'player',
        linkId: '1',
        position: { x: 1, y: 3 },
        direction: 'up',
        stagedMoves: [{
            type: 'forward'
        }]
    }, {
        type: 'player',
        linkId: '2',
        position: { x: 5, y: 2 },
        direction: 'left',
        stagedMoves: [{
            type: 'loop',
            size: 5,
            times: 7
        },{
            type: 'if',
            size: 2,
            condition: {
                watch: 'direction',
                expect: ['right','left']
            }
        },{
            type: 'forward'
        },{
            type: 'turn',
            clockwise: false
        },{
            type: 'else',
            size: 1
        },{
            type: 'turn',
            clockwise: false
        }]
    }],
    players: {
        '1' :{
            id: '1',
            name: 'P1'
        },
        '2': {
            id: '2',
            name: 'P2'
        }
    },
    resources: {
    }
}
const compileNextMove = status => {
    const clause = ['loop', 'if', 'else']
    let moves = status.stagedMoves
    if(moves.length > 0) {
        let first = moves[0]
        while ( first && clause.indexOf(first.type) > -1) {
            if (first.type === 'loop') {
                const {size, times} = first
                moves = (times > 1)? [
                    ...moves.slice(1, size+1),
                    {...first, times: times-1},
                    ...moves.slice(1)
                ] : moves.slice(1)
            } else if (first.type === 'if') {
                const size = first.size
                const {watch, expect} = first.condition
                const elseMove = moves[size+1] && moves[size+1].type === 'else'?
                    moves[size+1]: null
                const valid = expect.indexOf(status[watch]) > -1
                moves = valid? (
                    elseMove? [
                        ...moves.slice(1, size+1),
                        ...moves.slice(1+size+1+elseMove.size)
                    ] : moves.slice(1)
                ) : (
                    elseMove? moves.slice(1+size+1)
                        : moves.slice(1+size)
                )
            }
            first = moves[0]
        }
    }
    return moves
}
const nextStatus = status => {
    const moves = compileNextMove(status)
    console.log('compiled',moves)
    if (moves.length > 0) {
        const m = moves[0]
        switch (m.type) {
            case 'turn':
                const clock = {
                    'up': { prev: 'left', next: 'right' },
                    'right': { prev: 'up', next: 'down' },
                    'down': { prev: 'right', next: 'left' },
                    'left': { prev: 'down', next: 'up' },
                }
                const strike = m.clockwise? 'next': 'prev'
                return {
                    ...status,
                    direction: clock[status.direction][strike],
                    stagedMoves: moves.slice(1)
                }
            case 'forward':
            default:
                let pos = status.position
                switch (status.direction) {
                    case 'right':
                        pos.x += 1
                        break
                    case 'down':
                        pos.y += 1
                        break
                    case 'left':
                        pos.x -= 1
                        break
                    case 'up':
                    default:
                        pos.y -= 1
                        break
                }
                return {
                    ...status,
                    position: pos,
                    stagedMoves: moves.slice(1)
                }
        }
    } else return status
}

export const game = ( state = initGame, action ) => {
    switch (action.type) {
        case 'RUN_STAGE':
            return {
                ...state,
                gameObjects:
                    state.gameObjects.map( go => nextStatus(go))
            }
        default:
            return state
    }
}

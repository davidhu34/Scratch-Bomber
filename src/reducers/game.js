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
            size: 3,
            times: 4
        },{
            type: 'forward'
        },{
            type: 'forward'
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
        console.log(moves, moves[0], first)
        while (clause.indexOf(moves[0].type) > -1) {
            if (first.type === 'loop') {
                const {size, times} = first
                moves = (times > 1)? [
                    ...moves.slice(1, size+1),
                    {...first, times: times-1},
                    ...moves.slice(1)
                ] : moves.slice(1)
            } else if (first.type === 'if') {
                const {condition, size} = first.size
                const elseMove = moves[size+1].type === 'else'?
                    moves[size+1]: null
                moves = status[condition]? (
                    elseMove? [
                        ...moves.slice(1, size+1),
                        ...moves.slice(1+size+1+elseMove.size)
                    ] : moves.slice(1, size+1)
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
                console.log(status.direction)
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
    console.log(state)
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

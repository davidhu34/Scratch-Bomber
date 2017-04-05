const initGame = {
    gameObjects: {
        players: ['1','2']
    },
    players: {
        '1' :{
            id: '1',
            name: 'P1',
            stage: {
                run: false,
                at: [],
                queue: [{
                    idx: 1,
                    type: 'forward'
                }]
            }
        },
        '2': {
            id: '2',
            name: 'P2',
            stage: {
                run: false,
                at: [],
                queue: [{
                    idx: 1,
                    type: 'loop',
                    size: 5,
                    times: 7
                },{
                    idx: 2,
                    type: 'if',
                    size: 3
                    ifSize: 2,
                    elseSize: 1,
                    condition: {
                        watch: 'direction',
                        expect: ['right','left']
                    }
                },{
                    idx: 3,
                    type: 'forward'
                },{
                    idx: 4,
                    type: 'turn',
                    clockwise: false
                },{
                    idx: 6,
                    type: 'turn',
                    clockwise: false
                }]
            }
        }
    },
    resources: {
    }
}
const compileNextMove = status => {
    const clause = ['loop', 'if', 'else']
    let moniter = []
    let moves = status.stagedMoves
    if(moves.length > 0) {
        let first = moves[0]
        while ( first && clause.indexOf(first.type) > -1) {
            if (first.type === 'loop') {
                const {size, times} = first
                moniter.push(first)
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
                if (valid) moniter.push(first)
                else if (elseMove) moniter.push(elseMove)
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
        moniter.push(first)
    }
    return { moves, moniter }
}
const nextQIdx = (q, oldAt) => {
    let at = oldAt
    // [ loop1 if2 forward3]
    while (at.length > 1) {
        const block = q[at.shift()]
        const end_of_if = block.type === 'if_else'
            && next === block.idx + block.ifSize + 1
        const end_of_loop = block.type === 'loop'
            && block.timesLeft === 0
        const end_of_scope = next > block.idx + block.size

        if (end_of_scope && !end_of_loop)
            return at.unshift(block.type === 'loop'?
                block.idx: next // eo loop:eo else(if_else without else)
            )
        else if (end_of_if) // eo if
            next = block.idx + block.size + 1
        else next = block.idx + 1 // statement
    }
    return at

}
const stage = (state, action) => {
    const clause = ['loop', 'if_else']
    const status = action.status
    switch (action.type) {
        case 'RUN_STAGE':
            let qChange = {}
            const q = state.queue
            let at = nextQIdx(q, state.at)

            let curId = at[0]+1
            while (curId <= q.length) {
                const cur = q[curId]
                if (cur.type === 'loop') {
                    qChange[cur.idx] = {
                        ...cur,
                        timesLeft = cur.timesLeft-1
                    }
                    at.unshift(cur.idx)
                    curId = cur.idx+1
                } else if (car.type === 'if_else') {
                    const fulfill = (expect.indexOf(status[watch]) > -1)
                    qChange[cur.idx] = {
                        ...cur,
                        result: fulfill
                    }
                    at.unshift(cur.idx)
                    curId = fulfill? cur.idx+1:cur.ifSize+1
                } else {
                    at.unshift(cur.idx)
                    break
                }
            }
            return {
                ...state,
                at: at,
                queue: q.map( b => {
                    return qChange[b.idx] || b
                })
            }
    }
}
const execute = m => {
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
                direction: clock[status.direction][strike],
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
            return { position: pos }
    }

}
const player = (state, action) => {
    switch (action.type) {
        case 'RUN_STAGE':
            const newStage = stage(state.stage, {
                condition: { direction: state.direction } }
            })
            let newState = {
                ...state,
                stage: newStage
            }
            return (newStage.at.length > 0)?
                execute(newStage.at[0], state): newState
        default:
            return state
    }
}
export const game = ( state = initGame, action ) => {
    switch (action.type) {
        case 'RUN_STAGE':
            let newStatus = state.players
            state.gameObjects.players.map( pId => {
                newStatus[pId] = players(state.players[pId], action)
            })
            return {
                ...state,
                players: newStatus
            }
        default:
            return state
    }
}

export const Add = () => ({
    type: 'ADD'
})
export const runStage = (dispatch, getState) => {
    const run = setInterval( () => {
        let canRun = false
        const gos = getState().game.gameObjects
        console.log('ooooooooooooooo',gos)
        for (let i = 0; i < gos.length; i++) {
            console.log('round',i)
            console.log(gos[i].stagedMoves)
            canRun = gos[i].stagedMoves.length > 0
            if (canRun) {
                console.log('canrun')
                dispatch({ type: 'RUN_STAGE' })
                break
            }
        }
        if (!canRun) clearInterval(run)
        else console.log('run')
    }, 1000)
}

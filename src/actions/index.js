export const Add = () => ({
    type: 'ADD'
})
export const runStage = (dispatch, getState) => {
    const run = setInterval( () => {
        let canRun = false
        const gos = getState().game.gameObjects
        for (let i = 0; i < gos.length; i++) {
            canRun = gos[i].stagedMoves.length > 0
            if (canRun) {
                console.log('canrun')
                dispatch({ type: 'RUN_STAGE' })
                break
            }
        }
        if (!canRun) clearInterval(run)
    }, 1000)
}

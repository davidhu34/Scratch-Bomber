export const data = ( state = 1, action ) => {
    switch ( action.type ) {
        case 'ADD':
            return state + 1
        default:
            return state
    }
}

export const gameObject = ( state, action ) => {
    switch ( action.type ) {
        case 'ADD':
            return state + 1
        default:
            return state
    }
}

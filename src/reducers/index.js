import { combineReducers } from 'redux'
import { data } from './data'
import { game } from './game'

const App = combineReducers({
    data,
    game
})

export default App

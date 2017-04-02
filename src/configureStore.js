import { createStore, applyMiddleware } from 'redux'
import promise from 'redux-promise'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'

import App from './reducers'

const freshStore = () => {
    const middlewares = [ thunk ]
    middlewares.push( createLogger() )

    return createStore(
        App,
        applyMiddleware( ...middlewares )
    )
}

export { freshStore }

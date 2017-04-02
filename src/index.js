import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { freshStore } from './configureStore'
import App from './App'

const store = freshStore()

render(
    <Provider store={store} >
        <App/>
    </Provider>,
    document.getElementById('root')
)

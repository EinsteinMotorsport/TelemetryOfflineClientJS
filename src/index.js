import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import * as serviceWorker from './serviceWorker'
import App from './components/App'
import rootReducer from './reducers'

import './index.css'
import MyDataSupplier from './data/MyDataSupplier';
import DataSupplierContext from './data/dataSupplierContext';

const store = createStore(rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

const dataSupplier = new MyDataSupplier()

ReactDOM.render(
    <DataSupplierContext.Provider value={dataSupplier}>
        <Provider store={store}>
            <App />
        </Provider>
    </DataSupplierContext.Provider>,
    document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister() // TODO

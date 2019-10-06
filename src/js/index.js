import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import '../css/style.less';


document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App/>, document.getElementById('js-flip-numbers'));
});
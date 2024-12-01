import { render } from '@wordpress/element';
import App from './App';
import './index.css';

// Render the React app
const root = document.getElementById('medical-consultation-root');
if (root) {
    render(<App />, root);
}
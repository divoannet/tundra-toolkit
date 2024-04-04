import { render } from 'preact';

import { Stickers } from './stickers';

import '../chota.min.css';
import '../common.css';
import './popup.css';

export function App() {
	return (
		<div>
			<Stickers />
		</div>
	);
}

render(<App />, document.getElementById('app'));

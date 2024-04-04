import { render } from 'preact';

import { Stickers } from './stickers';

import './popup.css';

export function App() {
	return (
		<div>
			<Stickers />
		</div>
	);
}

render(<App />, document.getElementById('app'));

import { render } from 'preact';

import { BlackListOptions } from './blackListOptions';

import './options.css';

export function App() {
	return (
		<div class="wrapper">
			<header>
				<h1>Tundra Toolkit</h1>
				<div>Набор инструментов от <a href="https://urchoice.su/viewtopic.php?id=55895">Человека-Шамана</a></div>
			</header>
			<main>
				<h3>Чёрный список</h3>
				<BlackListOptions />
			</main>
		</div>
	);
}

render(<App />, document.getElementById('app'));

import { render } from 'preact';

import { BlackListOptions } from './blackListOptions';
import StickerPackOptions from './stickerPackOptions';

import '../chota.min.css';
import './options.css';

export function App() {
	return (
		<div class="wrapper">
			<header>
				<div className="main">
					<div className="logo">
						<img src='./icon512.png' />
					</div>
					<h1>Tundra Toolkit</h1>
					<div>Набор инструментов от <a href="https://t.me/hvscripts" target="_blank">Человека-Шамана</a></div>
				</div>
			</header>
			<main>
				<h3>Чёрный список</h3>
				<BlackListOptions />
				<h3>Стикеры</h3>
				<StickerPackOptions />
			</main>
		</div>
	);
}

render(<App />, document.getElementById('app'));

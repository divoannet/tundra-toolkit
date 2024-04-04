import { render } from 'preact';

import { BlackListOptions } from './blackListOptions';
import StickerPackOptions from './stickerPackOptions';

import '../chota.min.css';
import '../common.css';
import './options.css';

export function App() {
	return (
		<div class="wrapper">
			<header>
				<div className="main">
					<div className="logo">
						<img src='./icon512.png' />
					</div>
					<h1>Tundra Toolkit <span>v2.1-alpha</span></h1>
					<div>Набор инструментов от <a href="https://t.me/hvscripts" target="_blank">Человека-Шамана</a>.</div>
				</div>
			</header>
			<main>
				<h3>Чёрный список</h3>
				<BlackListOptions />
				<h3>Стикеры</h3>
				<h6>Можно перетаскивать стикеры для сортировки</h6>
				<StickerPackOptions />
			</main>
		</div>
	);
}

render(<App />, document.getElementById('app'));

import { menuArray } from "./data.js";

const menuEl = document.getElementById('menu')

function createMenuHtml() {
	const mapMenu = menuArray.map(item => {
		return `
		<div class="menu-item" id="${item.id}">
			<div class="emoji">${item.emoji}</div>
			<div class="menu-item-text">
				<p class="item-name">${item.name}</p>
				<p class="item-ingredients">${item.ingredients.join(', ')}</p>
				<p class="item-price">$${item.price}</p>
				</p>
			</div>
			<div class="add-remove">
				<button id="add-remove-btn"><span>+</span></button>
			</div>
		</div>`
	})
	return mapMenu.join('')
}

function renderMenu() {
	menuEl.innerHTML = createMenuHtml()
}

renderMenu()

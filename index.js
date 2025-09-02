import { menuArray } from "./data.js";

const menuEl = document.getElementById('menu')
const orderSummaryEl = document.getElementById('order-summary')
const selectionListEl = document.getElementById('selection-list')
const orderTotalEl = document.getElementById('order-total')
let orderTotal = 0

document.addEventListener('DOMContentLoaded', renderMenu())

document.addEventListener('click', (event) => {
	if (event.target.dataset.item) {
		handleOrderSummary(event.target.dataset.item)
	}
})

function handleOrderSummary(itemId) {
	// find item associated with that ID.
	const selectedItemObject =
		menuArray.filter((menuItem) => {
			return menuItem.id === parseInt(itemId)
		})[0]

	// Add item to selection list
	selectionListEl.innerHTML += `
		<div class="selection">
			<div class="item-name-and-remove-btn">
			<p class="item-name">${selectedItemObject.name}</p>
			</div>
			<p>$${selectedItemObject.price}</p>
		</div>
	`

	// TODO: update + to - on the button next to the item in the menu. This will need to be able to be reversed, also.
	// Add price to orderTotal (// TODO: will also need to add handling to subtract)
	orderTotal += selectedItemObject.price
	orderTotalEl.innerHTML = `$${orderTotal}`

	// update order-summary display to flex if not already displayed
	orderSummaryEl.style.display = 'none' && (orderSummaryEl.style.display = 'flex')
}

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
				<button class="add-remove-btn" type="click" data-item="${item.id}">+</button>
			</div>
		</div>`
	})
	return mapMenu.join('')
}

function renderMenu() {
	menuEl.innerHTML = createMenuHtml()
}

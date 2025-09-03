import { menuArray } from "./data.js";

const menuEl = document.getElementById('menu')
const orderSummaryEl = document.getElementById('order-summary')
const selectionListEl = document.getElementById('selection-list')
const orderTotalEl = document.getElementById('order-total')
let orderTotal = 0
let selectedItemObjectArray = []

document.addEventListener('DOMContentLoaded', renderMenu())

document.addEventListener('click', (event) => {
	if (event.target.dataset.item) {
		handleOrderSummary(event.target.dataset.item)
	}
})

function handleOrderSummary(itemId) {
	let item = ''

	// check selectedItemObjectArray to see if item is already in it.
	const selectedItemObject =
		selectedItemObjectArray.filter((menuItem) => {
			return menuItem.id === parseInt(itemId)
		})[0]

	// if not, create new object.
	if (!selectedItemObject) {
		const selectedItemInMenuArray =
			menuArray.filter((menuItem) => {
				return menuItem.id === parseInt(itemId)
			})[0]

		item = {
			name: selectedItemInMenuArray.name,
			price: selectedItemInMenuArray.price,
			id: selectedItemInMenuArray.id,
			quantity: 0,
			totalItemCost: 0,
			getTotalItemCost: function () { this.totalItemCost = this.price * this.quantity } // will this recalculate automatically if another of the same item is added? should it not be a property?
		}
		// push to array
		selectedItemObjectArray.push(item)
	}

	// if the item already in the selectedItemObjectArray, reassign selectedItemObject to variable 'item'.
	else {
		item = selectedItemObject
	}

	// update quantity and total cost for item
	item.quantity++
	item.getTotalItemCost()

	// add price of selected item to orderTotal
	// TODO: add reduction option
	orderTotal += item.price
	orderTotalEl.innerHTML = `$${orderTotal}`

	// add selected item to selectionList and reload in DOM so fields are updated
	renderSelectionList(item)
	orderSummaryEl.style.display != 'flex' && (orderSummaryEl.style.display = 'flex')
}

// TODO: Add conditional so span only shows if quantity is >1
// TODO: update + to - on the add-remove-btn button next to the item in the menu.
function selectedItemHtml(item) {
	return `
		<div class="selection">
			<div class="item-name-and-remove-btn">
			<p class="item-name">${item.name}&emsp;<span class="multiple-item">(x${item.quantity})</span></p>
			</div>
			<p>$${item.totalItemCost}</p>
		</div>
	`
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

// TODO: selectionList needs to be held in an array so it doesn't overwrite itself!
function renderSelectionList(item) {
	selectionListEl.innerHTML = selectedItemHtml(item)
}

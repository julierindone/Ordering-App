import { menuArray } from "./data.js";

const menuEl = document.getElementById('menu')
const orderSummaryEl = document.getElementById('order-summary')
const selectionListEl = document.getElementById('selection-list')
const orderTotalEl = document.getElementById('order-total')
const completeOrderButton = document.getElementById('complete-order-btn')
const payModal = document.getElementById('pay-modal')
const payForm = document.getElementById('pay-form')

let orderTotal = 0
let selectedItemObject = {}
let selectedItemObjectArray = []

document.addEventListener('DOMContentLoaded', renderMenu())

document.addEventListener('click', (event) => {
	if (event.target.dataset.item) {
		handleOrderSummary(event.target.dataset.item)
	}
	if (event.target.dataset.selectionToRemove) {
		handleSelectionRemoval(event.target.dataset.selectionToRemove)
	}
})

completeOrderButton.addEventListener('click', () => {
	let modalWidth = (document.getElementById('wrapper').clientWidth) * .80
	payModal.style.width = `${modalWidth}px`
	payModal.style.display = 'flex'
	payModal.showModal()
})

payForm.addEventListener('submit', (event) => {
	event.preventDefault()
	handlePayment()
})

function handleOrderSummary(itemId) {
	let item = ''

	// check selectedItemObjectArray to see if item is already in it.
	selectedItemObject = findMatchingItem(selectedItemObjectArray, itemId)

	// if not, create new object & push to array
	if (!selectedItemObject) {
		item = createNewObject(itemId)
		selectedItemObjectArray.push(item)
	}

	// if so, reassign selectedItemObject to variable 'item'.
	else {
		item = selectedItemObject
	}

	// update quantity, total cost for item, and order total
	item.quantity++
	item.getTotalItemCost()
	orderTotal += item.price
	orderTotalEl.innerHTML = `$${orderTotal}`

	// update item html, render selection list
	item.itemHtml = getSelectedItemHtml(item)
	renderSelectionList(selectedItemObjectArray)
}

function handleSelectionRemoval(selectionToRemove) {
	// find object to remove & reassign to 'item'
	selectedItemObject = findMatchingItem(selectedItemObjectArray, selectionToRemove)
	let item = selectedItemObject

	let itemIndex = selectedItemObjectArray.indexOf(item)
	// let itemHtmlIndex = selectionListHtmlArray.indexOf(itemHtml)

	// reduce quantity by 1
	item.quantity--
	item.getTotalItemCost()

	if (item.quantity === 0) {
		selectedItemObjectArray.splice(itemIndex, 1)
	}

	else {
		// update Html
		item.itemHtml = getSelectedItemHtml(item)
	}

	// update order total
	orderTotal -= item.price
	orderTotalEl.innerHTML = `$${orderTotal}`

	// TODO: Do I need to rerender the whole list? or just the object?
	renderSelectionList(selectedItemObjectArray)
}

function createNewObject(itemId) {
	const selectedItemInMenuArray = findMatchingItem(menuArray, itemId)

	return {
		name: selectedItemInMenuArray.name,
		price: selectedItemInMenuArray.price,
		id: selectedItemInMenuArray.id,
		quantity: 0,
		totalItemCost: 0,
		getTotalItemCost: function () { this.totalItemCost = this.price * this.quantity },
		itemHtml: ``
	}
}

function getSelectedItemHtml(item) {
	let multiples = ''
	if (item.quantity >= 2) {
		multiples = `<span class="multiple-items">x${item.quantity}</span>`
	}

	return `
		<div class="selection">
			<div class="item-name-and-remove-btn">
			<p class="item-name">${item.name}${multiples}<span class="remove-btn" data-selection-to-remove="${item.id}">remove</span></p>
			</div>
			<p class="total-item-cost">$${item.totalItemCost}</p>
		</div>`
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
			</div>
			<button class="add-btn" type="click" data-item="${item.id}">+</button>
		</div>
		<hr>`
	})
	return mapMenu.join('')
}

function renderMenu() {
	menuEl.innerHTML = createMenuHtml()
}

function renderSelectionList(selectedItemObjectArray) {
	selectionListEl.innerHTML = ''
	selectedItemObjectArray.forEach(itemObject => {
		selectionListEl.innerHTML += itemObject.itemHtml
	})
	orderSummaryEl.style.display != 'flex' && (orderSummaryEl.style.display = 'flex')
}

function handlePayment() {
	const customerName = document.getElementById('customer-name').value
	const cardNumber = document.getElementById('card-number').value
	const cvv = document.getElementById('cvv').value

	payModal.close()
	payModal.style.display = 'none'

	console.log(`Payment details:
			Name: ${customerName}
			Card number: ${cardNumber}
			CVV: ${cvv}`)

	createThanYouNote(customerName)
}

function createThanYouNote(customerName) {
	orderSummaryEl.innerHTML =
		`<h2 class="thank-you-note smythe-regular">
		Thanks, ${customerName}!<br>
		Your order is on its way!
		</div>`
}

// // // // // Helper Functions // // // // //
function findMatchingItem(objectArray, itemId) {
	let itemObject = objectArray.filter((itemObject) => {
		return itemObject.id === parseInt(itemId)
	})[0];
	return itemObject;
}

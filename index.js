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
let selectionListHtmlArray = []

document.addEventListener('DOMContentLoaded', renderMenu())

document.addEventListener('click', (event) => {
	if (event.target.dataset.item) {
		handleOrderSummary(event.target.dataset.item)
	}
	if (event.target.dataset.selection) {
		handleSelectionRemoval(event.target.dataset.selection)
	}
})

completeOrderButton.addEventListener('click', () => {
	payModal.showModal()
	payModal.style.display = 'flex'
})

payForm.addEventListener('submit', (event) => {
	event.preventDefault()
	handlePayment()
})

function handleOrderSummary(itemId) {
	let item = ''
	let itemHtml = ''

	// check selectedItemObjectArray to see if item is already in it.
	selectedItemObject =
		selectedItemObjectArray.filter((menuItem) => {
			return menuItem.id === parseInt(itemId)
		})[0]

	// if not, create new object.
	if (!selectedItemObject) {
		item = createNewObject(itemId)

		// push to array
		selectedItemObjectArray.push(item)

		// create html
		itemHtml = getSelectedItemHtml(item)
		selectionListHtmlArray.push(itemHtml)
	}

	// if the item already in the selectedItemObjectArray, reassign selectedItemObject to variable 'item'.
	else {
		item = selectedItemObject
		itemHtml = getSelectedItemHtml(item)
	}

	// get index of item in selectedItemObjectArray to use in html updates
	let itemHtmlIndex = selectionListHtmlArray.indexOf(itemHtml)

	// update quantity and total cost for item
	item.quantity++
	item.getTotalItemCost()

	// add price of selected item to orderTotal
	// TODO: add reduction option
	orderTotal += item.price
	orderTotalEl.innerHTML = `$${orderTotal}`

	// update item html in list
	itemHtml = getSelectedItemHtml(item)
	selectionListHtmlArray.splice(itemHtmlIndex, 1, itemHtml)

	// add reload in DOM so selectionList fields are updated
	renderSelectionList(selectionListHtmlArray)
	orderSummaryEl.style.display != 'flex' && (orderSummaryEl.style.display = 'flex')
}

function handleSelectionRemoval(selection) {
	let selectedItemObject = selectedItemObjectArray.filter((itemObject) => {
		return itemObject.id === parseInt(selection)
	})[0]

	// TODO: REPEATED CODE; COULD BE SEPARATE function
	// reassign selectedItemObject to variable 'item'.
	let item = selectedItemObject
	let itemHtml = getSelectedItemHtml(item)

	// get index of item in selectedItemObjectArray to use in html updates
	let itemIndex = selectedItemObjectArray.indexOf(item)
	let itemHtmlIndex = selectionListHtmlArray.indexOf(itemHtml)

	// reduce quantity by 1
	item.quantity--
	item.getTotalItemCost()

	if (item.quantity === 0) {
		selectedItemObjectArray.splice(itemIndex, 1)
		selectionListHtmlArray.splice(itemHtmlIndex, 1)
	}

	else {
		// update Html array
		itemHtml = getSelectedItemHtml(item)
		selectionListHtmlArray.splice(itemHtmlIndex, 1, itemHtml)
	}

	// update order total
	orderTotal -= item.price
	orderTotalEl.innerHTML = `$${orderTotal}`

	renderSelectionList(selectionListHtmlArray)

}

function createNewObject(itemId) {
	const selectedItemInMenuArray =
		menuArray.filter((menuItem) => {
			return menuItem.id === parseInt(itemId)
		})[0]

	return {
		name: selectedItemInMenuArray.name,
		price: selectedItemInMenuArray.price,
		id: selectedItemInMenuArray.id,
		quantity: 0,
		totalItemCost: 0,
		getTotalItemCost: function () { this.totalItemCost = this.price * this.quantity } // will this recalculate automatically if another of the same item is added? should it not be a property?
	}
}

// TODO: Add conditional so span only shows if quantity is >1
// TODO: update + to - on the add-remove-btn button next to the item in the menu.
function getSelectedItemHtml(item) {
	let multiples = ''
	if (item.quantity >= 2) {
		multiples = `<span class="multiple-items">x${item.quantity}</span>`
	}

	return `
		<div class="selection">
			<div class="item-name-and-remove-btn">
			<p class="item-name">${item.name}${multiples}<span class="remove-btn" data-selection="${item.id}">remove</span></p>
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
			<div class="add-remove">
				<button class="add-remove-btn" type="click" data-item="${item.id}">+</button>
			</div>
		</div>
		<hr>`
	})
	return mapMenu.join('')
}

function createThanYouNote(customerName) {
	orderSummaryEl.innerHTML =
		`<h2 class="thank-you-note smythe-regular" >
		Thanks, ${customerName}!<br>
		Your order is on its way!
		</div>`
}

function renderMenu() {
	menuEl.innerHTML = createMenuHtml()
}

function renderSelectionList(selectionListHtmlArray) {
	selectionListEl.innerHTML = selectionListHtmlArray.join('')
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

const Item = require('../models/item.model')

class ItemController {
	async getAllItems(req, res) {
		try {
			const items = await Item.findAll({
				order: [['id', 'ASC']],
			})
			res.json(items)
		} catch (err) {
			console.error(err)
			res.status(500).json({ error: 'Internal server error' })
		}
	}

	async getItemById(req, res) {
		try {
			const { id } = req.params
			const item = await Item.findByPk(id)

			if (!item) {
				return res.status(404).json({ error: 'Item not found' })
			}

			res.json(item)
		} catch (err) {
			console.error(err)
			res.status(500).json({ error: 'Internal server error' })
		}
	}

	async createItem(req, res) {
		try {
			console.log('Received request body:', req.body)
			const { name, description } = req.body
			console.log('Extracted values:', { name, description })

			const newItem = await Item.create({ name, description })
			res.status(201).json(newItem)
		} catch (err) {
			console.error('Error creating item:', err)
			res.status(500).json({ error: err.message || 'Internal server error' })
		}
	}

	async updateItem(req, res) {
		try {
			const { id } = req.params
			const { name, description } = req.body

			const item = await Item.findByPk(id)
			if (!item) {
				return res.status(404).json({ error: 'Item not found' })
			}

			const updatedItem = await item.update({ name, description })
			res.json(updatedItem)
		} catch (err) {
			console.error(err)
			res.status(500).json({ error: 'Internal server error' })
		}
	}

	async deleteItem(req, res) {
		try {
			const { id } = req.params
			const item = await Item.findByPk(id)

			if (!item) {
				return res.status(404).json({ error: 'Item not found' })
			}

			await item.destroy()
			res.json({ message: 'Item deleted successfully' })
		} catch (err) {
			console.error(err)
			res.status(500).json({ error: 'Internal server error' })
		}
	}
}

module.exports = new ItemController()

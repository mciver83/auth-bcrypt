const bcrypt = require('bcryptjs')

module.exports = {
  register: async (req, res) => {
    const db = req.app.get('db')
    const { email, password, isAdmin, name } = req.body;
    const existingUser = await db.getUserByEmail(email)
    if (existingUser[0]) {
      return res.status(409).send('email already taken')
    }
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    const createdUser = await db.createUser({ name, email, hash, isAdmin })
    let sessionUser = { ...createdUser[0] }
    delete sessionUser.password
    req.session.user = sessionUser
    res.send(req.session.user)
  },

  login: async (req, res) => {
    const db = req.app.get('db')
    const { email, password } = req.body
    const users = await db.getUserByEmail(email)
    const user = users[0]

    if (!user) {
      return res.status(401).send('email not found.  Please register.')
    }

    const isAuthenticated = bcrypt.compareSync(password, user.password)

    if (!isAuthenticated) {
      return res.status(403).send('Incorrect password')
    }

    let sessionUser = { ...user }
    delete user.password

    req.session.user = sessionUser
    res.send(req.session.user)

  },

  logout: (req, res) => {
    req.session.destroy()
    res.sendStatus(200)
  }
}
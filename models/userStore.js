const bcrypt = require('bcrypt');

const users = [];

const UserStore = {
  findByEmail: (email) => users.find(user => user.email === email),

  findById: (id) => users.find(user => user.id === id),

  create: async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), email, password: hashedPassword };
    users.push(newUser);
    return newUser;
  }
};

module.exports = UserStore;

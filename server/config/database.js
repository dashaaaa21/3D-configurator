class Database {
    constructor() {
        this.users = [];
    }

   
    findUserByEmail(email) {
        for (let index = 0; index < this.users.length; index++) {
            if (this.users[index].email === email) {
                return this.users[index];
            }
        }
        return null;
    }

 
    findUserById(userId) {
        for (let index = 0; index < this.users.length; index++) {
            if (this.users[index].userId === userId) {
                return this.users[index];
            }
        }
        return null;
    }

  
    createUser(userData) {
        this.users.push(userData);
        return userData;
    }

   
    updateUser(userId, updates) {
        for (let index = 0; index < this.users.length; index++) {
            if (this.users[index].userId === userId) {
                
                const keys = Object.keys(updates);
                
                for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
                    const key = keys[keyIndex];
                    this.users[index][key] = updates[key];
                }
                
                return this.users[index];
            }
        }
        return null;
    }
}

module.exports = new Database();

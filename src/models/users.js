import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	categories: {},
});

schema.statics.createUser = async function createUser(user) {
	return await this.create(user);
};

module.exports = mongoose.model('users', schema);

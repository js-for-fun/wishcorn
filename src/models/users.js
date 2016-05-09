import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	categories: {},
});

module.exports = new mongoose.Model('users', schema);

const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  status: { type: String, enum: ['open', 'complete'], default: 'open' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of users this task is shared with
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

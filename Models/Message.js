const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false }, // Indique si le message a été lu
    deletedBy: [
          { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] },
        ],
  },
  { timestamps: true } // Ajoute createdAt et updatedAt
);

module.exports = mongoose.model('Message', messageSchema);

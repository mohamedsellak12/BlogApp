const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    ],
    lastMessage: { type: String }, // Le dernier message envoyé (facultatif)
    deletedBy: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] },
    ],
  },
  { timestamps: true } // Pour ajouter automatiquement createdAt et updatedAt
);

module.exports = mongoose.model('Conversation', conversationSchema);

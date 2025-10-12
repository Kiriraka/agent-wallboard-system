const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// Send message
router.post('/send', async (req, res) => {
  try {
    // ดึงค่าจาก body ทั้ง message และ content เพื่อรองรับทั้งสองแบบ
    const { fromCode, toCode, message, content, type = 'direct', priority = 'normal' } = req.body;

    // ✅ ใช้ message ถ้ามี / ถ้าไม่มีให้ใช้ content
    const text = message || content;

    if (!fromCode || !text) {
      return res.status(400).json({ error: 'From code and message are required' });
    }

    // ✅ ใช้ field content ให้ตรงกับ schema
    const newMessage = new Message({
      fromCode,
      toCode: type === 'broadcast' ? null : toCode,
      content: text,
      type,
      priority,
      timestamp: new Date(),
      isRead: false
    });

    await newMessage.save();

    // ✅ ส่ง event ผ่าน socket.io
    const io = req.app.get('io');
    if (io) {
      if (type === 'broadcast') {
        io.emit('new_broadcast_message', newMessage);
      } else {
        io.to(toCode).emit('new_direct_message', newMessage);
      }
    }

    res.json({ success: true, messageId: newMessage._id });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get messages for agent
router.get('/agent/:agentCode', async (req, res) => {
  try {
    const { agentCode } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    const messages = await Message.find({
      $or: [
        { toCode: agentCode },
        { type: 'broadcast' }
      ]
    })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Mark message as read
router.put('/:messageId/read', async (req, res) => {
  try {
    const { messageId } = req.params;

    await Message.findByIdAndUpdate(messageId, {
      isRead: true,
      readAt: new Date()
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

module.exports = router;
import mongoose from 'mongoose';
import GalleryItem from '../models/GalleryItem.js';
import AuditLog from '../models/AuditLog.js';

export async function getPublicGallery(req, res) {
  try {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        items: []
      });
    }

    const { category } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;

    const items = await GalleryItem.find(query).sort({ order: 1, createdAt: 1 });
    return res.json({
      success: true,
      items
    });
  } catch (err) {
    return res.json({
      success: true,
      items: []
    });
  }
}

export async function getAdminGallery(req, res) {
  try {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        items: []
      });
    }

    const items = await GalleryItem.find().sort({ order: 1, createdAt: 1 });
    return res.json({
      success: true,
      items
    });
  } catch (err) {
    console.warn('getAdminGallery fallback:', err.message);
    return res.json({
      success: true,
      items: []
    });
  }
}

export async function createGalleryItem(req, res) {
  try {
    const { title, category, imageUrl, caption, order, isActive } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Title and image URL are required.'
      });
    }

    const item = await GalleryItem.create({
      title: title.trim(),
      category: category || 'development',
      imageUrl: imageUrl.trim(),
      caption: caption ? caption.trim() : '',
      order: Number(order) || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    await AuditLog.create({
      adminUserId: req.user._id,
      adminEmail: req.user.email,
      action: 'GALLERY_ITEM_CREATED',
      resource: 'GalleryItem',
      resourceId: item._id.toString(),
      changes: item,
      ipAddress: req.ip
    });

    return res.status(201).json({
      success: true,
      message: 'Gallery item added.',
      item
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateGalleryItem(req, res) {
  try {
    const { id } = req.params;
    const item = await GalleryItem.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Gallery item not found.' });
    }

    const before = item.toObject();
    Object.assign(item, req.body);
    await item.save();

    await AuditLog.create({
      adminUserId: req.user._id,
      adminEmail: req.user.email,
      action: 'GALLERY_ITEM_UPDATED',
      resource: 'GalleryItem',
      resourceId: item._id.toString(),
      changes: { before, after: item },
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: 'Gallery item updated.',
      item
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteGalleryItem(req, res) {
  try {
    const { id } = req.params;
    const item = await GalleryItem.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Gallery item not found.' });
    }

    await AuditLog.create({
      adminUserId: req.user._id,
      adminEmail: req.user.email,
      action: 'GALLERY_ITEM_DELETED',
      resource: 'GalleryItem',
      resourceId: id,
      changes: { title: item.title },
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: 'Gallery item deleted.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

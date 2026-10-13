import Plot from '../models/Plot.js';
import AuditLog from '../models/AuditLog.js';
import { Parser } from 'json2csv';
import { calculateExtraCharges } from '../data/plotsData.js';

export async function getPlots(req, res) {
  try {
    const { status, facing, minArea, maxArea, search, page, limit, all } = req.query;
    const query = {};

    if (status) query.status = status;
    if (facing) query.facing = facing;
    if (minArea || maxArea) {
      query.areaSqYds = {};
      if (minArea) query.areaSqYds.$gte = Number(minArea);
      if (maxArea) query.areaSqYds.$lte = Number(maxArea);
    }
    if (search) {
      const searchNum = Number(search);
      if (!isNaN(searchNum)) {
        query.plotNumber = searchNum;
      } else {
        query.$or = [
          { block: new RegExp(search, 'i') },
          { facing: new RegExp(search, 'i') }
        ];
      }
    }

    // If client asks for all (e.g. 2D/3D visualizer), return full array without pagination
    if (all === 'true') {
      const plots = await Plot.find(query).sort({ plotNumber: 1 });
      return res.json({
        success: true,
        count: plots.length,
        plots
      });
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [plots, total] = await Promise.all([
      Plot.find(query).sort({ plotNumber: 1 }).skip(skip).limit(limitNum),
      Plot.countDocuments(query)
    ]);

    return res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      plots
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getPlotDetail(req, res) {
  try {
    const { plotNumber } = req.params;
    const plot = await Plot.findOne({ plotNumber: Number(plotNumber) });

    if (!plot) {
      return res.status(404).json({
        success: false,
        error: `Plot #${plotNumber} not found.`
      });
    }

    return res.json({
      success: true,
      plot
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function getPlotStats(req, res) {
  try {
    const total = await Plot.countDocuments();
    const available = await Plot.countDocuments({ status: 'available' });
    const reserved = await Plot.countDocuments({ status: 'reserved' });
    const sold = await Plot.countDocuments({ status: 'sold' });
    const blocked = await Plot.countDocuments({ status: 'blocked' });

    return res.json({
      success: true,
      stats: {
        total,
        available,
        reserved,
        sold,
        blocked
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function createPlot(req, res) {
  try {
    const data = req.body;
    const existing = await Plot.findOne({ plotNumber: data.plotNumber });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: `Plot #${data.plotNumber} already exists.`
      });
    }

    const extra = calculateExtraCharges(data.facing, data.isCorner, data.roadWidth);
    data.extraChargesPerSqYd = extra.totalPerSqYd;
    data.extraChargesBreakdown = extra.breakdown;
    data.areaSqFt = data.areaSqYds * 9;
    data.totalPrice = data.areaSqYds * ((data.basePricePerSqYd || 12500) + data.extraChargesPerSqYd);
    data.updatedBy = req.user.username;

    const newPlot = await Plot.create(data);

    await AuditLog.create({
      adminUserId: req.user._id,
      adminEmail: req.user.email,
      action: 'PLOT_CREATED',
      resource: 'Plot',
      resourceId: newPlot._id.toString(),
      changes: newPlot,
      ipAddress: req.ip
    });

    return res.status(201).json({
      success: true,
      message: `Plot #${newPlot.plotNumber} created successfully.`,
      plot: newPlot
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updatePlot(req, res) {
  try {
    const { plotNumber } = req.params;
    const plot = await Plot.findOne({ plotNumber: Number(plotNumber) });

    if (!plot) {
      return res.status(404).json({ success: false, error: `Plot #${plotNumber} not found.` });
    }

    const before = plot.toObject();
    Object.assign(plot, req.body);

    if (req.body.facing || req.body.isCorner !== undefined || req.body.roadWidth) {
      const extra = calculateExtraCharges(plot.facing, plot.isCorner, plot.roadWidth);
      plot.extraChargesPerSqYd = extra.totalPerSqYd;
      plot.extraChargesBreakdown = extra.breakdown;
    }

    if (plot.areaSqYds) {
      plot.areaSqFt = plot.areaSqYds * 9;
      plot.totalPrice = plot.areaSqYds * ((plot.basePricePerSqYd || 12500) + (plot.extraChargesPerSqYd || 0));
    }

    plot.updatedBy = req.user.username;
    await plot.save();

    await AuditLog.create({
      adminUserId: req.user._id,
      adminEmail: req.user.email,
      action: 'PLOT_UPDATED',
      resource: 'Plot',
      resourceId: plot._id.toString(),
      changes: { before, after: plot },
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: `Plot #${plot.plotNumber} updated successfully.`,
      plot
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function updatePlotStatus(req, res) {
  try {
    const { plotNumber } = req.params;
    const { status } = req.body;

    const valid = ['available', 'reserved', 'sold', 'blocked'];
    if (!valid.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${valid.join(', ')}`
      });
    }

    const plot = await Plot.findOne({ plotNumber: Number(plotNumber) });
    if (!plot) {
      return res.status(404).json({ success: false, error: `Plot #${plotNumber} not found.` });
    }

    const oldStatus = plot.status;
    plot.status = status;
    plot.updatedBy = req.user.username;
    await plot.save();

    await AuditLog.create({
      adminUserId: req.user._id,
      adminEmail: req.user.email,
      action: 'PLOT_STATUS_CHANGED',
      resource: 'Plot',
      resourceId: plot._id.toString(),
      changes: { plotNumber: plot.plotNumber, from: oldStatus, to: status },
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: `Plot #${plot.plotNumber} status updated to ${status}.`,
      plot
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function deletePlot(req, res) {
  try {
    const { plotNumber } = req.params;
    const plot = await Plot.findOneAndDelete({ plotNumber: Number(plotNumber) });

    if (!plot) {
      return res.status(404).json({ success: false, error: `Plot #${plotNumber} not found.` });
    }

    await AuditLog.create({
      adminUserId: req.user._id,
      adminEmail: req.user.email,
      action: 'PLOT_DELETED',
      resource: 'Plot',
      resourceId: plot._id.toString(),
      changes: { plotNumber: plot.plotNumber },
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: `Plot #${plotNumber} deleted successfully.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function exportPlotsCsv(req, res) {
  try {
    const plots = await Plot.find().sort({ plotNumber: 1 });
    const fields = ['plotNumber', 'block', 'areaSqYds', 'areaSqFt', 'dimensions', 'facing', 'isCorner', 'roadWidth', 'status', 'basePricePerSqYd', 'extraChargesPerSqYd', 'totalPrice', 'notes'];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(plots);

    res.header('Content-Type', 'text/csv');
    res.attachment('alekhyas_brundavan_plots_inventory.csv');
    return res.send(csv);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function importPlotsCsv(req, res) {
  try {
    const { plotsData } = req.body;
    if (!Array.isArray(plotsData) || plotsData.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or empty plotsData array.'
      });
    }

    let inserted = 0;
    let updated = 0;
    const errors = [];

    for (const item of plotsData) {
      const num = Number(item.plotNumber);
      if (!num || isNaN(num)) {
        errors.push(`Invalid plot number: ${item.plotNumber}`);
        continue;
      }

      const existing = await Plot.findOne({ plotNumber: num });
      if (existing) {
        Object.assign(existing, item);
        existing.updatedBy = req.user.username;
        await existing.save();
        updated++;
      } else {
        const extra = calculateExtraCharges(item.facing || 'East', item.isCorner || false, item.roadWidth || '33ft');
        item.extraChargesPerSqYd = extra.totalPerSqYd;
        item.extraChargesBreakdown = extra.breakdown;
        item.updatedBy = req.user.username;
        await Plot.create(item);
        inserted++;
      }
    }

    await AuditLog.create({
      adminUserId: req.user._id,
      adminEmail: req.user.email,
      action: 'PLOTS_CSV_IMPORTED',
      resource: 'Plot',
      changes: { inserted, updated, errorsCount: errors.length },
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: `CSV import completed: ${inserted} inserted, ${updated} updated.`,
      inserted,
      updated,
      errors
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

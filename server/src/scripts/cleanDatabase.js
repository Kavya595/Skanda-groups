import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Plot from '../models/Plot.js';
import Lead from '../models/Lead.js';
import ActivityEvent from '../models/ActivityEvent.js';
import AuditLog from '../models/AuditLog.js';
import AdminUser from '../models/AdminUser.js';

async function cleanDatabase() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skandha_brundavan';
  console.log(`Connecting to MongoDB: ${mongoUri}`);
  await mongoose.connect(mongoUri);

  console.log('\n--- PURGING RANDOM / MOCK TEST DATA ---');

  // 1. Delete all dummy leads
  const deletedLeads = await Lead.deleteMany({});
  console.log(`✓ Deleted ${deletedLeads.deletedCount} random/dummy leads from Lead collection.`);

  // 2. Delete all dummy activity events
  const deletedEvents = await ActivityEvent.deleteMany({});
  console.log(`✓ Deleted ${deletedEvents.deletedCount} random/dummy activity events from ActivityEvent collection.`);

  // 3. Delete all dummy audit logs
  const deletedAudit = await AuditLog.deleteMany({});
  console.log(`✓ Deleted ${deletedAudit.deletedCount} test audit logs from AuditLog collection.`);

  // 4. Reset & Clean Plot Inventory (Eliminate 'reserved' & 'blocked')
  console.log('\n--- SANITIZING PLOT INVENTORY TO 3 STRICT STATUSES (available, booked, sold) ---');
  
  // Brochure verified sold plots
  const soldPlotNumbers = [5, 24, 31, 46, 70, 96];
  // Brochure verified booked plots
  const bookedPlotNumbers = [1, 12, 30, 42, 65];

  const allPlots = await Plot.find();
  let updatedCount = 0;

  for (const plot of allPlots) {
    let newStatus = 'available';
    if (soldPlotNumbers.includes(plot.plotNumber)) {
      newStatus = 'sold';
    } else if (bookedPlotNumbers.includes(plot.plotNumber)) {
      newStatus = 'booked';
    } else {
      newStatus = 'available';
    }

    plot.status = newStatus;
    // Wipe all dummy customer details
    plot.customerName = '';
    plot.customerPhone = '';
    plot.customerEmail = '';
    plot.bookingDate = '';
    plot.bookingAmount = 0;
    plot.paymentStatus = 'unpaid';
    plot.notes = '';
    plot.updatedBy = 'system-clean';

    await plot.save();
    updatedCount++;
  }

  console.log(`✓ Sanitized all ${updatedCount} plots in database.`);

  const statusSummary = await Plot.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  console.log('Sanitized Plot Status Breakdown:', statusSummary);

  const leadsCount = await Lead.countDocuments();
  const eventsCount = await ActivityEvent.countDocuments();
  const auditCount = await AuditLog.countDocuments();
  console.log(`Post-clean counts: Leads=${leadsCount}, ActivityEvents=${eventsCount}, AuditLogs=${auditCount}`);

  // Ensure Admin user exists
  const adminUser = await AdminUser.findOne({ username: 'admin' });
  if (adminUser) {
    console.log(`✓ Verified admin account '${adminUser.username}' (${adminUser.email}) is intact.`);
  }

  console.log('\n✓ Database cleanup completed successfully!');
  await mongoose.disconnect();
}

cleanDatabase().catch(err => {
  console.error('Database cleanup error:', err);
  process.exit(1);
});

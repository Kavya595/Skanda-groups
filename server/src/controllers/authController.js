import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';
import AuditLog from '../models/AuditLog.js';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, username: user.username },
    process.env.JWT_SECRET || 'skandha_super_secure_jwt_token_secret_kadthal_2026',
    { expiresIn: '7d' }
  );
}

export async function bootstrapAdmin(req, res) {
  const { secretKey, username, email, password } = req.body;
  const configuredSecret = process.env.ADMIN_BOOTSTRAP_SECRET || 'skandha_kadthal_master_setup_key_2026';

  if (!secretKey || secretKey !== configuredSecret) {
    return res.status(403).json({
      success: false,
      error: 'Invalid bootstrap secret key.'
    });
  }

  const existingCount = await AdminUser.countDocuments();
  if (existingCount > 0) {
    return res.status(400).json({
      success: false,
      error: 'Admin already bootstrapped. Bootstrap endpoint is permanently locked.'
    });
  }

  if (!username || !email || !password || password.length < 8) {
    return res.status(400).json({
      success: false,
      error: 'Username, valid email, and password of at least 8 characters are required.'
    });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const admin = await AdminUser.create({
    username: username.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    role: 'superadmin',
    mustChangePassword: false,
    isActive: true
  });

  const token = generateToken(admin);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.status(201).json({
    success: true,
    message: 'Initial superadmin account initialized successfully.',
    user: {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    },
    token
  });
}

export async function login(req, res) {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      error: 'Username/email and password are required.'
    });
  }

  const user = await AdminUser.findOne({
    $or: [
      { username: identifier.trim() },
      { email: identifier.trim().toLowerCase() }
    ]
  });

  if (!user || !user.isActive) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials or inactive account.'
    });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials.'
    });
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  await AuditLog.create({
    adminUserId: user._id,
    adminEmail: user.email,
    action: 'ADMIN_LOGIN',
    resource: 'AdminUser',
    resourceId: user._id.toString(),
    ipAddress: req.ip
  });

  return res.json({
    success: true,
    message: 'Login successful.',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword
    },
    token
  });
}

export async function getMe(req, res) {
  return res.json({
    success: true,
    user: req.user
  });
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      error: 'Current password and new password (min 8 characters) are required.'
    });
  }

  const user = await AdminUser.findById(req.user._id);
  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      error: 'Current password does not match.'
    });
  }

  const salt = await bcrypt.genSalt(12);
  user.passwordHash = await bcrypt.hash(newPassword, salt);
  user.mustChangePassword = false;
  await user.save();

  await AuditLog.create({
    adminUserId: user._id,
    adminEmail: user.email,
    action: 'PASSWORD_CHANGED',
    resource: 'AdminUser',
    resourceId: user._id.toString(),
    ipAddress: req.ip
  });

  return res.json({
    success: true,
    message: 'Password updated successfully.'
  });
}

export async function logout(req, res) {
  res.clearCookie('token');
  return res.json({
    success: true,
    message: 'Logged out successfully.'
  });
}

export async function ensureDefaultAdmin() {
  try {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash('admin@123', salt);
    await AdminUser.findOneAndUpdate(
      { username: 'admin' },
      {
        username: 'admin',
        email: 'admin@skandhagroup.com',
        passwordHash,
        role: 'superadmin',
        isActive: true,
        mustChangePassword: false
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('[Auth] Default admin guaranteed active: (admin / admin@123)');
  } catch (err) {
    console.error('[Auth Error] Failed to ensure default admin:', err.message);
  }
}


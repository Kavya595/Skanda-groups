export function validateLeadSubmission(req, res, next) {
  const { name, email, consent, hp_website } = req.body;

  // 1. Honeypot check: If the hidden honeypot field has any value, reject bot
  if (hp_website && hp_website.trim() !== '') {
    return res.status(400).json({
      success: false,
      error: 'Bot submission detected.'
    });
  }

  // 2. Name validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid full name (minimum 2 characters).'
    });
  }

  // 3. Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.'
    });
  }

  // 4. Consent validation
  if (consent === false || consent === 'false') {
    return res.status(400).json({
      success: false,
      error: 'Consent is required to proceed with your enquiry.'
    });
  }

  next();
}

export function validatePlotInput(req, res, next) {
  const { plotNumber, areaSqYds, dimensions, facing, status } = req.body;

  if (plotNumber === undefined || typeof plotNumber !== 'number' || plotNumber < 1) {
    return res.status(400).json({
      success: false,
      error: 'Valid numeric plotNumber is required.'
    });
  }

  if (areaSqYds === undefined || typeof areaSqYds !== 'number' || areaSqYds <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Valid numeric area in Sq. Yds is required.'
    });
  }

  if (!dimensions || typeof dimensions !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Dimensions string is required (e.g. "50\' x 33\'").'
    });
  }

  if (!facing || typeof facing !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Facing direction is required (e.g. "East", "West", "North-East").'
    });
  }

  const validStatuses = ['available', 'reserved', 'sold', 'blocked'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  next();
}

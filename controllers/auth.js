const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const Organization = require('../models/Organization');
const Member = require('../models/Member');

// @desc      Register Organization
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const organization = await Organization.create(req.body);

  // Create token
  const token = organization.getSignedJwtToken();

  return res.status(200).json({
    success: true,
    token,
  });
});

// @desc      Login Organization
// @route     POST /api/v1/auth/organizations/login
// @access    Public
exports.loginOrganization = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Validate email & password
  if (!username || !password) {
    return next(
      new ErrorResponse('Please provide a username and password', 400)
    );
  }

  // Check if organization exists
  const organization = await Organization.findOne({ username }).select(
    '+password'
  );

  // Validate organization
  if (!organization) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // check if password matches
  if (organization.password !== password) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  return res.status(200).json({ success: true });
});

// @desc      Login Member
// @route     POST /api/v1/auth/members/login
// @access    Public
exports.loginMember = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;

  // Validate email & password
  if (!phone || !password) {
    return next(
      new ErrorResponse('Please provide a phone number and password', 400)
    );
  }

  // Check if member exists
  const member = await Member.findOne({ phone }).select('+password');

  // Validate member
  if (!member) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // check if password matches
  if (member.password !== password) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  return res.status(200).json({ success: true });
});

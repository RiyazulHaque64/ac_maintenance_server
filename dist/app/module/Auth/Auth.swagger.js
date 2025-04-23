"use strict";
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API endpoints related to authentication
 */
// Create User
/**
 * @swagger
 * /auth/create-user:
 *   post:
 *     summary: Create user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: email@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               contact_number:
 *                 type: string
 *                 example: 1234567890
 *     responses:
 *       201:
 *         description: If user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1cfda240-4419-482a-bde3-dccdd1a37e97
 *                     first_name:
 *                       type: string
 *                       example: John
 *                     last_name:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: email@example.com
 *                     contact_number:
 *                       type: string
 *                       example: 1234567890
 *                     profile_pic:
 *                       type: string
 *                       example: null
 *                     role:
 *                       type: string
 *                       example: USER
 *                     status:
 *                       type: string
 *                       example: ACTIVE
 *                     created_at:
 *                       type: string
 *                       example: 2023-01-01T00:00:00.000Z
 *                     updated_at:
 *                       type: string
 *                       example: 2023-01-01T00:00:00.000Z
 *       400:
 *         description: If request body is invalid
 *
 */
// Login User
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: email@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: If user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User logged in successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1cfda240-4419-482a-bde3-dccdd1a37e97
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: email@example.com
 *                     contact_number:
 *                       type: string
 *                       example: 1234567890
 *                     profile_pic:
 *                       type: string
 *                       example: https://example.com/profile.jpg
 *                     role:
 *                       type: string
 *                       example: USER
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZSI6IlVTRVIiLCJwYXNzd29yZF9jaGFuZ2VkX2F0IjoxNzM0NTQ1MDc2LCJpYXQiOjE3MzQ1NDY3OTgsImV4cCI6MTczNTE1MTU5OH0.OWbTunoEXIRCdHy6JeUxVOdR3d_ZPww6x8gjeCVw5yQ
 *       400:
 *         description: If request body is invalid
 *
 */
// Reset Password
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     security:
 *       - UserAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               old_password:
 *                 type: string
 *                 example: oldpassword
 *               new_password:
 *                 type: string
 *                 example: newpassword
 *     responses:
 *       201:
 *         description: If password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1cfda240-4419-482a-bde3-dccdd1a37e97
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: email@example.com
 *                     contact_number:
 *                       type: string
 *                       example: 1234567890
 *                     profile_pic:
 *                       type: string
 *                       example: https://example.com/profile.jpg
 *                     role:
 *                       type: string
 *                       example: USER
 *       400:
 *         description: If request body is invalid
 *       401:
 *         description: If user is not authorized. only login user can reset password
 *       403:
 *         description: If user email or password is invalid
 *
 */
// Forgot Password
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: email@example.com
 *               otp:
 *                 type: number
 *                 example: 123456
 *               new_password:
 *                 type: string
 *                 example: newpassword
 *     responses:
 *       201:
 *         description: If otp sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully, check your email
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1cfda240-4419-482a-bde3-dccdd1a37e97
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: email@example.com
 *                     contact_number:
 *                       type: string
 *                       example: 1234567890
 *                     profile_pic:
 *                       type: string
 *                       example: https://example.com/profile.jpg
 *                     role:
 *                       type: string
 *                       example: USER
 *       400:
 *         description: If request body is invalid or invalid OTP
 *
 */

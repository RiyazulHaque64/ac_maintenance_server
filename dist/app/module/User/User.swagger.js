"use strict";
/**
 * @swagger
 * tags:
 *   name: User
 *   description: API endpoints related to user
 */
// Get users
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get users by admin
 *     tags: [User]
 *     security:
 *       - AdminAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search term to filter users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort users by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *         description: Sort order for sorting users
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve
 *       - in: query
 *         name: status
 *         schema:
 *           enum: [ACTIVE, BLOCKED]
 *         description: Status of the user to retrieve
 *       - in: query
 *         name: role
 *         schema:
 *           enum: [USER, ADMIN]
 *         description: Role of the user to retrieve
 *     responses:
 *       201:
 *         description: If user retrieved successfully
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
 *                   example: User retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 1cfda240-4419-482a-bde3-dccdd1a37e97
 *                       first_name:
 *                         type: string
 *                         example: John
 *                       last_name:
 *                         type: string
 *                         example: Doe
 *                       email:
 *                         type: string
 *                         example: email@example.com
 *                       contact_number:
 *                         type: string
 *                         example: 1234567890
 *                       profile_pic:
 *                         type: string
 *                         example: null
 *                       role:
 *                         type: string
 *                         example: USER
 *                       status:
 *                         type: string
 *                         example: ACTIVE
 *                       created_at:
 *                         type: string
 *                         example: 2023-01-01T00:00:00.000Z
 *                       updated_at:
 *                         type: string
 *                         example: 2023-01-01T00:00:00.000Z
 *
 *       401:
 *         description: If user is not authorized. only admin can get users
 *
 */
// Get Profile
/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - UserAuth: []
 *       - AdminAuth: []
 *     responses:
 *       201:
 *         description: If profile retrieved successfully
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
 *                   example: Your profile retrieved successfully
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
 *       401:
 *         description: If user is not authorized. only login user can get profile
 *
 */
// Update Profile
/**
 * @swagger
 * /user/update-profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - UserAuth: []
 *       - AdminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile_pic:
 *                 type: string
 *                 format: binary
 *                 description: User profile picture
 *               data:
 *                 type: object
 *                 properties:
 *                   first_name:
 *                     type: string
 *                     example: John
 *                   last_name:
 *                     type: string
 *                     example: Doe
 *                   contact_number:
 *                     type: string
 *                     example: 1234567890
 *     responses:
 *       201:
 *         description: If profile updated successfully
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
 *                   example: Your profile updated successfully
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
 *       401:
 *         description: If user is not authorized. only login user can get profile
 *
 */
// Update User
/**
 * @swagger
 * /user/update-user/{id}:
 *   patch:
 *     summary: Update user by admin
 *     tags: [User]
 *     security:
 *       - UserAuth: []
 *       - AdminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contact_number:
 *                 type: string
 *                 example: 1234567890
 *               role:
 *                 type: string
 *                 example: USER | ADMIN
 *               status:
 *                 type: string
 *                 example: ACTIVE | BLOCKED
 *               is_deleted:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: If profile updated successfully
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
 *                   example: Your profile updated successfully
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
 *                       example: https://example.com/profile.jpg
 *                     role:
 *                       type: string
 *                       example: USER | ADMIN
 *                     status:
 *                       type: string
 *                       example: ACTIVE | BLOCKED
 *                     created_at:
 *                       type: string
 *                       example: 2023-01-01T00:00:00.000Z
 *                     updated_at:
 *                       type: string
 *                       example: 2023-01-01T00:00:00.000Z
 *       400:
 *         description: If request body is invalid
 *       401:
 *         description: If user is not authorized. only login user can get profile
 *
 */

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: API endpoints related to blog
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     blog:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Blog title
 *         content:
 *           type: string
 *           example: Blog content
 *         tags:
 *           type: string
 *           example: tag1,tag2
 *         thumbnail:
 *           type: string
 *           example: https://example.com/thumbnail.jpg
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             example: https://example.com/image1.jpg
 *
 * paths:
 *   /blog/post:
 *     post:
 *       summary: Create a new post
 *       tags: [Blog]
 *       security:
 *         - AdminAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/blog'
 *       responses:
 *         201:
 *           description: Blog created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/blog'
 *                   - type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 1cfda240-4419-482a-bde3-dccdd1a37e97
 *                       slug:
 *                         type: string
 *                         example: blog-title
 *                       published:
 *                         type: boolean
 *                         example: true
 *                       author_id:
 *                         type: string
 *                         example: 1cfda240-4419-482a-bde3-dccdd1a37e97
 *                       created_at:
 *                         type: string
 *                         example: 2023-01-01T00:00:00.000Z
 *                       updated_at:
 *                         type: string
 *                         example: 2023-01-01T00:00:00.000Z
 *         400:
 *           description: Invalid request body
 */

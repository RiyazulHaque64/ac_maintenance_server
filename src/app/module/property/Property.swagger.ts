/**
 * @swagger
 * tags:
 *   name: Property
 *   description: API endpoints related to property
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PropertyContactInfo:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the contact person
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the contact person
 *           example: john.doe@example.com
 *         phone:
 *           type: string
 *           description: Phone number of the contact person
 *           example: +123456789
 *           nullable: true
 *     PropertyLocation:
 *       type: object
 *       properties:
 *         city:
 *           type: string
 *           description: City of the property location
 *           example: New York
 *         state:
 *           type: string
 *           description: State of the property location
 *           example: NY
 *         country:
 *           type: string
 *           description: Country of the property location
 *           example: USA
 *         postal_code:
 *           type: string
 *           description: Postal code of the property location
 *           example: 10001
 *           nullable: true
 *         street:
 *           type: string
 *           description: Street address of the property
 *           example: 123 Main St
 *         latitude:
 *           type: number
 *           format: float
 *           description: Latitude of the property
 *           example: 40.7128
 *           nullable: true
 *         longitude:
 *           type: number
 *           format: float
 *           description: Longitude of the property
 *           example: -74.0060
 *           nullable: true
 *     PropertyDetails:
 *       type: object
 *       properties:
 *         area_size:
 *           type: number
 *           description: Size of the property in square meters
 *           example: 120
 *         bedroom:
 *           type: integer
 *           description: Number of bedrooms
 *           example: 3
 *         bathroom:
 *           type: integer
 *           description: Number of bathrooms
 *           example: 2
 *         garage:
 *           type: integer
 *           description: Number of garages
 *           example: 1
 *         available_from:
 *           type: string
 *           format: date
 *           description: Availability date in YYYY-MM-DD format
 *           example: 2024-01-01
 *         property_lot_size:
 *           type: string
 *           description: Lot size of the property
 *           example: 500 sqm
 *           nullable: true
 *         year_build:
 *           type: string
 *           description: Year the property was built
 *           example: 1990
 *           nullable: true
 *         structure_type:
 *           type: string
 *           description: Type of the structure
 *           example: Apartment
 *           nullable: true
 *         price_info:
 *           type: string
 *           description: Additional price information
 *           example: Negotiable
 *           nullable: true
 *         room:
 *           type: integer
 *           description: Total number of rooms
 *           example: 5
 *         garage_size:
 *           type: string
 *           description: Size of the garage
 *           example: 30 sqm
 *           nullable: true
 *     PropertyFeatures:
 *       type: object
 *       properties:
 *         interior_details:
 *           type: array
 *           items:
 *             type: string
 *           description: Interior features
 *           example: ["Fireplace", "Hardwood Flooring"]
 *           nullable: true
 *         outdoor_details:
 *           type: array
 *           items:
 *             type: string
 *           description: Outdoor features
 *           example: ["Garden", "Swimming Pool"]
 *           nullable: true
 *         utilities:
 *           type: array
 *           items:
 *             type: string
 *           description: Available utilities
 *           example: ["Electricity", "Water"]
 *           nullable: true
 *         other_features:
 *           type: array
 *           items:
 *             type: string
 *           description: Additional features
 *           example: ["Solar Panels"]
 *           nullable: true
 *     CreateProperty:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the property listing
 *           example: Beautiful Family Home
 *         description:
 *           type: string
 *           description: Detailed description of the property
 *           example: A spacious 3-bedroom home in the heart of the city.
 *           nullable: true
 *         price:
 *           type: number
 *           description: Listing price of the property
 *           example: 250000
 *         property_type:
 *           type: string
 *           enum: [APARTMENT,HOUSE, VILLA, LAND]
 *           description: Type of the property
 *           example: APARTMENT | HOUSE | VILLA | LAND
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [AVAILABLE, SOLD, RENTED]
 *           description: Status of the property
 *           example: AVAILABLE | SOLD | RENTED
 *           nullable: true
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags associated with the property
 *           example: ["Luxury", "Sea View"]
 *           nullable: true
 *         contact_info:
 *           $ref: '#/components/schemas/PropertyContactInfo'
 *           nullable: true
 *         location:
 *           $ref: '#/components/schemas/PropertyLocation'
 *           nullable: true
 *         property_details:
 *           $ref: '#/components/schemas/PropertyDetails'
 *           nullable: true
 *         features:
 *           $ref: '#/components/schemas/PropertyFeatures'
 *           nullable: true
 *         feature_image:
 *           type: string
 *           example: /general/feature-image.jpg
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             example: /general/image.jpg
 */

/**
 * @swagger
 * /property/add-property:
 *   post:
 *     summary: Create a new property
 *     description: Create a new property listing with the provided details.
 *     tags: [Property]
 *     security:
 *       - AdminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               feature_image:
 *                 type: string
 *                 format: binary
 *                 description: Feature image of the property
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: Images of the property
 *               data:
 *                 $ref: '#/components/schemas/CreateProperty'
 *     responses:
 *       201:
 *         description: Property created successfully
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
 *                   example: Property created successfully.
 *                 data:
 *                   type: object
 *                   description: The created property object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the created property
 *                       example: 5f9e8f9e8f9e8f9e8f9e8f9e
 *                     user_id:
 *                       type: string
 *                       description: The ID of the user who created the property
 *                       example: 5f9e8f9e8f9e8f9e8f9e8f9e
 *                     title:
 *                       type: string
 *                       description: The title of the property
 *                       example: Beautiful Family Home
 *                     slug:
 *                       type: string
 *                       description: The slug of the property
 *                       example: beautiful-family-home
 *                     description:
 *                       type: string
 *                       description: The description of the property
 *                       example: A spacious 3-bedroom home in the heart of the city.
 *                     price:
 *                       type: number
 *                       description: The price of the property
 *                       example: 250000
 *                     feature_image:
 *                       type: string
 *                       description: The feature image path of the property
 *                       example: https://example.com/feature-image.jpg
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         description: The image paths of the property
 *                         example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *                     property_type:
 *                       type: string
 *                       enum: [APARTMENT,HOUSE, VILLA, LAND]
 *                       description: The type of the property
 *                       example: APARTMENT | HOUSE | VILLA | LAND
 *                     status:
 *                       type: string
 *                       enum: [AVAILABLE, SOLD, RENTED]
 *                       description: The status of the property
 *                       example: AVAILABLE | SOLD | RENTED
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                         description: The tags associated with the property
 *                         example: ["Luxury", "Sea View"]
 *                     documents:
 *                       type: array
 *                       items:
 *                         type: string
 *                         description: The document paths of the property
 *                         example: ["https://example.com/document1.pdf", "https://example.com/document2.pdf"]
 *                     property_details:
 *                       $ref: '#/components/schemas/PropertyDetails'
 *                     features:
 *                       $ref: '#/components/schemas/PropertyFeatures'
 *                     contact_info_id:
 *                       type: string
 *                       description: The ID of the contact information associated with the property
 *                       example: 5f9e8f9e8f9e8f9e8f9e8f9e
 *                     location_id:
 *                       type: string
 *                       description: The ID of the location associated with the property
 *                       example: 5f9e8f9e8f9e8f9e8f9e8f9e
 *       400:
 *         description: Bad request due to invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation error.
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Title is required", "Price must be a number"]
 *       401:
 *         description: Unauthorized access. Only admin users can create properties.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong.
 */

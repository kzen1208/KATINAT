# Katinat Coffee API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
Most endpoints require authentication. Include the JWT token in the request header:
```
x-auth-token: YOUR_TOKEN
```

## Error Responses
All endpoints return errors in the following format:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Endpoints

### Authentication

#### Register User
- **URL**: `/users/register`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "phone": "0123456789"
}
```
- **Success Response**:
```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

#### Login User
- **URL**: `/users/login`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Success Response**:
```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

#### Logout User
- **URL**: `/users/logout`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
```json
{
  "success": true,
  "data": {}
}
```

#### Get Current User Profile
- **URL**: `/users/profile`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "0123456789",
    "role": "customer",
    "addresses": [
      {
        "street": "123 Street",
        "city": "City",
        "district": "District",
        "isDefault": true
      }
    ]
  }
}
```

#### Update User Profile
- **URL**: `/users/profile`
- **Method**: `PUT`
- **Auth required**: Yes
- **Body**:
```json
{
  "name": "Updated Name",
  "phone": "9876543210"
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "Updated Name",
    "email": "user@example.com",
    "phone": "9876543210",
    "role": "customer"
  }
}
```

#### Add User Address
- **URL**: `/users/address`
- **Method**: `POST`
- **Auth required**: Yes
- **Body**:
```json
{
  "street": "123 Street",
  "city": "City",
  "district": "District",
  "isDefault": true
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "street": "123 Street",
      "city": "City",
      "district": "District",
      "isDefault": true
    }
  ]
}
```

### Products

#### Get All Products
- **URL**: `/products`
- **Method**: `GET`
- **Auth required**: No
- **Query Parameters**:
  - `category`: Filter by category
  - `featured`: Filter featured products (true/false)
  - `search`: Search by name or description
  - `sort`: Sort by field (e.g., `name`, `-basePrice` for descending)
  - `page`: Page number
  - `limit`: Items per page
- **Success Response**:
```json
{
  "success": true,
  "count": 2,
  "total": 10,
  "pagination": {
    "page": 1,
    "limit": 10,
    "pages": 1
  },
  "data": [
    {
      "id": "product_id",
      "name": "Cà Phê Phin Mê",
      "description": "Cà phê đen truyền thống được pha từ phin, đậm đà và thơm ngon",
      "basePrice": 29000,
      "image": "img/Phin mê.jpg",
      "category": "coffee",
      "featured": true,
      "customizationOptions": [
        {
          "name": "Kích cỡ",
          "isRequired": true,
          "multiSelect": false,
          "options": [
            {
              "name": "Nhỏ",
              "price": 0
            },
            {
              "name": "Vừa",
              "price": 5000
            }
          ]
        }
      ]
    }
  ]
}
```

#### Get Single Product
- **URL**: `/products/:id`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "id": "product_id",
    "name": "Cà Phê Phin Mê",
    "description": "Cà phê đen truyền thống được pha từ phin, đậm đà và thơm ngon",
    "basePrice": 29000,
    "image": "img/Phin mê.jpg",
    "category": "coffee",
    "featured": true,
    "customizationOptions": [
      {
        "name": "Kích cỡ",
        "isRequired": true,
        "multiSelect": false,
        "options": [
          {
            "name": "Nhỏ",
            "price": 0
          },
          {
            "name": "Vừa",
            "price": 5000
          }
        ]
      }
    ]
  }
}
```

#### Create Product (Admin only)
- **URL**: `/products`
- **Method**: `POST`
- **Auth required**: Yes (Admin)
- **Body**:
```json
{
  "name": "New Coffee",
  "description": "Description",
  "basePrice": 35000,
  "image": "img/new-coffee.jpg",
  "category": "coffee",
  "featured": false,
  "customizationOptions": [
    {
      "name": "Kích cỡ",
      "isRequired": true,
      "multiSelect": false,
      "options": [
        {
          "name": "Nhỏ",
          "price": 0
        },
        {
          "name": "Vừa",
          "price": 5000
        }
      ]
    }
  ]
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "id": "product_id",
    "name": "New Coffee",
    "description": "Description",
    "basePrice": 35000,
    "image": "img/new-coffee.jpg",
    "category": "coffee",
    "featured": false,
    "customizationOptions": [
      {
        "name": "Kích cỡ",
        "isRequired": true,
        "multiSelect": false,
        "options": [
          {
            "name": "Nhỏ",
            "price": 0
          },
          {
            "name": "Vừa",
            "price": 5000
          }
        ]
      }
    ]
  }
}
```

### Orders

#### Get All Orders (Admin only)
- **URL**: `/orders`
- **Method**: `GET`
- **Auth required**: Yes (Admin)
- **Success Response**:
```json
{
  "success": true,
  "count": 2,
  "pagination": {
    "page": 1,
    "limit": 10,
    "pages": 1
  },
  "data": [
    {
      "id": "order_id",
      "user": {
        "id": "user_id",
        "name": "User Name",
        "email": "user@example.com"
      },
      "items": [
        {
          "product": {
            "id": "product_id",
            "name": "Cà Phê Phin Mê"
          },
          "quantity": 2,
          "selectedOptions": [
            {
              "category": "Kích cỡ",
              "options": ["Vừa"]
            }
          ],
          "itemPrice": 68000
        }
      ],
      "subtotal": 68000,
      "tax": 6800,
      "deliveryFee": 15000,
      "discount": 0,
      "total": 89800,
      "paymentMethod": "cash",
      "deliveryType": "delivery",
      "status": "pending",
      "createdAt": "2023-05-20T10:30:00.000Z"
    }
  ]
}
```

#### Get User Orders
- **URL**: `/orders/my-orders`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "order_id",
      "items": [
        {
          "product": {
            "id": "product_id",
            "name": "Cà Phê Phin Mê"
          },
          "quantity": 2,
          "selectedOptions": [
            {
              "category": "Kích cỡ",
              "options": ["Vừa"]
            }
          ],
          "itemPrice": 68000
        }
      ],
      "subtotal": 68000,
      "tax": 6800,
      "deliveryFee": 15000,
      "discount": 0,
      "total": 89800,
      "paymentMethod": "cash",
      "deliveryType": "delivery",
      "status": "pending",
      "createdAt": "2023-05-20T10:30:00.000Z"
    }
  ]
}
```

#### Create Order
- **URL**: `/orders`
- **Method**: `POST`
- **Auth required**: Yes
- **Body**:
```json
{
  "items": [
    {
      "product": "product_id",
      "quantity": 2,
      "selectedOptions": [
        {
          "category": "Kích cỡ",
          "options": ["Vừa"]
        }
      ],
      "itemPrice": 68000
    }
  ],
  "subtotal": 68000,
  "tax": 6800,
  "deliveryFee": 15000,
  "discount": 0,
  "total": 89800,
  "paymentMethod": "cash",
  "deliveryType": "delivery",
  "deliveryTime": "2023-05-20T11:30:00.000Z",
  "address": {
    "street": "123 Street",
    "city": "City",
    "district": "District",
    "notes": "Call when arrived"
  },
  "store": "store_id"
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "id": "order_id",
    "user": "user_id",
    "items": [
      {
        "product": "product_id",
        "quantity": 2,
        "selectedOptions": [
          {
            "category": "Kích cỡ",
            "options": ["Vừa"]
          }
        ],
        "itemPrice": 68000
      }
    ],
    "subtotal": 68000,
    "tax": 6800,
    "deliveryFee": 15000,
    "discount": 0,
    "total": 89800,
    "paymentMethod": "cash",
    "deliveryType": "delivery",
    "deliveryTime": "2023-05-20T11:30:00.000Z",
    "status": "pending",
    "createdAt": "2023-05-20T10:30:00.000Z"
  }
}
```

### Stores

#### Get All Stores
- **URL**: `/stores`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "store_id",
      "name": "Katinat Lý Thường Kiệt",
      "address": {
        "street": "129 Lý Thường Kiệt",
        "district": "Quận 10",
        "city": "TP. Hồ Chí Minh",
        "coordinates": {
          "latitude": 10.7721,
          "longitude": 106.6619
        }
      },
      "phone": "0283 123 4567",
      "email": "lythuongkiet@katinat.com",
      "images": ["img/Ly Thuong Kiet.jpg"],
      "operatingHours": [
        {
          "day": "monday",
          "open": "07:00",
          "close": "22:00",
          "isClosed": false
        }
      ],
      "features": ["wifi", "parking", "air-conditioning", "power-outlets"]
    }
  ]
}
```

### News

#### Get All News
- **URL**: `/news`
- **Method**: `GET`
- **Auth required**: No
- **Query Parameters**:
  - `category`: Filter by category
  - `tag`: Filter by tag
- **Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "news_id",
      "title": "Khai trương cửa hàng mới tại Quận 7",
      "content": "<p>Katinat Coffee vui mừng thông báo khai trương cửa hàng mới tại Quận 7, TP. Hồ Chí Minh.</p>",
      "summary": "Katinat Coffee khai trương cửa hàng mới tại Quận 7 với nhiều ưu đãi hấp dẫn",
      "image": "img/sap.jpg",
      "author": {
        "name": "Admin User"
      },
      "category": "announcement",
      "tags": ["khai trương", "cửa hàng mới", "quận 7"],
      "published": true,
      "publishDate": "2023-05-15T08:00:00.000Z"
    }
  ]
}
```

## Webhooks

### Stripe Payment Webhook
- **URL**: `/webhook/stripe`
- **Method**: `POST`
- **Auth required**: No (Stripe signature verification)
- **Description**: Handles Stripe payment events

## Socket.IO Events

### Order Status Updates
- **Event**: `order:update`
- **Data**:
```json
{
  "orderId": "order_id",
  "status": "confirmed"
}
```

### New Order Notification
- **Event**: `order:new`
- **Data**:
```json
{
  "orderId": "order_id",
  "store": "store_id"
}
```
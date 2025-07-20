const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Store = require('../models/Store');
const News = require('../models/News');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/katinat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.log('MongoDB connection error:', err);
  process.exit(1);
});

// Seed data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Store.deleteMany({});
    await News.deleteMany({});
    
    console.log('Previous data cleared');
    
    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@katinat.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('Admin user created');
    
    // Create products
    const products = [
      {
        name: 'Cà Phê Phin Mê',
        description: 'Cà phê đen truyền thống được pha từ phin, đậm đà và thơm ngon',
        basePrice: 29000,
        image: 'img/Phin mê.jpg',
        category: 'coffee',
        featured: true,
        customizationOptions: [
          {
            name: 'Kích cỡ',
            isRequired: true,
            multiSelect: false,
            options: [
              { name: 'Nhỏ', price: 0 },
              { name: 'Vừa', price: 5000 },
              { name: 'Lớn', price: 10000 }
            ]
          },
          {
            name: 'Đường',
            isRequired: false,
            multiSelect: false,
            options: [
              { name: 'Không đường', price: 0 },
              { name: 'Ít đường', price: 0 },
              { name: 'Vừa đường', price: 0 },
              { name: 'Nhiều đường', price: 0 }
            ]
          }
        ]
      },
      {
        name: 'Cà Phê Sữa Đá',
        description: 'Cà phê đen kết hợp với sữa đặc, thơm béo và đậm đà',
        basePrice: 35000,
        image: 'img/cf phô mai.jpg',
        category: 'coffee',
        featured: true,
        customizationOptions: [
          {
            name: 'Kích cỡ',
            isRequired: true,
            multiSelect: false,
            options: [
              { name: 'Nhỏ', price: 0 },
              { name: 'Vừa', price: 5000 },
              { name: 'Lớn', price: 10000 }
            ]
          },
          {
            name: 'Đá',
            isRequired: false,
            multiSelect: false,
            options: [
              { name: 'Ít đá', price: 0 },
              { name: 'Vừa đá', price: 0 },
              { name: 'Nhiều đá', price: 0 }
            ]
          }
        ]
      },
      {
        name: 'Trà Hồng Đào',
        description: 'Trà hoa quả thơm ngon với vị đào tươi mát',
        basePrice: 45000,
        image: 'img/Hồng đào.png',
        category: 'tea',
        featured: true,
        customizationOptions: [
          {
            name: 'Kích cỡ',
            isRequired: true,
            multiSelect: false,
            options: [
              { name: 'Nhỏ', price: 0 },
              { name: 'Vừa', price: 5000 },
              { name: 'Lớn', price: 10000 }
            ]
          },
          {
            name: 'Đá',
            isRequired: false,
            multiSelect: false,
            options: [
              { name: 'Ít đá', price: 0 },
              { name: 'Vừa đá', price: 0 },
              { name: 'Nhiều đá', price: 0 }
            ]
          },
          {
            name: 'Đường',
            isRequired: false,
            multiSelect: false,
            options: [
              { name: 'Không đường', price: 0 },
              { name: 'Ít đường', price: 0 },
              { name: 'Vừa đường', price: 0 },
              { name: 'Nhiều đường', price: 0 }
            ]
          }
        ]
      }
    ];
    
    await Product.insertMany(products);
    console.log('Products created');
    
    // Create stores
    const stores = [
      {
        name: 'Katinat Lý Thường Kiệt',
        address: {
          street: '129 Lý Thường Kiệt',
          district: 'Quận 10',
          city: 'TP. Hồ Chí Minh',
          coordinates: {
            latitude: 10.7721,
            longitude: 106.6619
          }
        },
        phone: '0283 123 4567',
        email: 'lythuongkiet@katinat.com',
        images: ['img/Ly Thuong Kiet.jpg'],
        operatingHours: [
          { day: 'monday', open: '07:00', close: '22:00', isClosed: false },
          { day: 'tuesday', open: '07:00', close: '22:00', isClosed: false },
          { day: 'wednesday', open: '07:00', close: '22:00', isClosed: false },
          { day: 'thursday', open: '07:00', close: '22:00', isClosed: false },
          { day: 'friday', open: '07:00', close: '22:30', isClosed: false },
          { day: 'saturday', open: '07:00', close: '22:30', isClosed: false },
          { day: 'sunday', open: '07:00', close: '22:00', isClosed: false }
        ],
        features: ['wifi', 'parking', 'air-conditioning', 'power-outlets']
      },
      {
        name: 'Katinat Trần Phú',
        address: {
          street: '26 Trần Phú',
          district: 'Quận 5',
          city: 'TP. Hồ Chí Minh',
          coordinates: {
            latitude: 10.7559,
            longitude: 106.6578
          }
        },
        phone: '0283 456 7890',
        email: 'tranphu@katinat.com',
        images: ['img/Tran Phu.jpg'],
        operatingHours: [
          { day: 'monday', open: '07:00', close: '22:00', isClosed: false },
          { day: 'tuesday', open: '07:00', close: '22:00', isClosed: false },
          { day: 'wednesday', open: '07:00', close: '22:00', isClosed: false },
          { day: 'thursday', open: '07:00', close: '22:00', isClosed: false },
          { day: 'friday', open: '07:00', close: '22:30', isClosed: false },
          { day: 'saturday', open: '07:00', close: '22:30', isClosed: false },
          { day: 'sunday', open: '07:00', close: '22:00', isClosed: false }
        ],
        features: ['wifi', 'outdoor-seating', 'air-conditioning']
      }
    ];
    
    await Store.insertMany(stores);
    console.log('Stores created');
    
    // Create news
    const news = [
      {
        title: 'Khai trương cửa hàng mới tại Quận 7',
        content: '<p>Katinat Coffee vui mừng thông báo khai trương cửa hàng mới tại Quận 7, TP. Hồ Chí Minh. Đây là cửa hàng thứ 10 của chúng tôi tại thành phố.</p><p>Nhân dịp khai trương, chúng tôi có nhiều ưu đãi hấp dẫn dành cho khách hàng.</p>',
        summary: 'Katinat Coffee khai trương cửa hàng mới tại Quận 7 với nhiều ưu đãi hấp dẫn',
        image: 'img/sap.jpg',
        author: admin._id,
        category: 'announcement',
        tags: ['khai trương', 'cửa hàng mới', 'quận 7'],
        published: true,
        publishDate: new Date()
      },
      {
        title: 'Ưu đãi mùa hè - Giảm 30% tất cả đồ uống đá',
        content: '<p>Chào hè rực rỡ với chương trình giảm giá đặc biệt từ Katinat Coffee. Từ ngày 01/06 đến 30/06, giảm 30% tất cả đồ uống đá khi đặt hàng qua ứng dụng.</p><p>Hãy tải ứng dụng Katinat Coffee ngay hôm nay để không bỏ lỡ ưu đãi!</p>',
        summary: 'Giảm 30% tất cả đồ uống đá khi đặt hàng qua ứng dụng từ 01/06 đến 30/06',
        image: 'img/sale.jpg',
        author: admin._id,
        category: 'promotion',
        tags: ['ưu đãi', 'giảm giá', 'mùa hè'],
        published: true,
        publishDate: new Date()
      }
    ];
    
    await News.insertMany(news);
    console.log('News created');
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
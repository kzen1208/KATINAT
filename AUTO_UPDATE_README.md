# Tự động cập nhật lên GitHub

Hệ thống này giúp tự động cập nhật các thay đổi lên GitHub và triển khai trang web.

## Cách sử dụng

### 1. Tự động theo dõi và cập nhật

Chạy lệnh sau để bắt đầu theo dõi các thay đổi và tự động đẩy lên GitHub:

```bash
npm run auto-update
```

Khi bạn thay đổi bất kỳ file HTML, CSS, JS hoặc hình ảnh nào, hệ thống sẽ tự động commit và push lên GitHub sau 5 giây.

### 2. Cập nhật thủ công

Nếu bạn muốn đẩy các thay đổi lên GitHub thủ công:

```bash
npm run deploy
```

hoặc

```bash
./auto-push.sh "Nội dung commit của bạn"
```

### 3. Cấu hình

Bạn có thể thay đổi cấu hình trong file `auto-update.js`:

- `watchPaths`: Các đường dẫn cần theo dõi
- `ignorePaths`: Các thư mục bỏ qua
- `commitMessage`: Tiền tố cho commit message
- `debounceTime`: Thời gian chờ trước khi commit (mili giây)

## GitHub Actions

Mỗi khi có thay đổi được đẩy lên nhánh `main`, GitHub Actions sẽ tự động:

1. Checkout code mới nhất
2. Cài đặt Node.js và các dependencies
3. Build dự án (nếu cần)
4. Triển khai lên GitHub Pages

Bạn có thể xem trạng thái triển khai trong tab "Actions" trên GitHub repository.
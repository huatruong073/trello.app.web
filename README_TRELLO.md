# Trello App Web

React Router v7 application với TypeScript, TailwindCSS và authentication system kết nối với .NET 9 API Service

HttpClient được xây dựng với Axios và hỗ trợ đầy đủ các HTTP methods:

```tsx
import { httpClient } from "~/services/http-client";

// GET request
const boards = await httpClient.get<Board[]>("/api/boards");

// POST request
const newBoard = await httpClient.post<Board>("/api/boards", {
  name: "My Board",
});

// PUT request
const updatedBoard = await httpClient.put<Board>(
  `/api/boards/${id}`,
  updateData
);

// DELETE request
await httpClient.delete(`/api/boards/${id}`);

// Upload file
const result = await httpClient.upload("/api/upload", file, (progress) => {
  console.log("Upload progress:", progress);
});

// Download file
await httpClient.download("/api/files/document.pdf", "document.pdf");
```

### HttpClient Features:

- ✅ Automatic Bearer token attachment
- ✅ Request/Response interceptors
- ✅ Error handling with custom ApiError
- ✅ File upload/download support
- ✅ Timeout configuration
- ✅ TypeScript supportnd.

## Tính năng

- ✅ React Router v7 với TypeScript
- ✅ TailwindCSS cho styling
- ✅ Chức năng đăng nhập và quản lý phiên
- ✅ Tự động refresh token
- ✅ Protected routes
- ✅ Responsive design
- ✅ Error handling

## Cấu trúc project

```
app/
├── components/          # Reusable components
│   ├── header.tsx
│   ├── loading.tsx
│   └── protected-route.tsx
├── contexts/           # React contexts
│   └── auth.context.tsx
├── hooks/              # Custom hooks
│   └── useTokenRefresh.ts
├── routes/             # Page components
│   ├── dashboard.tsx
│   ├── home.tsx
│   └── login.tsx
├── services/           # API services
│   └── auth.service.ts
├── types/              # TypeScript types
│   └── auth.ts
├── app.css
├── root.tsx
└── routes.ts
```

## API Integration

Ứng dụng kết nối với .NET 9 backend qua các endpoints:

- `POST /Auth/login` - Đăng nhập
  - Input: `{ UserName: string, Password: string }`
  - Output: `{ AccessToken: string, RefreshToken: string }`
- `POST /Auth/refresh` - Refresh token
- `POST /Auth/logout` - Đăng xuất

## Cấu hình

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật `VITE_API_URL` để trỏ đến backend API của bạn.

## Development

1. Cài đặt dependencies:

```bash
npm install
```

2. Chạy development server:

```bash
npm run dev
```

3. Kiểm tra TypeScript:

```bash
npm run typecheck
```

4. Build project:

```bash
npm run build
```

## Authentication Flow

1. User nhập username/password trong form login
2. App gửi request đến `POST /Auth/login`
3. Backend trả về AccessToken và RefreshToken
4. Tokens được lưu trong localStorage
5. AccessToken được dùng cho các API calls tiếp theo
6. RefreshToken tự động được refresh mỗi 15 phút
7. Khi logout, tokens được xóa khỏi localStorage

## Protected Routes

Sử dụng `ProtectedRoute` component để bảo vệ các route cần authentication:

```tsx
import { ProtectedRoute } from "~/components/protected-route";

export default function Dashboard() {
  return <ProtectedRoute>{/* Your protected content */}</ProtectedRoute>;
}
```

## State Management

Authentication state được quản lý bởi `AuthContext`:

```tsx
const { user, isAuthenticated, isLoading, login, logout } = useAuth();
```

## API Service

Sử dụng `authService` để thực hiện authenticated requests:

```tsx
import { authService } from "~/services/auth.service";

// Authenticated request
const response = await authService.authenticatedFetch("/api/boards");
```

## Deployment

1. Build project:

```bash
npm run build
```

2. Deploy build folder đến server của bạn

## License

MIT

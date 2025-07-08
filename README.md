# Online Education System - Frontend

Modern, responsive ve kullanıcı dostu bir online eğitim sistemi frontend uygulaması. React, TypeScript ve Tailwind CSS kullanılarak geliştirilmiştir.

## 🚀 Özellikler

### 👥 Multi-Role Sistemi
- **Öğrenci (Student)**: Kurslara kayıt, ödevler, sınavlar, sertifikalar
- **Eğitmen (Instructor)**: Kurs yönetimi, sınav oluşturma, öğrenci takibi
- **Admin**: Sistem yönetimi, kullanıcı yönetimi, raporlama

### 📚 Kurs Yönetimi
- Kurs oluşturma ve düzenleme
- Kurs materyalleri (PDF, video vb.)
- Kurs kayıt sistemi
- Kurs arşivleme

### 📝 Ödev ve Sınav Sistemi
- Ödev oluşturma ve takibi
- Çoktan seçmeli sınavlar
- Otomatik değerlendirme
- Sonuç raporlama

### 🎓 Sertifika Sistemi
- Otomatik sertifika oluşturma
- Sertifika görüntüleme
- Sertifika indirme

### 💬 Forum Sistemi
- Kurs bazlı tartışma forumları
- Mesaj gönderme ve silme
- Rol tabanlı izinler

## 🛠️ Teknolojiler

### Frontend Framework
- **React 18.3.1** - Modern React hooks ve component architecture
- **TypeScript** - Type safety ve developer experience
- **Vite** - Hızlı build tool ve dev server

### UI/UX
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Modern icon library
- **React Icons** - Kapsamlı icon koleksiyonu

### State Management & Routing
- **React Router DOM** - Client-side routing
- **React Context API** - Global state management
- **Local Storage** - Token ve kullanıcı bilgileri

### Form Management
- **Formik** - Form state management
- **Yup** - Schema validation
- **React Hook Form** - Performant forms with easy validation

### API & Auth
- **JWT (JSON Web Tokens)** - Authentication
- **JWT Decode** - Token parsing
- **Axios** - HTTP client (configured)
- **Fetch API** - Native HTTP requests

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS post-processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Proje Yapısı

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui components
│   ├── AdminHeader.tsx  # Admin panel header
│   ├── DataTable.tsx    # Data table component
│   ├── FormModal.tsx    # Modal form component
│   ├── LoginCard.tsx    # Login form card
│   ├── Navbar.tsx       # Navigation bar
│   ├── SignupCard.tsx   # Signup form card
│   └── Sidebar.tsx      # Admin sidebar
├── context/
│   └── AuthContext.tsx  # Authentication context
├── hooks/
│   ├── useAuth.ts       # Authentication hook
│   └── use-mobile.tsx   # Mobile detection hook
├── layouts/
│   ├── AdminLayout.tsx  # Admin panel layout
│   └── UserLayout.tsx   # User dashboard layout
├── lib/
│   ├── constants.ts     # API constants
│   └── utils.ts         # Utility functions
├── pages/
│   ├── admin/           # Admin panel pages
│   │   ├── Archive.tsx
│   │   ├── Assignments.tsx
│   │   ├── Certificates.tsx
│   │   ├── Courses.tsx
│   │   ├── Exams.tsx
│   │   ├── Home.tsx
│   │   └── Users.tsx
│   ├── AllCourses.tsx   # All courses page
│   ├── AssignmentDetails.tsx
│   ├── Assignments.tsx
│   ├── Certificates.tsx
│   ├── CourseDetails.tsx
│   ├── CreateExam.tsx
│   ├── Forum.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Materials.tsx
│   ├── Quiz.tsx
│   ├── Signup.tsx
│   └── UserCourses.tsx
├── routes/
│   ├── AppRouter.tsx    # Main routing configuration
│   ├── ProtectedRoute.tsx # Route protection
│   └── routesConfig.ts  # Route configurations
├── services/
│   ├── ApiHelper.ts     # API service layer
│   └── AuthHelper.ts    # Authentication helpers
└── assets/
    └── css/             # Custom CSS files
```

## 🔧 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (16+)
- npm veya yarn
- Backend API (https://localhost:7170/api)

### Kurulum
```bash
# Repository'yi klonlayın
git clone https://github.com/Poeron/OnlineEducationSystem-Frontend.git

# Proje dizinine gidin
cd OnlineEducationSystem-Frontend

# Bağımlılıkları yükleyin
npm install

# Development server'ı başlatın
npm run dev

# Build için
npm run build

# Preview için
npm run preview
```

## 🔐 Kimlik Doğrulama

### JWT Token Sistemi
- Login sonrası JWT token localStorage'da saklanır
- Token decoder ile kullanıcı bilgileri çıkarılır
- Rol tabanlı yetkilendirme (student, instructor, admin)

### Korumalı Rotalar
```typescript
// ProtectedRoute component örneği
<ProtectedRoute role="student">
  <StudentDashboard />
</ProtectedRoute>
```

## 📋 API Entegrasyonu

### API Helper Functions
```typescript
// API service methods
export const get = async (url: string)
export const post = async (url: string, body?: object)
export const patch = async (url: string, body?: object)
export const remove = async (url: string)
```

### Backend API Base URL
```typescript
export const URL = "https://localhost:7170/api";
```

## 🎨 UI Components

### Shadcn/ui Components
- Alert Dialog
- Button
- Card
- Input
- Label
- Table
- Textarea
- Switch
- Separator
- Skeleton
- Tooltip

### Custom Components
- **DataTable**: Veri tablosu ile CRUD işlemleri
- **FormModal**: Modal form componenti
- **AdminHeader**: Admin panel header
- **Navbar**: Navigation bar
- **Sidebar**: Admin sidebar

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS breakpoints
- Responsive navigation
- Mobile-friendly forms
- Touch-friendly interfaces

## 🔄 State Management

### React Context API
```typescript
// AuthContext örneği
const AuthContext = createContext<AuthContextType>({
  token: null,
  login: (token: string) => {},
  logout: () => {}
});
```

### Local Storage
- JWT token persistence
- User preferences
- Session management

## 🚦 Routing Structure

### Public Routes
- `/` - Login page
- `/login` - Login page
- `/signup` - Signup page

### Student Routes (`/student/*`)
- `/home` - Student dashboard
- `/mycourses` - My courses
- `/assignments` - Assignments
- `/certificates` - Certificates
- `/allcourses` - All available courses

### Instructor Routes (`/instructor/*`)
- `/home` - Instructor dashboard
- `/courses` - Manage courses
- `/courses/:id/students` - Course students
- `/courses/:id/quiz` - Create exams

### Admin Routes (`/admin/*`)
- `/home` - Admin dashboard
- `/users` - User management
- `/courses` - Course management
- `/exams` - Exam management
- `/certificates` - Certificate management

## 📊 Form Validation

### Yup Schemas
```typescript
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .min(4, "Minimum 4 characters")
    .required("Password is required")
});
```

### Formik Integration
- Form state management
- Validation handling
- Error messages
- Submit handling

## 🎯 Features by Role

### Student Features
- ✅ Course enrollment
- ✅ Assignment submission
- ✅ Take exams/quizzes
- ✅ View certificates
- ✅ Forum participation
- ✅ Course materials access

### Instructor Features
- ✅ Course creation and management
- ✅ Assignment creation
- ✅ Exam creation with multiple choice questions
- ✅ Student management
- ✅ Grade assignments
- ✅ Forum moderation

### Admin Features
- ✅ User management (CRUD)
- ✅ Course management (CRUD)
- ✅ Exam management (CRUD)
- ✅ Certificate management
- ✅ System statistics
- ✅ Archive management

## 🔍 Code Quality

### TypeScript
- Strict typing
- Interface definitions
- Type safety
- IntelliSense support

### ESLint Configuration
```javascript
// ESLint rules
{
  "extends": ["@typescript-eslint/recommended"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## 🎨 Styling

### Tailwind CSS
- Utility-first approach
- Custom color palette
- Responsive utilities
- Dark mode support

### Custom CSS
- Admin panel styles
- Animation effects
- Gradient backgrounds
- Custom components

## 📦 Build & Deployment

### Build Commands
```bash
# Development build
npm run dev

# Production build
npm run build

# Type checking
npm run lint

# Preview build
npm run preview
```

### Build Configuration
```typescript
// Vite config
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

## 🔒 Security

### Authentication
- JWT token based authentication
- Role-based access control
- Protected routes
- Token expiration handling

### Input Validation
- Client-side validation with Yup
- Form sanitization
- XSS protection
- CSRF protection

## 🐛 Error Handling

### Error Boundaries
- Global error handling
- User-friendly error messages
- API error handling
- Network error handling

### Validation Errors
- Real-time form validation
- Field-level error messages
- Schema validation
- User feedback

## 📈 Performance

### Optimization
- Code splitting
- Lazy loading
- Efficient re-renders
- Optimized bundle size

### Best Practices
- React hooks optimization
- Memoization
- Efficient state updates
- Bundle analysis

## 🧪 Testing

### Testing Strategy
- Component testing
- Integration testing
- E2E testing
- API testing

## 🚀 Deployment

### Environment Variables
```env
VITE_API_URL=https://localhost:7170/api
VITE_APP_NAME=Online Education System
```

### Build for Production
```bash
npm run build
# Generates dist/ folder for deployment
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Video conferencing integration
- [ ] Mobile app development
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Offline capability
- [ ] Advanced search and filters
- [ ] Integration with external LMS
- [ ] Advanced reporting system
- [ ] Calendar integration

---

**Developer:** Ronay Tez  
**Project Type:** Online Education System Frontend  
**Technology Stack:** React + TypeScript + Tailwind CSS  
**Build Tool:** Vite  
**UI Framework:** Radix UI + Shadcn/ui

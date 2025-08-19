# Product & Category Manager

A modern, full-stack admin dashboard for managing products and categories built with Next.js, TypeScript, and ShadCN UI.

## 🚀 Features

### Core Functionality
- **Product Management**: Full CRUD operations for products using DummyJSON API
- **Category Management**: Local category management with persistent storage
- **Advanced Search & Filtering**: Real-time search with price range, category, and sorting filters
- **Responsive Design**: Mobile-first design that works on all devices
- **Theme Support**: Light and dark mode with system preference detection

### Technical Features
- **Form Validation**: React Hook Form with Zod schema validation
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Skeleton loaders and loading indicators
- **Data Persistence**: Local storage for categories, API integration for products
- **Type Safety**: Full TypeScript implementation with strict typing

### UI/UX Features
- **Modern Design**: Clean, professional interface using ShadCN UI components
- **Interactive Sidebar**: Collapsible navigation with quick actions
- **Global Search**: Search across products and categories from anywhere
- **Data Tables**: Sortable, filterable tables with pagination
- **Modal Dialogs**: Intuitive forms for adding and editing items
- **Toast Notifications**: User feedback for all actions

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **API**: DummyJSON for products, Local Storage for categories

## 📦 Installation

1. **Clone or download the project**
   \`\`\`bash
   # If using GitHub integration
   git clone <repository-url>
   cd product-category-manager
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── categories/         # Category management pages
│   ├── products/          # Product management pages
│   └── page.tsx           # Dashboard homepage
├── components/            # Reusable UI components
│   ├── ui/               # ShadCN UI components
│   ├── sidebar.tsx       # Navigation sidebar
│   ├── header.tsx        # Top navigation header
│   └── ...               # Feature-specific components
├── lib/                  # Utility functions and API
│   ├── api.ts           # DummyJSON API integration
│   ├── local-storage.ts # Local storage utilities
│   └── utils.ts         # General utilities
├── types/               # TypeScript type definitions
└── README.md           # This file
\`\`\`

## 🎯 Key Features Explained

### Product Management
- **API Integration**: Connects to DummyJSON API for realistic product data
- **CRUD Operations**: Create, read, update, and delete products
- **Form Validation**: Comprehensive validation for all product fields
- **Image Support**: Product thumbnail URL validation and display

### Category Management
- **Local Storage**: Categories are managed locally for demonstration
- **API Sync**: Automatically syncs with categories from DummyJSON API
- **Duplicate Prevention**: Prevents duplicate category names
- **Persistent Data**: Categories persist across browser sessions

### Advanced Filtering
- **Multi-criteria Search**: Search by title, description, category, and price
- **Price Range Slider**: Interactive price range selection
- **Sort Options**: Multiple sorting criteria with ascending/descending order
- **Active Filter Display**: Visual indicators for applied filters
- **Filter Persistence**: Maintains filter state during navigation

### User Experience
- **Loading States**: Skeleton loaders for better perceived performance
- **Error Handling**: Graceful error handling with user-friendly messages
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## 🎨 Design Philosophy

The application follows modern admin dashboard design principles:

- **Clean Interface**: Minimal clutter with focus on functionality
- **Consistent Spacing**: Uniform spacing and typography throughout
- **Color System**: Professional color palette with proper contrast ratios
- **Interactive Elements**: Hover states, transitions, and visual feedback
- **Information Hierarchy**: Clear visual hierarchy for easy scanning

## 🔧 Customization

### Adding New Features
1. Create new pages in the `app/` directory
2. Add corresponding navigation items in `components/sidebar.tsx`
3. Implement API functions in `lib/api.ts` if needed
4. Add TypeScript types in `types/index.ts`

### Styling Modifications
- Modify `app/globals.css` for global styles
- Update component styles using Tailwind CSS classes
- Customize the color scheme in the CSS custom properties

### API Integration
- Replace DummyJSON endpoints in `lib/api.ts` with your own API
- Update TypeScript interfaces in `types/index.ts` to match your data structure
- Modify form validation schemas in component files

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

This project was built as a technical assignment demonstration. For production use:

1. Replace mock API with real backend integration
2. Add authentication and authorization
3. Implement proper error logging
4. Add comprehensive testing suite
5. Set up CI/CD pipeline

## 📄 License

This project is created for demonstration purposes. Feel free to use it as a reference for your own projects.

---

**Built with ❤️ using Next.js, TypeScript, and ShadCN UI**

# Read Receipts - Team Decision Alignment Tool

A modern internal tool for tracking team decision alignment and progress. Built for companies like DoorDash to manage cross-functional decisions with clear approval workflows and audit trails.

## 🚀 Features

### Core Functionality
- **Decision Management**: Create, track, and manage team decisions
- **Approval Workflows**: Request and track team member approvals
- **Status Tracking**: Real-time status updates (Pending, Aligned, Overdue)
- **Audit Trail**: Complete "receipts" of who approved what and when
- **Modal Interface**: Seamless modal overlays for decision details

### User Experience
- **Dashboard Views**: "My Decisions" and "Mentioning Me" tabs
- **Status Indicators**: Color-coded pills (Orange "Needs You", Yellow "Pending", Green "Aligned", Red "Overdue")
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Automatic refresh and manual refresh options
- **Smooth Animations**: Framer Motion powered interactions

### Technical Stack
- **Frontend**: React 18 + TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js + TypeScript, Zod validation
- **Architecture**: Monorepo with shared types
- **Development**: Vite, Hot reload, Concurrent development servers

## 🏗️ Project Structure

```
read-receipts/
├── frontend/          # React frontend application
├── backend/           # Express.js API server
├── shared/            # Shared TypeScript types
├── start-dev.sh       # Development startup script
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
git clone <your-repo-url>
cd read-receipts
npm install
```

2. **Start development servers:**
```bash
# Make the startup script executable
chmod +x start-dev.sh

# Start both frontend and backend
./start-dev.sh
```

3. **Access the application:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:3001

## 🎯 Usage

### Creating Decisions
1. Click "+ New Decision" button
2. Fill in decision details:
   - **Title**: Clear decision name
   - **Details**: Context and options
   - **Due Date**: When alignment is needed
   - **Approvers**: Select team members
3. Click "Create Decision"

### Managing Decisions
- **My Decisions**: View decisions you've created
- **Mentioning Me**: View decisions where you're an approver
- **Status Pills**: 
  - 🟠 Orange "Needs You": Your approval required
  - 🟡 Yellow "Pending": Waiting for others
  - 🟢 Green "Aligned": All approvals received
  - 🔴 Red "Overdue": Past due date

### Decision Details
- Click any decision to open modal
- View team responses and progress
- Approve decisions (if you're an approver)
- See complete audit trail

## 🎨 UI/UX Features

### Modal Interface
- **Dismissible overlays** instead of page navigation
- **Consistent styling** with `bg-black/80` background
- **Smooth animations** powered by Framer Motion
- **Click outside to close** functionality

### Status System
- **Smart status calculation** based on responses and due dates
- **Color-coded indicators** for quick visual scanning
- **Progress bars** showing completion percentage
- **Real-time updates** when approvals are given

### Responsive Design
- **Mobile-friendly** interface
- **Flexible layouts** that adapt to screen size
- **Touch-friendly** interactions
- **Optimized typography** for readability

## 🔧 Development

### Available Scripts

```bash
# Root level
npm run dev          # Start both frontend and backend
npm run build        # Build all packages
npm run clean        # Clean all build artifacts

# Frontend only
cd frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend only
cd backend
npm run dev          # Start with tsx
npm run build        # Build TypeScript
npm run test         # Run tests with Vitest
```

### API Endpoints

```bash
# Decisions
GET    /api/decisions              # List all decisions
GET    /api/decisions/:id          # Get specific decision
POST   /api/decisions              # Create new decision
PUT    /api/decisions/:id/receipts # Update approval stance

# Users
GET    /api/users                  # List all users
GET    /api/users/:id              # Get specific user
```

### Mock Data
The application includes comprehensive mock data for DoorDash employees:
- **Primary User**: Akshat Khandelwal
- **Team Members**: 12 DoorDash employees across different departments
- **Sample Decisions**: Cross-functional decisions requiring alignment
- **Realistic Scenarios**: Mix of pending, aligned, and overdue decisions

## 🎯 Key Features Implemented

### ✅ Decision Management
- Create decisions with title, details, due date, and approvers
- Track approval progress in real-time
- View decision status and team responses
- Automatic status calculation (Pending → Aligned → Overdue)

### ✅ User Experience
- Modal-based decision details (no page navigation)
- Color-coded status indicators
- Responsive design for all screen sizes
- Smooth animations and transitions

### ✅ Team Collaboration
- "My Decisions" vs "Mentioning Me" views
- Clear approval workflows
- Complete audit trail with timestamps
- Progress tracking and notifications

### ✅ Technical Excellence
- TypeScript throughout (frontend, backend, shared types)
- Zod validation for API requests
- Error handling and loading states
- Hot reload development experience

## 🚚 DoorDash Integration

This tool is designed for DoorDash's internal decision-making process:

### Sample Decisions
- **API Selection**: "Choose real-time order tracking API provider"
- **Framework Choices**: "Select mobile app development framework"
- **Design Decisions**: "Finalize restaurant onboarding flow design"
- **Security**: "Choose driver verification security provider"

### Team Structure
- **Cross-functional teams**: Engineering, Product, Design, Operations
- **Department-specific decisions**: Customer Experience, Driver Experience, Merchant Tools
- **Realistic scenarios**: API choices, platform selections, design decisions

## 🔄 Recent Updates

### Latest Features
- ✅ **Modal Interface**: Converted decision details to dismissible overlays
- ✅ **Consistent Styling**: Unified background colors across all modals
- ✅ **Catchy Subtitle**: Updated to "Get team alignment, track decisions, and keep receipts for when you need them"
- ✅ **Orange "Needs You" Pills**: Enhanced visibility for decisions requiring user action
- ✅ **Improved UX**: Better loading states, error handling, and animations

### Technical Improvements
- ✅ **Monorepo Structure**: Organized frontend, backend, and shared packages
- ✅ **Type Safety**: Comprehensive TypeScript coverage
- ✅ **API Integration**: Full backend connectivity with validation
- ✅ **Real-time Updates**: Automatic refresh and manual refresh options

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React 18, TypeScript, and Tailwind CSS
- UI components from shadcn/ui
- Animations powered by Framer Motion
- Backend built with Express.js and Zod validation

---

**Ready to align your team?** 🚀

Get started with Read Receipts and transform how your organization makes and tracks decisions.
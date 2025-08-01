# Aim Assist

Aim Assist is a modern, feature-rich productivity application designed to help you manage goals, targets, and tasks with ease. Built with a focus on real-time collaboration, optimistic UI updates, and a clean, intuitive interface powered by React and Supabase.

## ✨ Key Features

- **Hierarchical Task Management**: Organize your work into a clear structure: Goals → Targets → Nodes → Tasks.
- **Real-time Sync**: Seamlessly syncs data across devices using Supabase real-time subscriptions.
- **Optimistic UI Updates**: Enjoy a snappy and responsive user experience with immediate feedback on your actions.
- **Undo/Redo Functionality**: Never lose your work. Easily undo and redo actions with keyboard shortcuts (Ctrl/Cmd + Z).
- **Secure Authentication**: User authentication is handled securely with Supabase Auth.
- **Theming**: Switch between a sleek **Dark Mode** and a clean **Light Mode**.
- **Component-Based UI**: Built with a modern component library based on **shadcn/ui** and **Radix UI**.
- **Template Marketplace**: Kickstart your projects by importing predefined templates for common goals like learning a new skill or starting a fitness challenge.
- **Responsive Design**: A fully responsive layout that works on both desktop and mobile devices.

## 🚀 Tech Stack

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (with Immer for immutable updates)
- **Backend & Database**: [Supabase](https://supabase.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Linting**: [ESLint](https://eslint.org/)

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or your preferred package manager

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/anuragK2048/aim-assist.git
    cd aim-assist
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Supabase credentials. You can find these in your Supabase project settings.

    ```env
    VITE_SUPABASE_URL=your-supabase-project-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

### Running the Application

Once the installation is complete, you can run the development server:

```sh
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📜 Available Scripts

This project includes the following scripts defined in `package.json`:

- `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
- `npm run build`: Builds the application for production.
- `npm run lint`: Lints the codebase using ESLint to find and fix problems.
- `npm run preview`: Serves the production build locally to preview it before deployment.

## 📂 Project Structure

The project is organized using a feature-sliced architecture to keep the codebase modular and maintainable.

```
/src
├── components/    # Shared UI components (e.g., buttons, inputs)
├── features/      # Feature-based modules (e.g., auth, project-view, marketplace)
│   ├── auth/
│   └── project-view/
├── hooks/         # Custom React hooks
├── lib/           # Core utilities, Supabase client, and helper functions
├── providers/     # React context providers (e.g., ThemeProvider)
├── routes/        # Application routing configuration
├── store/         # Global state management with Zustand
└── types/         # TypeScript type definitions
```

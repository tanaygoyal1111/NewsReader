# 📰 News App (GNews Edition)

A modern, feature-rich news aggregator application built with **React** and **Vite**, powered by the **GNews API**. This application delivers real-time news updates across multiple categories and languages in a clean, responsive interface.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white)

## ✨ Features

- **🌍 Multi-language Support**: Read news in 10+ languages including English, Hindi, Tamil, Telugu, Malayalam, Marathi, Bengali, Gujarati, Kannada, and Punjabi.
- **🔥 Live News Feed**: Stay updated with top headlines and categories like Politics, Business, Technology, and more.
- **🔍 Smart Search**: Easily find articles on specific topics or keywords.
- **🔖 Bookmarks**: Save articles to your "Favorites" list to read them later (persisted locally).
- **🗣️ Text-to-Speech**: Listen to news articles on the go with built-in speech synthesis.
- **📱 Responsive Design**: A mobile-first approach ensuring a great experience on all devices.
- **🔄 Pull-to-Refresh**: Intuitive gesture to refresh news feeds on touch devices.
- **📡 Offline Detection**: Notifies you when you lose internet connectivity.
- **📤 Share**: Easily share interesting articles with friends.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **API**: [GNews API](https://gnews.io/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A valid API key from [GNews](https://gnews.io/) (Free tier available)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/news-gnews.git
    cd news-gnews
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    - Create a `.env` file in the root directory.
    - Copy the contents of `.env.example` or add the following line:
    ```env
    VITE_GNEWS_API_KEY=your_actual_api_key_here
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## 📁 Project Structure

```
news-gnews/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components (Header, ArticleCard, etc.)
│   ├── context/         # React Context (LanguageContext, etc.)
│   ├── pages/           # Page components (Home, Category, Favorites)
│   ├── services/        # API and Database services
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Entry point
├── .env.example         # Example environment variables
├── .gitignore           # Git ignore rules
├── index.html           # HTML entry point
├── package.json         # Project dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GNews API](https://gnews.io/) for providing the news data.
- [Lucide](https://lucide.dev/) for the beautiful icons.

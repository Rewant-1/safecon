<div align="center">
  <h1>🛡️ SafeCon</h1>
  <p><b>Every PDF tool you'll ever need. 100% Private. 100% Browser-based.</b></p>
  
  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/100%25-Client_Side-success?style=for-the-badge" alt="100% Client Side" />
  </p>
</div>

---

SafeCon is a modern, beautifully designed **browser-first PDF and image toolkit**. It runs entirely on your device, ensuring that your sensitive documents never leave your computer. No uploads, no servers, no tracking—just pure performant utilities.

## ✨ Why SafeCon?

- **🔒 Absolute Privacy**: Files are processed entirely client-side using WebAssembly and powerful libraries. Your data never touches a server.
- **⚡ Blazing Fast**: No waiting for file uploads or downloads. Processing happens instantly within your browser.
- **🎨 Elegant UI**: Built with Framer Motion and Tailwind CSS for a buttery smooth, minimalist experience.
- **🛠️ Comprehensive Toolset**: From compression to encryption, it's a one-stop-shop for managing and manipulating your documents.

## 🚀 Features

### 🖼️ Image Tools
- **Compress**: Sculpt file sizes while preserving clarity (JPEG, PNG, WebP).
- **Images to PDF**: Bind scattered visuals into a unified PDF document.
- **PDF to Images**: Extract high-resolution raster images from PDF pages.

### 📁 Organize
- **Merge PDF**: Combine multiple PDFs into a single file seamlessly.
- **Split PDF**: Extract specific pages or distinct ranges effortlessly.
- **Rotate PDF**: Fix document orientation with a single click.

### ✍️ Edit & Annotate
- **Page Numbers**: Stamp sequential numbering on every page automatically.
- **Watermark**: Brand pages with custom text or image overlays.
- **Sign PDF**: Draw and embed your secure handwritten signature instantly.

### 🔐 Security
- **Protect PDF**: Encrypt documents with password-grade AES.
- **Unlock PDF**: Remove existing password protection from your files.

## 💻 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **PDF Processing**: `pdf-lib`, `pdfjs-dist`
- **File Handling**: `jszip`, `file-saver`, `react-dropzone`
- **Icons**: `lucide-react`

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ installed on your machine
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rewant-1/safecon.git
   cd safecon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📂 Project Structure

```text
safecon/
├── public/             # Static assets including icons
├── src/
│   ├── app/            # Next.js App Router endpoints (each tool has its own route)
│   ├── components/     # Reusable React components (UI, FileDropzone, ErrorBand, etc.)
│   ├── hooks/          # Custom React hooks (e.g., useFileProcessor)
│   └── lib/            # Core business logic for PDF/image manipulation
```

## 🌐 Deployment

SafeCon is fully client-rendered and can be hosted seamlessly on platforms like Vercel, Netlify, or Cloudflare pages. 

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRewant-1%2Fsafecon)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License.

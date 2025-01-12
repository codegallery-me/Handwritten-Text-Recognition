# Handwriting to Text - OCR Converter

A modern web application that converts handwritten and printed text from images into digital text using Tesseract.js OCR engine.

## Features

- 📝 Convert handwritten and printed text from images to digital text
- 🖼️ Support for multiple image formats (PNG, JPEG, GIF)
- ⚡ Real-time processing with live preview
- 🔧 Advanced image preprocessing options
- 🌍 Multiple language support
- 📱 Responsive design for all devices
- 🎯 Drag and drop file upload

## Tech Stack

- React 18
- TypeScript
- Tesseract.js
- Tailwind CSS
- Vite
- Lucide React Icons

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/codegallery-me/Handwritten-Text-Recognition.git
cd handwriting-ocr-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Usage Guide

### Basic Usage

1. Open the application in your browser
2. Upload an image by either:
   - Dragging and dropping an image file
   - Clicking "Browse Files" to select an image
3. Wait for the OCR processing to complete
4. View the extracted text in the results panel

### Recognition Settings

#### Language Options
- `eng`: Standard English recognition
- `eng_best`: High-accuracy English recognition (slower)
- `osd`: Auto-detect orientation and script

#### Preprocessing Options
- `none`: No preprocessing
- `bw`: Black & White mode (best for handwriting)
- `sharpen`: Sharpened mode (best for printed text)

## API Documentation

### Component Structure

```typescript
interface Settings {
  language: 'eng' | 'eng_best' | 'osd';
  preprocessing: 'none' | 'bw' | 'sharpen';
}

interface AppProps {}

interface AppState {
  image: string | null;
  text: string;
  loading: boolean;
  error: string | null;
  settings: Settings;
}
```

### Core Functions

#### `handleFile(file: File) => void`
Processes the uploaded file and initiates OCR.

Parameters:
- `file`: The image file to process

#### `preprocessImage(imageData: string) => Promise<string>`
Applies preprocessing filters to the image before OCR.

Parameters:
- `imageData`: Base64 encoded image string
Returns:
- Promise resolving to processed image data URL

#### `processImage(imageData: string) => Promise<void>`
Performs OCR on the image using Tesseract.js.

Parameters:
- `imageData`: Base64 encoded image string

### Tesseract Configuration

```typescript
{
  tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?-_\'"\n ',
  tessedit_pageseg_mode: '6',
  tessjs_create_pdf: '0',
  tessjs_create_hocr: '0',
  tessjs_create_tsv: '0'
}
```

## Best Practices for Optimal Results

1. **Image Quality**
   - Use clear, well-lit images
   - Ensure good contrast between text and background
   - Avoid blurry or distorted images

2. **Preprocessing Selection**
   - For handwritten text: Use "Black & White" mode
   - For printed text: Use "Sharpen" mode
   - For unclear results: Try different preprocessing options

3. **Language Selection**
   - Use "English (Best)" for highest accuracy
   - Use "Auto Detect" for unknown text orientation
   - Standard "English" for faster processing

## Performance Considerations

- Image size: Larger images take longer to process
- Language mode: "English (Best)" is more accurate but slower
- Browser resources: Processing occurs client-side
- Maximum file size: 10MB recommended

## Error Handling

The application handles various error cases:
- Invalid file types
- Processing failures
- Network issues
- Browser compatibility

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tesseract.js](https://tesseract.projectnaptha.com/) for OCR functionality
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide React](https://lucide.dev/) for icons

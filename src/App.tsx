import React, { useState, useCallback } from 'react';
import { createWorker, createScheduler } from 'tesseract.js';
import { FileText, Upload, Loader2, AlertCircle, Settings2 } from 'lucide-react';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    language: 'eng',
    preprocessing: 'none',
  });

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, []);

  const preprocessImage = (imageData: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;

        // Apply preprocessing based on selected option
        switch (settings.preprocessing) {
          case 'bw':
            ctx.filter = 'grayscale(100%) contrast(200%)';
            break;
          case 'sharpen':
            ctx.filter = 'contrast(130%) brightness(110%)';
            break;
          default:
            ctx.filter = 'none';
        }

        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = imageData;
    });
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      setImage(imageData);
      const processedImage = await preprocessImage(imageData);
      processImage(processedImage);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageData: string) => {
    setLoading(true);
    setText('');
    try {
      // Create a scheduler for better performance
      const scheduler = createScheduler();
      const worker = await createWorker();
      await worker.loadLanguage(settings.language);
      await worker.reinitialize(settings.language);
      
      // Configure Tesseract for better accuracy
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?-_\'"\n ', // Limit recognized characters
        tessedit_pageseg_mode: '6', // Assume uniform text block
        tessjs_create_pdf: '0',
        tessjs_create_hocr: '0',
        tessjs_create_tsv: '0',
      });

      scheduler.addWorker(worker);
      const { data: { text } } = await scheduler.addJob('recognize', imageData);
      setText(text.trim());
      
      await scheduler.terminate();
    } catch (err) {
      setError('Error processing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-10 h-10 text-indigo-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-800">Handwriting to Text</h1>
          </div>
          <p className="text-gray-600">Convert handwritten text from images to digital text instantly</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {/* Settings Panel */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-3">
              <Settings2 className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="font-semibold">Recognition Settings</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings(s => ({ ...s, language: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="eng">English</option>
                  <option value="eng_best">English (Best)</option>
                  <option value="osd">Auto Detect</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Preprocessing
                </label>
                <select
                  value={settings.preprocessing}
                  onChange={(e) => setSettings(s => ({ ...s, preprocessing: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="none">None</option>
                  <option value="bw">Black & White</option>
                  <option value="sharpen">Sharpen</option>
                </select>
              </div>
            </div>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors"
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Drag and drop your image here, or</p>
            <label className="inline-block">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileInput}
              />
              <span className="bg-indigo-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors">
                Browse Files
              </span>
            </label>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {loading && (
            <div className="mt-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
              <p className="text-gray-600 mt-2">Processing your image...</p>
            </div>
          )}

          {image && !loading && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Original Image</h3>
                <img
                  src={image}
                  alt="Uploaded handwriting"
                  className="rounded-lg max-w-full h-auto"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Extracted Text</h3>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                  {text ? (
                    <p className="whitespace-pre-wrap">{text}</p>
                  ) : (
                    <p className="text-gray-500 italic">No text extracted yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center text-gray-600 text-sm">
          <p>Powered by Tesseract.js • Upload images up to 10MB</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
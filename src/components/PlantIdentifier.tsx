import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Loader2, Check, AlertTriangle } from 'lucide-react';
import { identifyPlant } from '../services/supabasePlantService';
import PlantResult from './PlantResult';
import { PlantInfo } from './PlantCard';

const PlantIdentifier: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlantInfo | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      setError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCameraClick = async () => {
    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera access is not supported by your browser');
        return;
      }

      setShowCamera(true);
      
      // Access the camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use the back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      
      // Display the camera feed
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions and try again.');
      setShowCamera(false);
    }
  };
  
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL('image/jpeg');
    setImage(dataUrl);
    
    // Stop the camera stream
    stopCameraStream();
  };
  
  const stopCameraStream = () => {
    // Stop all tracks in the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setShowCamera(false);
  };
  
  // Clean up the stream when component unmounts
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setResult(null);
    stopCameraStream();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleIdentify = async () => {
    if (!image) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // This would be a real API call in a production app
      const identifiedPlant = await identifyPlant(image);
      setResult(identifiedPlant);
    } catch (err) {
      setError('Failed to identify plant. Please try again with a clearer image.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {!result ? (
        <div className="bg-emerald-900/70 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl relative">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2">Identify Your Plant</h2>
            <p className="text-emerald-300">
              Take or upload a clear photo of a plant to get information about it
            </p>
          </div>
          
          {/* Camera UI */}
          {showCamera && (
            <div className="fixed inset-0 bg-emerald-950/90 z-50 flex flex-col items-center justify-center p-4">
              <div className="relative w-full max-w-xl mx-auto bg-emerald-900 rounded-xl overflow-hidden">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-auto"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                <div className="absolute bottom-0 left-0 right-0 py-8 flex justify-center items-center bg-gradient-to-t from-emerald-950 to-transparent">
                  <div className="flex items-center gap-8">
                    {/* Cancel button */}
                    <button 
                      onClick={stopCameraStream}
                      className="bg-red-500/90 hover:bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
                      aria-label="Cancel"
                    >
                      <X className="h-6 w-6" />
                    </button>

                    {/* Capture button */}
                    <button
                      onClick={capturePhoto}
                      className="bg-white hover:bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl relative"
                      aria-label="Take photo"
                    >
                      <div className="absolute inset-2 rounded-full border-4 border-emerald-500"></div>
                      <div className="w-14 h-14 rounded-full bg-emerald-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div 
            className={`
              mb-8 rounded-2xl border-2 border-dashed p-6 relative
              ${dragActive 
                ? 'border-emerald-400 bg-emerald-900/50' 
                : image 
                  ? 'border-emerald-600 bg-emerald-900/20' 
                  : 'border-emerald-800 bg-emerald-950/50'
              }
              transition-all duration-300
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            {image ? (
              <div className="relative">
                <img 
                  src={image} 
                  alt="Plant to identify" 
                  className="max-h-96 rounded-xl mx-auto"
                />
                <button 
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-emerald-950/80 text-emerald-400 p-2 rounded-full hover:bg-emerald-900 transition-colors duration-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-48">
                <Upload className="h-12 w-12 text-emerald-500 mb-4" />
                <p className="text-emerald-300 text-center mb-2">
                  Drag & drop your plant image here
                </p>
                <p className="text-emerald-400/70 text-sm text-center">
                  or use one of the options below
                </p>
              </div>
            )}
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-xl flex items-center gap-3 text-red-200">
              <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleCameraClick}
              className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 flex-1 py-3 rounded-xl font-medium transition-all duration-300"
            >
              <Camera className="h-5 w-5" />
              <span>Take Photo</span>
            </button>
            <button 
              onClick={handleUploadClick}
              className="flex items-center justify-center space-x-2 bg-transparent border border-emerald-500 hover:bg-emerald-800 text-emerald-400 flex-1 py-3 rounded-xl font-medium transition-all duration-300"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Image</span>
            </button>
          </div>
          
          {image && (
            <div className="mt-6">
              <button
                onClick={handleIdentify}
                disabled={isLoading}
                className={`
                  w-full py-4 rounded-xl font-medium text-center transition-all duration-300
                  ${isLoading 
                    ? 'bg-emerald-700 cursor-not-allowed' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-emerald-950'
                  }
                `}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Identifying Plant...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="h-5 w-5" />
                    Identify Plant
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <PlantResult 
          plant={result} 
          image={image} 
          onReset={handleRemoveImage} 
        />
      )}
    </div>
  );
};

export default PlantIdentifier;
import { useState, useRef } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';

const ImageCapture = ({ onImageCapture, onClose }) => {
  const [mode, setMode] = useState('upload');
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setMode('camera');
    } catch (err) {
      alert('Không thể truy cập camera: ' + err.message);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      canvas.toBlob((blob) => {
        const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
        setCapturedImage(URL.createObjectURL(blob));
        stopCamera();
        onImageCapture(file);
      }, 'image/jpeg');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapturedImage(URL.createObjectURL(file));
      onImageCapture(file);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-heading font-semibold">Chụp ảnh hoặc tải lên</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!stream && !capturedImage && (
            <div className="space-y-4">
              <button
                onClick={startCamera}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>Chụp ảnh từ camera</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-text/60">hoặc</span>
                </div>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border hover:border-primary text-text hover:bg-primary/5 font-medium py-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Upload className="w-5 h-5" />
                <span>Tải ảnh từ thư viện</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {stream && (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg bg-black"
              />
              <canvas ref={canvasRef} className="hidden" />

              <div className="flex space-x-4">
                <button
                  onClick={capturePhoto}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Check className="w-5 h-5" />
                  <span>Chụp ảnh</span>
                </button>
                <button
                  onClick={() => {
                    stopCamera();
                    setMode('upload');
                  }}
                  className="flex-1 border border-border hover:bg-gray-100 text-text font-medium py-3 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-4">
              <img src={capturedImage} alt="Captured" className="w-full rounded-lg" />
              <p className="text-center text-green-600 font-medium">Ảnh đã được chọn thành công!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCapture;

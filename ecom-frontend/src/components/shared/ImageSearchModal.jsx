// ImageSearchModal.jsx
import { useState, useRef } from 'react';
import { FiUpload, FiX, FiCamera, FiImage, FiLoader } from 'react-icons/fi';
import { FaSearch, FaTimes } from 'react-icons/fa';

const ImageSearchModal = ({ isOpen, onClose, onSearchResults }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageSelect(file);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageSelect(e.dataTransfer.files[0]);
        }
    };

    const handleProcessImage = async () => {
        if (!selectedImage) return;

        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append('image', selectedImage);

            const response = await fetch('http://localhost:8085/api/v1/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Image analysis result:', result);
            
            // Pass the results to parent component
            onSearchResults(result, selectedImage);
            
            // Close modal after successful processing
            handleClose();
            
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Error processing image. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setIsProcessing(false);
        setDragActive(false);
        onClose();
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FiCamera className="text-2xl" />
                            <h2 className="text-xl font-bold">Search by Image</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white hover:text-gray-200 transition-colors duration-200 p-1"
                            disabled={isProcessing}
                        >
                            <FiX size={24} />
                        </button>
                    </div>
                    <p className="text-purple-100 text-sm mt-2">
                        Upload an image to find similar products
                    </p>
                </div>

                <div className="p-6">
                    {!imagePreview ? (
                        /* Upload Area */
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                                dragActive 
                                    ? 'border-purple-500 bg-purple-50' 
                                    : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                                        <FiImage className="text-2xl text-purple-600" />
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        Drop your image here
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        or click to browse from your device
                                    </p>
                                </div>

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                >
                                    <FiUpload size={20} />
                                    <span>Choose Image</span>
                                </button>

                                <p className="text-xs text-gray-500 mt-2">
                                    Supports: JPG, PNG, GIF (Max 10MB)
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Image Preview */
                        <div className="space-y-4">
                            <div className="relative">
                                <img 
                                    src={imagePreview} 
                                    alt="Selected" 
                                    className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                                />
                                <button
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                                    disabled={isProcessing}
                                >
                                    <FaTimes size={12} />
                                </button>
                            </div>
                            
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-4">
                                    Image ready for analysis
                                </p>
                                
                                <button
                                    onClick={handleProcessImage}
                                    disabled={isProcessing}
                                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isProcessing ? (
                                        <>
                                            <FiLoader className="animate-spin" size={20} />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaSearch size={18} />
                                            <span>Process Image</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t">
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                            Your image will be analyzed securely
                        </p>
                        <button
                            onClick={handleClose}
                            className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors duration-200"
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageSearchModal;
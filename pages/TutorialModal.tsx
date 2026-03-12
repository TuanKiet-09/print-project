import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

// Cập nhật 9 bước hướng dẫn chi tiết
const tutorialSteps = [
  {
    title: "Bước 1: Chọn loại áo",
    description: "Bắt đầu bằng cách lựa chọn kiểu dáng áo mà bạn muốn thiết kế (áo thun, polo, hoodie...).",
    imageUrl: "https://i.postimg.cc/HnRG3dZ4/1.png" // Thay link ảnh thật
  },
  {
    title: "Bước 2: Chọn màu sắc",
    description: "Lựa chọn màu nền áo ưng ý nhất để làm nổi bật các họa tiết thiết kế của bạn.",
    imageUrl: "https://i.postimg.cc/2yMpTrcw/2.png"
  },
  {
    title: "Bước 3: Khu vực thiết kế",
    description: "Đây là 'khung tranh' của riêng bạn. Hãy sắp xếp và định vị các hình ảnh, chữ viết nằm gọn trong vùng giới hạn này nhé.",
    imageUrl: "https://i.postimg.cc/mkJxVBXS/3.png"
  },
  {
    title: "Bước 4: Công cụ sáng tạo",
    description: "Sử dụng thanh công cụ để chèn thêm chữ, tải ảnh cá nhân lên, vẽ tay tự do hoặc quản lý các lớp (layer) một cách dễ dàng.",
    imageUrl: "https://i.postimg.cc/VsVczWYH/4.png"
  },
  {
    title: "Bước 5: Bảng kích thước",
    description: "Nhấn vào 'Size Chart' để tham khảo số đo chi tiết, đảm bảo chiếc áo thành phẩm sẽ vừa vặn hoàn hảo với bạn.",
    imageUrl: "https://i.postimg.cc/8k0VTm1q/5.png"
  },
  {
    title: "Bước 6: Chuyển đổi mặt áo",
    description: "Bạn có thể thiết kế trên cả 2 mặt áo. Nhấn nút chuyển đổi để luân phiên góc nhìn giữa mặt trước và mặt sau.",
    imageUrl: "https://i.postimg.cc/VsVczWfy/6.png"
  },
  {
    title: "Bước 7: Lưu thiết kế",
    description: "Khi đã hoàn toàn ưng ý, hãy nhấn 'Save Preview' để tải hình ảnh bản thiết kế về máy của bạn.",
    imageUrl: "https://i.postimg.cc/WpHPsw2B/7.png"
  },
  {
    title: "Bước 8: Liên hệ hỗ trợ",
    description: "Nếu bạn cần tư vấn thêm, báo giá hoặc đặt hàng, hãy nhấn nút 'Liên Hệ trên Facebook' để trò chuyện trực tiếp với chúng tôi.",
    imageUrl: "https://i.postimg.cc/QNyrjJ8G/8.png"
  },
  {
    title: "Bước 9: Xem lại hướng dẫn",
    description: "Đừng lo nếu bạn lỡ quên thao tác, chỉ cần bấm vào nút 'Hướng dẫn' để mở lại bảng thông báo này bất cứ lúc nào.",
    imageUrl: "https://i.postimg.cc/xj4S93f9/9.png"
  }
];

const TutorialModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Reset lại từ bước 1 mỗi khi modal được mở lên
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Nút Đóng */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Nội dung chính */}
        <div className="p-6">
          <div className="mb-6">
            <img 
              src={tutorialSteps[currentStep].imageUrl} 
              alt={tutorialSteps[currentStep].title}
              className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {tutorialSteps[currentStep].title}
          </h2>
          <p className="text-gray-600 mb-8 min-h-[4rem]">
            {tutorialSteps[currentStep].description}
          </p>

          {/* Dấu chấm chỉ báo (Dots indicator) */}
          <div className="flex justify-center gap-1.5 mb-6 flex-wrap">
            {tutorialSteps.map((_, index) => (
              <div 
                key={index} 
                className={`h-2 rounded-full transition-all ${
                  index === currentStep ? "w-6 bg-blue-600" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Cụm nút điều hướng */}
          <div className="flex items-center justify-between mt-auto">
            <button
              onClick={onClose}
              className="text-sm font-medium text-gray-500 hover:text-gray-800 px-3 py-2 transition-colors"
            >
              Bỏ qua
            </button>

            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentStep === 0 
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed" 
                    : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <ChevronLeft size={16} /> Quay lại
              </button>

              {currentStep === tutorialSteps.length - 1 ? (
                <button
                  onClick={onClose}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors"
                >
                  <Check size={16} /> Xong
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  Tiếp theo <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
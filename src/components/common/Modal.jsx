import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// One modal shell for the app. With a title it is the small form dialog (address);
// without one it is the wider login dialog with only a close button.
function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
            <div className={`bg-white rounded w-full max-h-[90vh] overflow-y-auto ${title ? "p-5 max-w-[350px]" : "p-5 lg:p-8 max-w-xs sm:max-w-sm md:max-w-md"}`} onClick={(e) => e.stopPropagation()}>
                {title ? (
                    <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-4">
                        <p className="text-[15px] text-orange-600">{title}</p>
                        <button onClick={onClose} className="text-gray-500 cursor-pointer">
                            <X size={18} className="border-2 border-orange-500 text-orange-500 font-bold bg-white rounded-lg" />
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-end items-center mb-4">
                        <button onClick={onClose} className="cursor-pointer">
                            <X size={20} strokeWidth={2.25} className="font-bold" />
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>,
        document.body
    );
}

export default Modal;

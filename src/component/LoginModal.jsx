import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

function LoginModal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
            <div className="bg-white p-5 lg:p-8 rounded w-full max-w-xs sm:max-w-sm md:max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end items-center mb-4">
                    <button onClick={onClose} className="cursor-pointer">
                        <X size={20} strokeWidth={2.25} className="font-bold" />
                    </button>
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
}

export default LoginModal;

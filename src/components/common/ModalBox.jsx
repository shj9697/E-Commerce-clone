import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

function ModalBox({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
            <div className="bg-white p-5 rounded w-full max-w-[350px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-4">
                    <p className="text-[15px] text-orange-600">{title}</p>
                    <button onClick={onClose} className="text-gray-500 cursor-pointer">
                        <X size={18} className='border-2 border-orange-500 text-orange-500 font-bold bg-white rounded-lg' />
                    </button>
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
}

export default ModalBox;

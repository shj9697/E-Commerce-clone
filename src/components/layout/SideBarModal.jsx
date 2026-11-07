import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

function SideBarModal({ isOpen, onClose, children }) {
    return createPortal(
        <div
            className={`fixed inset-0 z-50 lg:hidden transition-[background-color,visibility] duration-300 ${isOpen ? "visible bg-black/60" : "invisible bg-black/0"}`}
            onClick={onClose}
        >
            <div
                className={`h-full w-[80%] sm:w-[39%] md:w-[40%] min-w-60 bg-white pt-2 pb-5 overflow-y-auto shadow-lg transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-end items-center pr-2">
                    <button onClick={onClose} className="cursor-pointer">
                        <X size={20} strokeWidth={4} className="font-bold" />
                    </button>
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
}

export default SideBarModal;

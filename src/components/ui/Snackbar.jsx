import React, { useEffect } from 'react';
import './Snackbar.css';

const Snackbar = ({ message, isOpen, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    return (
        <div className={`snackbar ${isOpen ? 'show' : ''}`}>
            {message}
        </div>
    );
};

export default Snackbar;

import React, {
    createContext,
    useContext
} from "react";

import {
    showSuccess,
    showError,
    showWarning,
    showInfo
} from "../components/Toast";


// =====================================================
// CONTEXT
// =====================================================

const ToastContext = createContext(null);


// =====================================================
// PROVIDER
// =====================================================

export function ToastProvider({ children }) {

    // -------------------------------------------------
    // COMMON TOAST FUNCTION
    // -------------------------------------------------

    const showToast = (
        message,
        type = "info"
    ) => {

        switch (type) {

            case "success":
                showSuccess(message);
                break;

            case "error":
                showError(message);
                break;

            case "warning":
                showWarning(message);
                break;

            case "info":
            default:
                showInfo(message);
                break;

        }

    };


    return (

        <ToastContext.Provider
            value={{
                showToast,
                showSuccess,
                showError,
                showWarning,
                showInfo
            }}
        >

            {children}

        </ToastContext.Provider>

    );

}


// =====================================================
// HOOK
// =====================================================

export function useToast() {

    const context =
        useContext(ToastContext);


    if (!context) {

        throw new Error(
            "useToast must be used inside ToastProvider"
        );

    }


    return context;

}


export default ToastContext;
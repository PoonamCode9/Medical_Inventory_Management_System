import React from "react";
import toast, { Toaster } from "react-hot-toast";

import {
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
    FaInfoCircle
} from "react-icons/fa";


// =====================================================
// SUCCESS
// =====================================================

export const showSuccess = (message) => {

    toast.custom(
        (t) => (
            <div
                className={`custom-toast success-toast ${
                    t.visible ? "toast-show" : "toast-hide"
                }`}
            >

                <div className="toast-icon">
                    <FaCheckCircle />
                </div>

                <div className="toast-content">

                    <strong>Success</strong>

                    <span>{message}</span>

                </div>

                <button
                    type="button"
                    className="toast-close"
                    onClick={() => toast.dismiss(t.id)}
                >
                    ×
                </button>

            </div>
        ),
        {
            duration: 3000,
            position: "top-right"
        }
    );
};


// =====================================================
// ERROR
// =====================================================

export const showError = (message) => {

    toast.custom(
        (t) => (
            <div
                className={`custom-toast error-toast ${
                    t.visible ? "toast-show" : "toast-hide"
                }`}
            >

                <div className="toast-icon">
                    <FaTimesCircle />
                </div>

                <div className="toast-content">

                    <strong>Error</strong>

                    <span>{message}</span>

                </div>

                <button
                    type="button"
                    className="toast-close"
                    onClick={() => toast.dismiss(t.id)}
                >
                    ×
                </button>

            </div>
        ),
        {
            duration: 4000,
            position: "top-right"
        }
    );
};


// =====================================================
// WARNING
// =====================================================

export const showWarning = (message) => {

    toast.custom(
        (t) => (
            <div
                className={`custom-toast warning-toast ${
                    t.visible ? "toast-show" : "toast-hide"
                }`}
            >

                <div className="toast-icon">
                    <FaExclamationTriangle />
                </div>

                <div className="toast-content">

                    <strong>Warning</strong>

                    <span>{message}</span>

                </div>

                <button
                    type="button"
                    className="toast-close"
                    onClick={() => toast.dismiss(t.id)}
                >
                    ×
                </button>

            </div>
        ),
        {
            duration: 3500,
            position: "top-right"
        }
    );
};


// =====================================================
// INFO
// =====================================================

export const showInfo = (message) => {

    toast.custom(
        (t) => (
            <div
                className={`custom-toast info-toast ${
                    t.visible ? "toast-show" : "toast-hide"
                }`}
            >

                <div className="toast-icon">
                    <FaInfoCircle />
                </div>

                <div className="toast-content">

                    <strong>Information</strong>

                    <span>{message}</span>

                </div>

                <button
                    type="button"
                    className="toast-close"
                    onClick={() => toast.dismiss(t.id)}
                >
                    ×
                </button>

            </div>
        ),
        {
            duration: 3000,
            position: "top-right"
        }
    );
};


// =====================================================
// TOASTER
// =====================================================

export default function Toast() {

    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={12}
            containerStyle={{
                top: 25,
                right: 25
            }}
        />
    );
}
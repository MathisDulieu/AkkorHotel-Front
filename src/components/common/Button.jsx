import React from "react";

const Button = ({
    children,
    type = "button",
    onClick,
    variant = "primary",
    size = "md",
    fullWidth = false,
    className = "",
    disabled = false,
    ...props
}) => {
    const baseStyles = "font-medium rounded-lg transition-colors duration-200";

    const variants = {
        primary:
            "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300",
        secondary:
            "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-4 focus:ring-gray-200",
        outlined:
            "bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-4 focus:ring-indigo-100",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300",
    };

    const sizes = {
        sm: "py-1.5 px-3 text-sm",
        md: "py-2 px-4 text-base",
        lg: "py-3 px-6 text-lg",
    };

    const widthClass = fullWidth ? "w-full" : "";
    const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

import React from "react";
import LoadingLogin from "../loading/loading-login";

export default function ButtonComponent({
  className = "",
  startIcon,
  endIcon,
  fontWeight = "semibold",
  fontSize = "sm",
  textAlign = "center",
  onClick,
  id,
  isActive,
  disabled,
  title,
  subtitle,
  loading = false,
}) {
  const baseClasses = `
    p-2
    flex
    items-center
    font-semibold
    text-xs
    rounded-md
    transition-colors
    duration-300
    focus:outline-none
    border
    border-solid
  `;

  const stateClasses =
    disabled || loading
      ? "bg-[#d9d9d9] border-[#d9d9d9] text-[#808080] cursor-not-allowed"
      : isActive
      ? "bg-primary border-black text-white"
      : "bg-white text-primary border-black hover:bg-primary hover:text-black hover:text-white";

  const tailwindClasses = `${baseClasses} ${stateClasses} ${className}`;

  return (
    <button
      id={id}
      className={tailwindClasses}
      onClick={onClick}
      disabled={disabled || loading}
      title={subtitle}
    >
      {loading ? (
        <LoadingLogin />
      ) : (
        <>
          {startIcon && <span className="mr-2">{startIcon}</span>}
          {title}
          {endIcon && <span className="ml-2">{endIcon}</span>}
        </>
      )}
    </button>
  );
}

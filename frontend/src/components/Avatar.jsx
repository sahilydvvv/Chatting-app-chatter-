import React, { useState } from "react";

const Avatar = ({ name, image, size = "md" }) => {
  const [imgError, setImgError] = useState(false);

  const getInitials = (n) => {
    if (!n) return "?";
    const parts = n.split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  
  const colorIndex = name ? name.length % colors.length : 0;
  const bgColor = colors[colorIndex];

  if (image && !imgError) {
    return (
      <img
        src={image}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover shrink-0 border border-gray-100`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full ${bgColor} text-white flex items-center justify-center font-bold select-none shrink-0`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;

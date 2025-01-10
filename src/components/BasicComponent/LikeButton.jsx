//import React from 'react';

const LikeButton = ({ fill = "#ffffff", width = 24, height = 24, onClick }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <path
        d="M9 21H5c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h4v12zm11.65-9.54c-.3-.47-.78-.78-1.33-.84L15 10.18V4c0-1.1-.9-2-2-2h-1.38c-.47 0-.93.16-1.29.44l-.92.73c-.37.29-.61.7-.67 1.15-.34 2.46-1.01 4.65-1.89 6.33V19c0 1.1.9 2 2 2h7.06c.61 0 1.16-.31 1.49-.84l3.09-5.14c.3-.49.32-1.09.06-1.6z"
        fill={fill}
      />
    </svg>
  );
};

export default LikeButton;

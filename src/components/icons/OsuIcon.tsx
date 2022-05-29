import * as React from "react";

export default ({
  color,
  width,
  height,
}: {
  color: string;
  width?: string;
  height?: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || "0.8em"}
      height={height || "0.8em"}
      viewBox="0 0 32 32"
    >
      <path
        fill={color}
        d="M16 3.52c6.88 0 12.48 5.6 12.48 12.48S22.88 28.48 16 28.48c-6.88 0-12.48-5.6-12.48-12.48S9.12 3.52 16 3.52m0-2.56c-2.016 0-4 .384-5.856 1.184a15.151 15.151 0 00-4.768 3.232c-1.408 1.376-2.464 2.976-3.232 4.768C1.344 12 .96 13.984.96 16s.384 4 1.184 5.856a15.151 15.151 0 003.232 4.768c1.376 1.408 2.976 2.464 4.768 3.232 1.856.8 3.84 1.184 5.856 1.184s4-.384 5.856-1.184a15.151 15.151 0 004.768-3.232c1.408-1.376 2.464-2.976 3.232-4.768.8-1.856 1.184-3.84 1.184-5.856s-.384-4-1.184-5.856a15.151 15.151 0 00-3.232-4.768c-1.376-1.408-2.976-2.464-4.768-3.232A14.737 14.737 0 0016 .96zm0 7.424c-4.192 0-7.616 3.424-7.616 7.616s3.424 7.616 7.616 7.616 7.616-3.424 7.616-7.616S20.192 8.384 16 8.384z"
      />
    </svg>
  );
};

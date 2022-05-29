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
        d="M16 6.4c-5.312 0-9.6 4.288-9.6 9.6s4.288 9.6 9.6 9.6 9.6-4.288 9.6-9.6-4.288-9.6-9.6-9.6zM9.6 16c0-2.976 2.048-5.472 4.8-6.208v12.416c-2.752-.736-4.8-3.232-4.8-6.208zm8 6.208V9.792c2.752.736 4.8 3.232 4.8 6.208s-2.048 5.472-4.8 6.208zM16 3.52c6.88 0 12.48 5.6 12.48 12.48S22.88 28.48 16 28.48c-6.88 0-12.48-5.6-12.48-12.48S9.12 3.52 16 3.52m0-2.56c-2.016 0-4 .384-5.856 1.184a15.151 15.151 0 00-4.768 3.232c-1.408 1.376-2.464 2.976-3.232 4.768C1.344 12 .96 13.984.96 16s.384 4 1.184 5.856a15.151 15.151 0 003.232 4.768c1.376 1.408 2.976 2.464 4.768 3.232 1.856.8 3.84 1.184 5.856 1.184s4-.384 5.856-1.184a15.151 15.151 0 004.768-3.232c1.408-1.376 2.464-2.976 3.232-4.768.8-1.856 1.184-3.84 1.184-5.856s-.384-4-1.184-5.856a15.151 15.151 0 00-3.232-4.768c-1.376-1.408-2.976-2.464-4.768-3.232A14.737 14.737 0 0016 .96z"
      />
    </svg>
  );
};

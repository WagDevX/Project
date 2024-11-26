import { IconProps } from "./car";

export const ArrowsLRIcon = ({ props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={props?.color ?? "none"}
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      height={props?.height ?? 20}
      width={props?.width ?? 20}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
      />
    </svg>
  );
};
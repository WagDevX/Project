import { useState } from "react";
import StarSolid from "../icons/start_solid";
import StarOutline from "../icons/start_outline";

interface StarsRatingProps {
  size?: "md" | "sm";
  defaultHowMany?: number;
  disabled?: boolean;
  onChange?: (n: number) => void;
}

export default function StarsRating({
  size = "md",
  defaultHowMany = 0,
  disabled,
  onChange = () => {},
}: StarsRatingProps) {
  const [howMany, setHowMany] = useState(defaultHowMany);
  const five = [1, 2, 3, 4, 5];

  function handleStarClick(n: number) {
    if (disabled) return;
    setHowMany(n);
    onChange(n);
  }

  return (
    <div className="flex items-center">
      {five.map((n) => (
        <button
          key={n}
          disabled={disabled}
          className={`${size === "md" ? "h-6 w-6" : "h-6 w-6"} ${
            !disabled ? "cursor-pointer" : ""
          } p-0 border-0 bg-transparent text-orange-500`}
          onClick={() => handleStarClick(n)}
        >
          {howMany >= n ? <StarSolid /> : <StarOutline />}
        </button>
      ))}
    </div>
  );
}

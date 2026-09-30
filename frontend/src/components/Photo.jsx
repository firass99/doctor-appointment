import { useState } from "react";
import { Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

// Shows the image from /public/images, or a soft placeholder if the file is missing
export default function Photo({ src, alt, className }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("flex items-center justify-center bg-linear-to-br from-teal-100 to-teal-300 text-teal-700", className)}
      >
        <Stethoscope className="size-12 opacity-60" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}

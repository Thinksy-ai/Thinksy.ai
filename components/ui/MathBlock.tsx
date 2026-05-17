// components/ui/MathBlock.tsx

"use client";

import "katex/dist/katex.min.css";
import katex from "katex";

type Props = {
  math: string;
};

export default function MathBlock({
  math,
}: Props) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(
          math,
          {
            throwOnError: false,
            displayMode: true,
          }
        ),
      }}
    />
  );
}

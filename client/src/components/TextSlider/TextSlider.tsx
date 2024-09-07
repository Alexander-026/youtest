import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";

const TextSlider = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const [siteIndex, setSiteIndex] = useState<number>(0);
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [current, setCurrent] = useState<string>("");

  const sites = useMemo(() => ["YouTube", "Instagram", "Facebook", "Telegram", "Twitter"], []);

  const handleTextChange = useCallback(() => {
    if (current.length < sites[siteIndex].length) {
      setCurrent((prev) => {
        const text = `${prev}${sites[siteIndex][wordIndex]}`;
        textRef.current!.textContent = text;
        return text;
      });
      setWordIndex((prev) => (prev + 1) % sites[siteIndex].length);
    } else {
      setCurrent("");
      setSiteIndex((prev) => (prev + 1) % sites.length);
    }
  }, [current, sites, siteIndex, wordIndex]);

  useEffect(() => {
    const myTimer = setInterval(handleTextChange, 200);
    return () => clearInterval(myTimer);
  }, [handleTextChange]);

  return (
    <div  ref={textRef}>vasbas</div>
  );
};

export default TextSlider;

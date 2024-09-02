import { useEffect } from "react";

type ScrollIntoProps = {
  itemRefs: React.MutableRefObject<(HTMLLIElement | null)[]>;
  cursorFocus: number;
};

export const scrollInto = ({ itemRefs, cursorFocus }: ScrollIntoProps) => {
  useEffect(() => {
    if (!itemRefs.current || itemRefs.current.length === 0) return;
    let cursor = cursorFocus >= 0 ? cursorFocus : 0;
    if (itemRefs.current[cursor]) {
      itemRefs.current[cursor].scrollIntoView({
        behavior: "instant",
        block: "nearest",
      });
    }
  }, [cursorFocus, itemRefs]);
};

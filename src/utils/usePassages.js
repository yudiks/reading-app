import { useMemo, useState } from "react";
import passages from "../data/passages.js";

const getLengthCategory = wordCount => {
  if (wordCount <= 220) return "short";
  if (wordCount <= 260) return "medium";
  return "long";
};

export function usePassages() {
  const [filters, setFilters] = useState({ category: "all", length: "all" });

  const filteredPassages = useMemo(() => {
    return passages.filter(passage => {
      const matchesCategory = filters.category === "all" || passage.category === filters.category;
      const lengthCategory = getLengthCategory(passage.wordCount);
      const matchesLength = filters.length === "all" || filters.length === lengthCategory;
      return matchesCategory && matchesLength;
    }).sort((a, b) => a.title.localeCompare(b.title));
  }, [filters]);

  return {
    passages,
    filters,
    setFilters,
    filteredPassages
  };
}

export function usePassageById(id) {
  return useMemo(() => passages.find(passage => passage.id === id), [id]);
}

import PassageFilters from "../components/PassageFilters.jsx";
import PassageGrid from "../components/PassageGrid.jsx";
import { usePassages } from "../utils/usePassages.js";

export default function PassageListPage() {
  const { passages, filters, setFilters, filteredPassages } = usePassages();

  return (
    <div className="page">
      <header className="hero hero--board">
        <div>
          <p className="eyebrow">Reading Adventures</p>
          <h2>Choose Your Adventure</h2>
          <p className="subtitle">Select a passage to begin your comprehension quest.</p>
        </div>
        <PassageFilters
          filters={filters}
          passages={passages}
          onChange={setFilters}
        />
      </header>
      <PassageGrid passages={filteredPassages} />
    </div>
  );
}

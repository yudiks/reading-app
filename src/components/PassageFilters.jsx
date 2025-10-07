export default function PassageFilters({ filters, passages, onChange }) {
  const categories = Array.from(
    new Map(passages.map(passage => [passage.category, passage.categoryLabel]))
  );

  const handleCategory = event => {
    onChange({ ...filters, category: event.target.value });
  };

  const handleLength = event => {
    onChange({ ...filters, length: event.target.value });
  };

  return (
    <div className="toolbar" aria-label="Filters">
      <label>
        <span>Category</span>
        <select value={filters.category} onChange={handleCategory}>
          <option value="all">All themes</option>
          {categories.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Length</span>
        <select value={filters.length} onChange={handleLength}>
          <option value="all">Any</option>
          <option value="short">Short (≤ 220 words)</option>
          <option value="medium">Medium (221–260 words)</option>
          <option value="long">Longer (261+ words)</option>
        </select>
      </label>
    </div>
  );
}

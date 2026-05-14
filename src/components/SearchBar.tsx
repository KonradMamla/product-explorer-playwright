interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="search-bar" htmlFor="search-input">
      <span>Search products</span>
      <input
        id="search-input"
        data-testid="search-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Try: phone, perfume, chair"
      />
    </label>
  );
}

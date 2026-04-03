function SearchBar({ onSearch }) {
  return (
    <input
      type="text"
      placeholder="Cari catatan..."
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
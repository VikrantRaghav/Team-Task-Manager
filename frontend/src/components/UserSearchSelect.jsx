import { useMemo } from "react";

const UserSearchSelect = ({
  users,
  selectedId,
  onSelect,
  searchValue,
  onSearchChange,
  placeholder = "Search users by name or email"
}) => {
  const filtered = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, searchValue]);

  return (
    <div className="space-y-2">
      <input
        className="w-full border rounded p-2"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
      />
      <select
        className="w-full border rounded p-2"
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Select member</option>
        {filtered.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSearchSelect;

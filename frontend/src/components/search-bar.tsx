import type { SearchResult } from "../static/interfaces"
import { useEffect, useState } from "react"
import "../css/search-bar.css"

interface SearchBarProps {
  onUsersSelected: (userIds: number[]) => void
}

function SearchBar({ onUsersSelected }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search/users?query=${encodeURIComponent(searchQuery)}`,
          {
            credentials: "include",
          },
        )
        const data = await response.json()
        setSearchResults(data.users || [])
      } catch (error) {
        console.error("Error searching users:", error)
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300) // Wait 300ms after user stops typing

    return () => clearTimeout(timer)
  }, [searchQuery])

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) => {
      const newSelection = prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]

      onUsersSelected(newSelection)
      return newSelection
    })
  }

  const isSelected = (userId: number) => selectedUsers.includes(userId)

  return (
    <div className="search-bar-container">
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </form>

      {isLoading && <div className="search-loading">Searching...</div>}

      {searchQuery.length >= 2 && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((user) => (
            <div
              key={user.user_id}
              className={`search-result-item ${isSelected(user.user_id) ? "selected" : ""}`}
              onClick={() => toggleUserSelection(user.user_id)}
            >
              <div className="user-info">
                <span className="user-name">{user.user_name}</span>
              </div>
              <input
                type="checkbox"
                checked={isSelected(user.user_id)}
                onChange={() => toggleUserSelection(user.user_id)}
                className="user-checkbox"
              />
            </div>
          ))}
        </div>
      )}

      {searchQuery.length >= 2 && !isLoading && searchResults.length === 0 && (
        <div className="no-results">No users found</div>
      )}

      {selectedUsers.length > 0 && (
        <div className="selected-count">
          {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""}{" "}
          selected
        </div>
      )}
    </div>
  )
}
export default SearchBar

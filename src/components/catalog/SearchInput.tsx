import { useId, type ChangeEventHandler } from 'react'

export interface SearchInputProps {
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onClear?: () => void
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
}

export function SearchInput({
  value,
  onChange,
  onClear,
  label = 'Cari produk sewa',
  placeholder = 'Cari stroller, earmuff, walker…',
  hint,
  error,
  disabled = false,
}: SearchInputProps) {
  const inputId = useId()
  const messageId = `${inputId}-message`

  return (
    <div className={`search-control ${error ? 'search-control-error' : ''}`.trim()}>
      <label className="search-label" htmlFor={inputId}>
        {label}
      </label>
      <div className="search-input-shell">
        <span className="search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={hint || error ? messageId : undefined}
        />
        {value && onClear ? (
          <button
            className="search-clear"
            type="button"
            onClick={onClear}
            aria-label="Hapus pencarian"
          >
            ×
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={messageId} className="field-message field-message-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="field-message">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export default function MetricSlider({ label, description, value, onChange, min = 1, max = 10 }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <div>
          <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{label}</span>
          {description && (
            <span className="text-xs ml-2" style={{ color: 'var(--color-ink-faint)' }}>{description}</span>
          )}
        </div>
        <span className="font-display text-xl tabular-nums" style={{ color: 'var(--color-ink)' }}>
          {value}<span className="text-sm font-sans" style={{ color: 'var(--color-ink-faint)' }}>/{max}</span>
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{
          background: `linear-gradient(to right, var(--color-ink) ${((value - min) / (max - min)) * 100}%, var(--color-border) ${((value - min) / (max - min)) * 100}%)`,
        }}
      />

      <div className="flex justify-between mt-1">
        <span className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>Poor</span>
        <span className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>Excellent</span>
      </div>
    </div>
  )
}

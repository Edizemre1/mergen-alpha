export function MarketSparkline({
  points,
  positive = true,
  label,
  compact = false,
  bars = false,
}: {
  readonly points: readonly number[];
  readonly positive?: boolean;
  readonly label: string;
  readonly compact?: boolean;
  readonly bars?: boolean;
}) {
  const minimum = Math.min(...points);
  const maximum = Math.max(...points);
  const range = Math.max(maximum - minimum, 1);
  const coordinates = points.map((point, index) => ({
    x: (index / Math.max(points.length - 1, 1)) * 100,
    y: 38 - ((point - minimum) / range) * 32,
  }));
  const linePoints = coordinates
    .map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

  return (
    <svg
      className={`social-sparkline${compact ? " social-sparkline-compact" : ""}`}
      viewBox="0 0 100 42"
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
    >
      <line className="social-sparkline-guide" x1="0" x2="100" y1="37.5" y2="37.5" />
      {bars ? (
        coordinates.map(({ x, y }, index) => (
          <rect
            className={positive ? "social-chart-positive" : "social-chart-negative"}
            key={`${x}-${y}`}
            x={Math.max(x - 2.7, 0)}
            y={y}
            width={Math.min(5.4, 100 / points.length - 1)}
            height={38 - y}
            rx="0.8"
            opacity={0.42 + (index / points.length) * 0.5}
          />
        ))
      ) : (
        <polyline
          className={positive ? "social-line-positive" : "social-line-negative"}
          points={linePoints}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}

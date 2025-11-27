interface SvgIconProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function SvgIcon({ src, alt = "", className = "", width = 20, height = 20 }: SvgIconProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ width: `${width}px`, height: `${height}px`, display: 'inline-block' }}
    />
  );
}


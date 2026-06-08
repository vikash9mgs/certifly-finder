/**
 * Logo – the CertVerify certificate icon.
 * Use `size` to control width/height (default 34px for navbar).
 * Use `rounded` to control border-radius (default "9px" for navbar, "14px" for auth card).
 */
export default function Logo({ size = 34, rounded = "9px", style = {} }) {
  return (
    <img
      src="/logo.png"
      alt="CertVerify logo"
      width={size}
      height={size}
      style={{
        borderRadius: rounded,
        display: "block",
        flexShrink: 0,
        objectFit: "cover",
        ...style,
      }}
    />
  );
}

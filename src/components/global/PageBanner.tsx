import "./../../styles/PageBanner.css";

export default ({
  src,
  css,
  children,
}: {
  src: string;
  css?: React.CSSProperties;
  children: any;
}) => {
  return (
    <div
      id="pagebanner"
      className="background5"
      style={Object.assign(
        {
          backgroundImage: `url(${src})`,
        },
        css
      )}
    >
      {children}
    </div>
  );
};

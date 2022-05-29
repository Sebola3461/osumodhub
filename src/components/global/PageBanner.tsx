import "./../../styles/PageBanner.css";

export default ({ src, css }: { src: string; css?: React.CSSProperties }) => {
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
    ></div>
  );
};

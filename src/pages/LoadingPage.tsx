import AppBar from "../components/global/AppBar";
import LoadingComponent from "../components/global/LoadingComponent";

export default ({ text }: { text?: string }) => {
  return (
    <>
      <AppBar />
      <div className="loading-page-content">
        <LoadingComponent text={text} />
      </div>
    </>
  );
};

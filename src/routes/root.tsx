import { Link } from "react-router";

const Root: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col py-8">
        <Link to="/roll-forward">Roll Forward</Link>
        {/* <Link to="/checks">Checks</Link> */}
        <Link to="/graphs">Graphs</Link>
      </div>
    </div>
  );
};

export default Root;

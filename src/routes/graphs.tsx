import { useDataLong } from "../hooks/useDataLong";

const Graphs: React.FC = () => {
  const { dataLong } = useDataLong();

  return (
    <main className="container mx-auto min-h-screen">
      <div className="py-8 flex flex-col w-full overflow-x-auto overflow-y-auto">
        <div>Graphs</div>
      </div>
    </main>
  );
};

export default Graphs;

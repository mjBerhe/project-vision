import { useConfig } from "../hooks/useConfig";
import { useDataLong } from "../hooks/useDataLong";

const Checks: React.FC = () => {
  const { dataLong } = useDataLong();
  const { config } = useConfig();

  return (
    <main className="container mx-auto min-h-screen">
      <div className="py-8 flex flex-col w-full overflow-x-auto overflow-y-auto">
        <div>checks</div>
      </div>
    </main>
  );
};

export default Checks;

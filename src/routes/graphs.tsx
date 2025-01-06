import { Link } from "react-router";
import { MoveLeft } from "lucide-react";

import { useDataLong } from "../hooks/useDataLong";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogContainer,
} from "../components/ui/morphing-dialog";
import { cn } from "../utils/global";

import { NetSellReinvestChart } from "../components/graphs/net-sell-reinvest-chart";
import { CumulativeAssetLiabilityCFs } from "../components/graphs/cumulative-asset-liability-cfs";

const Graphs: React.FC = () => {
  const { dataLong } = useDataLong();

  const graphs = [
    {
      id: 0,
      graphSmall: <NetSellReinvestChart dataLong={dataLong} size="sm" />,
      graphLarge: <NetSellReinvestChart dataLong={dataLong} size="lg" />,
    },
    {
      id: 0,
      graphSmall: <CumulativeAssetLiabilityCFs dataLong={dataLong} size="sm" />,
      graphLarge: <CumulativeAssetLiabilityCFs dataLong={dataLong} size="lg" />,
    },
  ];

  return (
    <main className="container mx-auto min-h-screen">
      <div className="py-8 flex flex-col w-full overflow-auto">
        <div className="relative flex items-center gap-x-4 w-full justify-center">
          <Link to="/" className="absolute left-0 h-full items-center flex">
            <MoveLeft size={30} />
          </Link>
          <h1 className="text-2xl font-bold text-center">Graphs</h1>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          {[...graphs, ...Array(16 - graphs.length).fill(null)].map((graph, i) =>
            graph ? (
              <MorphingDialog
                transition={{
                  type: "spring",
                  bounce: 0.05,
                  duration: 0.25,
                }}
                key={graph.id}
              >
                <MorphingDialogTrigger
                  className={cn(
                    "flex w-[370px] h-[300px] flex-col overflow-hidden cursor-pointer border p-4 border-dark-700 rounded-lg bg-dark-900/70 hover:bg-dark-900 shadow-lg"
                  )}
                >
                  {graph.graphSmall}
                </MorphingDialogTrigger>
                <MorphingDialogContainer>
                  <MorphingDialogContent className="pointer-events-auto relative flex flex-col overflow-hidden w-[900px] bg-dark-900 py-6 px-8 rounded-lg shadow-lg">
                    {graph.graphLarge}
                  </MorphingDialogContent>
                </MorphingDialogContainer>
              </MorphingDialog>
            ) : (
              <div
                className="flex items-center justify-center w-[370px] h-[300px] border-dark-700 border rounded-lg bg-dark-900/70"
                key={graphs.length + i}
              >
                Coming Soon
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
};

export default Graphs;

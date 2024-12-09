import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

const OUTPUT_PATH =
  "C:/Users/mattberhe/pALM/pALM2.1_Sidecar_GDN_Assets/pALMLiability/pALMLauncher/data_GDNBMA_03312024_output/GDNSidecar_3.31_BaseCombined_Tax_wSwap/DebugInfo_Scenario_Sen_0001_0.csv";

const RollForward: React.FC = () => {
  useEffect(() => {
    const loadOutput = async () => {
      const data = await invoke("load_csv_file", { path: OUTPUT_PATH });
      console.log(data);
    };

    loadOutput();
  }, []);

  return (
    <main className="container mx-auto min-h-screen">
      <div className="py-8 flex flex-col">hello</div>
    </main>
  );
};

export default RollForward;

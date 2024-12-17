import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

const CONFIG_PATH =
  "C:/Users/mattberhe/pALM/pALM2.1_Sidecar_GDN_Assets/pALMLiability/pALMLauncher/bin/Debug/net5.0/liability_config.json";

export const useConfig = () => {
  const [config, setConfig] = useState();

  useEffect(() => {
    const loadConfig = async () => {
      const data = await invoke("read_config_json_file", {
        path: CONFIG_PATH,
      });

      console.log(data);
    };

    loadConfig();
  }, []);

  return { config };
};

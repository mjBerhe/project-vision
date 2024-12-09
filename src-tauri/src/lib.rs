// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use csv::ReaderBuilder;
use std::collections::HashMap;

const OUTPUT_PATH: &str = "C:/Users/mattberhe/pALM/pALM2.1_Sidecar_GDN_Assets/pALMLiability/pALMLauncher/data_GDNBMA_03312024_output/GDNSidecar_3.31_BaseCombined_Tax_wSwap/DebugInfo_Scenario_Sen_0001_0.csv";

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![load_csv_file])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn load_csv_file(path: String) -> Result<HashMap<String, Vec<String>>, String> {
  let mut data = HashMap::new();
  let mut rdr = ReaderBuilder::new()
    .has_headers(true)
    .flexible(true) // Allows for varying number of fields
    .from_path(path)
    .map_err(|e| e.to_string())?;

  for result in rdr.records() {
    match result {
      Ok(record) => {
        // Assuming the first column is the key
        let key = record.get(0).unwrap_or("unknown").to_string();
        let values: Vec<String> = record.iter().skip(1).map(|s| s.to_string()).collect();
        data.insert(key, values);
      }
      Err(e) => {
        eprintln!("Error reading record: {}", e);
        continue; // Skip this record and continue
      }
    }
  }

  Ok(data)
}

use crate::modules::live_data_processor::material::Server;
use crate::util::database::{Execute, Select};
use crate::modules::live_data_processor::domain_value::Event;
use std::io::Write;

impl Server {
    pub fn perform_post_processing(&mut self, db_main: &mut (impl Execute + Select), now: u64) {
        self.save_committed_events_to_disk(now);
        // TODO: Set end_ts of instance
        // TODO: Extract Attempts?
        // TODO: Extract Ranking
        // TODO: Extract Loot
    }

    fn save_committed_events_to_disk(&mut self, now: u64) {
        let storage_path = std::env::var("INSTANCE_STORAGE_PATH").expect("storage path must be set!");
        let mut open_options = std::fs::File::with_options();
        open_options.append(true);
        open_options.create(true);

        for (instance_id, active_instance) in self.active_instances.iter() {
            if let Some(committable_events) = self.committed_events.get_mut(&instance_id) {
                let _result = std::fs::create_dir_all(format!("{}/{}/{}", storage_path, self.server_id, active_instance.instance_meta_id));

                // Find first event that is committable from the back
                if let Some(extraction_index) = committable_events.iter().rposition(|event| event.timestamp + 5000 < now) {
                    let mut drained_events = committable_events.drain(..(extraction_index+1)).into_iter().collect::<Vec<Event>>();
                    drained_events.sort_by(|left, right| {
                        let by_event_type = left.event.to_u8().cmp(&right.event.to_u8());
                        if let std::cmp::Ordering::Equal = by_event_type {
                            return left.timestamp.cmp(&right.timestamp);
                        }
                        by_event_type
                    });

                    let mut last_opened_event_type_index = 0;
                    let mut opened_file = open_options.open(format!("{}/{}/{}/{}", storage_path, self.server_id, active_instance.instance_meta_id, 0));
                    for event in drained_events {
                        println!("TEST {}", event.event.to_u8());
                        if event.event.to_u8() != last_opened_event_type_index {
                            last_opened_event_type_index = event.event.to_u8();
                            opened_file = opened_file.and_then(|file| {
                                drop(file);
                                open_options.open(format!("{}/{}/{}/{}", storage_path, self.server_id, active_instance.instance_meta_id, event.event.to_u8()))
                            })
                        }
                        if let Ok(file) = &mut opened_file {
                            if let Ok(json) = serde_json::to_string(&event) {
                                let _ = file.write(json.as_bytes());
                                let _ = file.write(&[44]);
                            }
                        }
                    }
                }
            }
        }
    }
}
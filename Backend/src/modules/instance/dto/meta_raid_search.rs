use crate::modules::armory::dto::SearchGuildDto;

#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct MetaRaidSearch {
    pub instance_meta_id: u32,
    pub map_id: u16,
    pub map_difficulty: u8,
    pub map_icon: String,
    pub guild: Option<SearchGuildDto>,
    pub server_id: u32,
    pub start_ts: u64,
    pub end_ts: Option<u64>,
}

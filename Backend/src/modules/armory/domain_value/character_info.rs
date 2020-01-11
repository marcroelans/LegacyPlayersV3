use crate::modules::armory::domain_value::Gear;

#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct CharacterInfo {
  pub id: u32,
  pub gear: Gear,
  pub hero_class_id: u8,
  pub level: u8,
  pub gender: bool,
  pub profession1: Option<u8>,
  pub profession2: Option<u8>,
  pub talent_specification: Option<String>,
  pub faction: bool,
  pub race_id: u8,
}

impl CharacterInfo {
  pub fn compare_by_value(&self, other: &CharacterInfo) -> bool {
    return self.gear.compare_by_value(&other.gear)
      && self.hero_class_id == other.hero_class_id
      && self.level == other.level
      && self.gender == other.gender
      && ((self.profession1 == other.profession1
            && self.profession2 == other.profession2)
          || (self.profession2 == other.profession1
                && self.profession1 == other.profession2)
          )
      && self.talent_specification == other.talent_specification
      && self.faction == other.faction
      && self.race_id == other.race_id;
  }
}
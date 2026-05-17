/** Scent pyramid + olfactory family for filtering */
const SCENT_PROFILES = {
  1: { family: "Fresh", top: ["Calabrian Bergamot", "Pepper"], heart: ["Lavender", "Pink Pepper", "Vetiver"], base: ["Ambroxan", "Cedar", "Labdanum"], longevity: "8–10 hrs", sillage: "Strong", mood: "Fresh & magnetic" },
  2: { family: "Fresh", top: ["Citrus", "Mint", "Pink Pepper"], heart: ["Ginger", "Nutmeg", "Jasmine"], base: ["Incense", "Cedar", "Sandalwood"], longevity: "7–9 hrs", sillage: "Moderate", mood: "Elegant & versatile" },
  3: { family: "Floral", top: ["Lavender", "Mandarin"], heart: ["Orange Blossom", "Jasmine"], base: ["Vanilla", "Amber", "Musk"], longevity: "8 hrs", sillage: "Moderate", mood: "Bold & feminine" },
  4: { family: "Floral", top: ["Rangoon Creeper"], heart: ["Tuberose", "Jasmine", "Honeysuckle"], base: ["Orris", "Sandalwood"], longevity: "6–8 hrs", sillage: "Soft", mood: "Floral garden" },
  5: { family: "Fresh", top: ["Lime", "Mandarin", "Bergamot"], heart: ["Jasmine", "Freesia", "Hyacinth"], base: ["Amber", "Cedar", "Patchouli"], longevity: "6–8 hrs", sillage: "Fresh", mood: "Aquatic & clean" },
  6: { family: "Floral", top: ["Pear", "Tangerine", "Bergamot"], heart: ["Orange Blossom", "Jasmine Sambac"], base: ["Vanilla", "White Musk", "Bourbon"], longevity: "7–9 hrs", sillage: "Moderate", mood: "Modern floral" },
  7: { family: "Fresh", top: ["Mint", "Green Apple", "Lemon"], heart: ["Tonka Bean", "Ambroxan", "Geranium"], base: ["Vanilla", "Cedar", "Vetiver"], longevity: "7–9 hrs", sillage: "Strong", mood: "Sweet & seductive" },
  8: { family: "Gourmand", top: ["Blackcurrant", "Pear"], heart: ["Iris", "Jasmine", "Orange Blossom"], base: ["Praline", "Vanilla", "Patchouli"], longevity: "8–10 hrs", sillage: "Moderate", mood: "Gourmand floral" },
  9: { family: "Oriental", top: ["Truffle", "Gardenia", "Black Currant"], heart: ["Orchid", "Spices", "Fruity Notes"], base: ["Patchouli", "Incense", "Vanilla"], longevity: "10+ hrs", sillage: "Heavy", mood: "Dark luxury" },
  10: { family: "Woody", top: ["Lavender", "Pear"], heart: ["Iris", "Leather"], base: ["Patchouli", "Black Vanilla"], longevity: "7–9 hrs", sillage: "Moderate", mood: "Refined gentleman" },
  11: { family: "Woody", top: ["Pineapple", "Apple", "Bergamot"], heart: ["Birch", "Patchouli", "Jasmine"], base: ["Musk", "Oakmoss", "Ambergris"], longevity: "10+ hrs", sillage: "Beast mode", mood: "Fruity smoky" },
  12: { family: "Oriental", top: ["Saffron", "Jasmine"], heart: ["Amberwood", "Ambergris"], base: ["Fir Resin", "Cedar"], longevity: "10+ hrs", sillage: "Strong", mood: "Radiant amber" },
  13: { family: "Woody", top: ["Juniper", "Lemon", "Bergamot"], heart: ["Incense", "Pine Needles"], base: ["Vanilla", "Sandalwood"], longevity: "6–8 hrs", sillage: "Moderate", mood: "Bohemian woods" },
  14: { family: "Woody", top: ["Cardamom", "Iris", "Violet"], heart: ["Ambrox", "Cedarwood"], base: ["Leather", "Sandalwood", "Amber"], longevity: "8–10 hrs", sillage: "Moderate", mood: "Creamy sandalwood" },
  15: { family: "Floral", top: ["Water Lily", "Freesia"], heart: ["Magnolia", "Jasmine"], base: ["Musk", "Cedar", "Sandalwood"], longevity: "8–10 hrs", sillage: "Elegant", mood: "Luminous floral" },
  16: { family: "Oriental", top: ["Clove", "Raspberry", "Cinnamon"], heart: ["Rose", "Patchouli", "Incense"], base: ["Amber", "Benzoin", "Musk"], longevity: "10+ hrs", sillage: "Strong", mood: "Opulent rose" },
  17: { family: "Gourmand", top: ["Lavender", "Bergamot", "Lemon"], heart: ["Honey", "Cinnamon", "Cashmeran"], base: ["Tobacco", "Vanilla", "Tonka Bean"], longevity: "10+ hrs", sillage: "Strong", mood: "Honeyed tobacco" },
  18: { family: "Citrus", top: ["Grapefruit", "Lemon", "Lime"], heart: ["Vetiver", "Juniper", "Galbanum"], base: ["Ambergris", "Musk", "Cedar"], longevity: "8–10 hrs", sillage: "Moderate", mood: "Crisp citrus" },
  19: { family: "Floral", top: ["Lychee", "Rhubarb", "Bergamot"], heart: ["Rose", "Peony", "Vanilla"], base: ["Musk", "Cashmeran", "Vetiver"], longevity: "8–10 hrs", sillage: "Moderate", mood: "Rosy delight" },
  20: { family: "Woody", top: ["Rose", "Myrtle", "Cypress"], heart: ["Sandalwood", "Cedar"], base: ["Musk", "Amber"], longevity: "6–8 hrs", sillage: "Soft", mood: "Serene woods" },
  21: { family: "Gourmand", top: ["Cinnamon", "Nutmeg", "Dates"], heart: ["Praline", "Tuberose", "Mahonial"], base: ["Vanilla", "Tonka", "Amberwood"], longevity: "10+ hrs", sillage: "Strong", mood: "Spiced gourmand" },
  22: { family: "Fresh", top: ["Apple", "Bergamot", "Lemon"], heart: ["Cinnamon", "Orange Blossom", "Cardamom"], base: ["Amber", "Musk", "Driftwood"], longevity: "8–10 hrs", sillage: "Strong", mood: "Fresh aquatic" },
  23: { family: "Floral", top: ["Bergamot", "Orange"], heart: ["Rose", "Jasmine", "Ylang-Ylang"], base: ["Musk", "Amber", "Sandalwood"], longevity: "7–9 hrs", sillage: "Moderate", mood: "Classic elegance" },
  24: { family: "Oriental", top: ["Apple", "Cinnamon", "Wild Lavender"], heart: ["Orange Blossom", "Lily of the Valley"], base: ["Vanilla", "Tonka Bean", "Amber"], longevity: "8–10 hrs", sillage: "Strong", mood: "Night-out vibe" },
  25: { family: "Oriental", top: ["Saffron", "Rose"], heart: ["Oud", "Caramel", "Vanilla"], base: ["Musk", "Amber", "Sandalwood"], longevity: "10+ hrs", sillage: "Heavy", mood: "Oud richness" },
  26: { family: "Fresh", top: ["Lemon", "Pineapple", "Bergamot"], heart: ["Birch", "Jasmine", "Rose"], base: ["Musk", "Ambergris", "Patchouli"], longevity: "8–10 hrs", sillage: "Strong", mood: "Fruity bold" },
  27: { family: "Floral", top: ["Bergamot", "Mandarin"], heart: ["Jasmine", "Rose", "Orchid"], base: ["Musk", "Vanilla", "Amber"], longevity: "6–8 hrs", sillage: "Soft", mood: "Soft floral" },
  28: { family: "Oriental", top: ["Bergamot", "Green Notes"], heart: ["Melon", "Pineapple", "Amber"], base: ["Vanilla", "Musk", "Woody Notes"], longevity: "8–10 hrs", sillage: "Moderate", mood: "Golden amber oud" },
  29: { family: "Oriental", top: ["Saffron", "Ginger", "Cinnamon"], heart: ["Moroccan Rose", "Vanilla"], base: ["Sandalwood", "Musk", "Amber"], longevity: "10+ hrs", sillage: "Strong", mood: "Spicy rose crush" },
  30: { family: "Floral", top: ["Heliotrope", "Orchid", "Tangerine"], heart: ["Tropical Fruits", "Jasmine"], base: ["Vanilla", "Musk", "Sandalwood"], longevity: "7–9 hrs", sillage: "Moderate", mood: "Sweet & playful" }
};

const SCENT_FAMILIES = ["Fresh", "Citrus", "Woody", "Floral", "Oriental", "Gourmand"];

function getScentProfile(productId) {
  return SCENT_PROFILES[productId] || {
    family: "Fresh",
    top: ["Citrus", "Bergamot"],
    heart: ["Floral Accord", "Spices"],
    base: ["Musk", "Woody Notes"],
    longevity: "6–8 hrs",
    sillage: "Moderate",
    mood: "Balanced signature"
  };
}

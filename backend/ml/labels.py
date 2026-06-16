SNAKE_LABELS = [
  "Banded Racer",
  "Checkered Keelback",
  "Common Krait",
  "Common Rat Snake",
  "Common Sand Boa",
  "Common Trinket",
  "Green Tree Vine",
  "Indian Rock Python",
  "King Cobra",
  "Monocled Cobra",
  "Russell's Viper",
  "Saw-scaled Viper",
  "Spectacled Cobra"
]

VENOMOUS_CLASSES = [
  "Common Krait",
  "King Cobra",
  "Monocled Cobra",
  "Russell's Viper",
  "Saw-scaled Viper",
  "Spectacled Cobra"
]

SNAKE_METADATA = {}
for label in SNAKE_LABELS:
    slug = label.lower().replace(" ", "-").replace("'", "")
    SNAKE_METADATA[label] = {
        "slug": slug,
        "is_venomous": label in VENOMOUS_CLASSES
    }

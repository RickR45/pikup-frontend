interface ItemDimension {
  length: number;
  width: number;
  height: number;
  weight: number;
}

interface ItemVariant {
  name: string;
  dimensions: ItemDimension;
}

interface ItemCategory {
  name: string;
  variants: ItemVariant[];
}

export const itemCategories: ItemCategory[] = [
  {
    name: "Couch/Sofa",
    variants: [
      {
        name: "Loveseat (2-seater)",
        dimensions: { length: 58, width: 38, height: 36, weight: 100 }
      },
      {
        name: "Standard Sofa (3-seater)",
        dimensions: { length: 84, width: 38, height: 36, weight: 150 }
      },
      {
        name: "Sectional (L-shaped)",
        dimensions: { length: 95, width: 95, height: 36, weight: 200 }
      },
      {
        name: "Sleeper Sofa",
        dimensions: { length: 84, width: 38, height: 36, weight: 180 }
      }
    ]
  },
  {
    name: "Bed",
    variants: [
      {
        name: "Twin",
        dimensions: { length: 75, width: 38, height: 12, weight: 50 }
      },
      {
        name: "Full",
        dimensions: { length: 75, width: 54, height: 12, weight: 65 }
      },
      {
        name: "Queen",
        dimensions: { length: 80, width: 60, height: 12, weight: 80 }
      },
      {
        name: "King",
        dimensions: { length: 80, width: 76, height: 12, weight: 100 }
      }
    ]
  },
  {
    name: "Table",
    variants: [
      {
        name: "Coffee Table",
        dimensions: { length: 48, width: 24, height: 18, weight: 40 }
      },
      {
        name: "Dining Table (4-seater)",
        dimensions: { length: 48, width: 36, height: 30, weight: 70 }
      },
      {
        name: "Dining Table (6-seater)",
        dimensions: { length: 72, width: 36, height: 30, weight: 90 }
      },
      {
        name: "Side Table",
        dimensions: { length: 20, width: 20, height: 24, weight: 20 }
      }
    ]
  },
  {
    name: "Chair",
    variants: [
      {
        name: "Dining Chair",
        dimensions: { length: 20, width: 20, height: 36, weight: 15 }
      },
      {
        name: "Armchair",
        dimensions: { length: 35, width: 38, height: 38, weight: 45 }
      },
      {
        name: "Office Chair",
        dimensions: { length: 25, width: 25, height: 42, weight: 35 }
      },
      {
        name: "Recliner",
        dimensions: { length: 40, width: 38, height: 40, weight: 100 }
      }
    ]
  },
  {
    name: "Dresser",
    variants: [
      {
        name: "3-Drawer",
        dimensions: { length: 36, width: 18, height: 30, weight: 80 }
      },
      {
        name: "6-Drawer",
        dimensions: { length: 60, width: 18, height: 32, weight: 120 }
      },
      {
        name: "Tall Dresser",
        dimensions: { length: 36, width: 18, height: 48, weight: 100 }
      }
    ]
  },
  {
    name: "Box/Container",
    variants: [
      {
        name: "Small Box",
        dimensions: { length: 16, width: 12, height: 12, weight: 20 }
      },
      {
        name: "Medium Box",
        dimensions: { length: 18, width: 18, height: 16, weight: 30 }
      },
      {
        name: "Large Box",
        dimensions: { length: 24, width: 20, height: 20, weight: 40 }
      },
      {
        name: "Wardrobe Box",
        dimensions: { length: 24, width: 24, height: 48, weight: 35 }
      }
    ]
  },
  {
    name: "Appliance",
    variants: [
      {
        name: "Refrigerator",
        dimensions: { length: 36, width: 32, height: 70, weight: 300 }
      },
      {
        name: "Washing Machine",
        dimensions: { length: 27, width: 27, height: 36, weight: 150 }
      },
      {
        name: "Dryer",
        dimensions: { length: 27, width: 27, height: 36, weight: 125 }
      },
      {
        name: "Dishwasher",
        dimensions: { length: 24, width: 25, height: 35, weight: 100 }
      }
    ]
  }
];

export type { ItemDimension, ItemVariant, ItemCategory }; 
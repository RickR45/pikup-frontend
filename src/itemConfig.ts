export interface ItemDimension {
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface ItemVariant {
  name: string;
  dimensions: ItemDimension;
  subItems?: ItemVariant[];
}

export interface ItemCategory {
  name: string;
  items: ItemVariant[];
}

export const itemCategories: ItemCategory[] = [
  {
    name: "Furniture",
    items: [
      {
        name: "Couch",
        dimensions: { length: 84, width: 36, height: 36, weight: 100 },
        subItems: [
          { name: "Loveseat", dimensions: { length: 60, width: 35, height: 35, weight: 80 } },
          { name: "2-Seater Couch", dimensions: { length: 70, width: 35, height: 35, weight: 100 } },
          { name: "3-Seater Couch", dimensions: { length: 85, width: 35, height: 35, weight: 120 } },
          { name: "Sectional Couch (Small)", dimensions: { length: 100, width: 65, height: 35, weight: 150 } },
          { name: "Sectional Couch (Large)", dimensions: { length: 130, width: 85, height: 35, weight: 200 } },
          { name: "Sleeper Sofa (Pull-Out Bed)", dimensions: { length: 75, width: 35, height: 35, weight: 150 } }
    ]
  },
  {
        name: "Mattress",
        dimensions: { length: 80, width: 60, height: 12, weight: 80 },
        subItems: [
          { name: "Twin", dimensions: { length: 75, width: 39, height: 10, weight: 50 } },
          { name: "Full", dimensions: { length: 75, width: 54, height: 10, weight: 65 } },
          { name: "Queen", dimensions: { length: 80, width: 60, height: 12, weight: 80 } },
          { name: "King", dimensions: { length: 80, width: 76, height: 12, weight: 100 } },
          { name: "California King", dimensions: { length: 84, width: 72, height: 12, weight: 110 } }
    ]
  },
  {
        name: "Bed Frame",
        dimensions: { length: 80, width: 60, height: 8, weight: 50 },
        subItems: [
          { name: "Twin Frame", dimensions: { length: 75, width: 39, height: 8, weight: 40 } },
          { name: "Full Frame", dimensions: { length: 75, width: 54, height: 8, weight: 45 } },
          { name: "Queen Frame", dimensions: { length: 80, width: 60, height: 8, weight: 50 } },
          { name: "King Frame", dimensions: { length: 80, width: 76, height: 8, weight: 60 } }
        ]
      },
      {
        name: "Table",
        dimensions: { length: 72, width: 36, height: 30, weight: 80 },
        subItems: [
          { name: "Coffee Table", dimensions: { length: 48, width: 24, height: 18, weight: 30 } },
          { name: "End Table", dimensions: { length: 24, width: 24, height: 24, weight: 20 } },
          { name: "Dining Table (4-seat)", dimensions: { length: 60, width: 36, height: 30, weight: 70 } },
          { name: "Dining Table (6-seat)", dimensions: { length: 78, width: 42, height: 30, weight: 90 } }
        ]
      },
      {
        name: "Dresser",
        dimensions: { length: 60, width: 20, height: 30, weight: 60 },
        subItems: [
          { name: "Small Dresser", dimensions: { length: 36, width: 18, height: 30, weight: 40 } },
          { name: "Medium Dresser", dimensions: { length: 48, width: 20, height: 30, weight: 50 } },
          { name: "Large Dresser", dimensions: { length: 60, width: 20, height: 30, weight: 60 } }
        ]
      },
      {
        name: "Chairs",
        dimensions: { length: 20, width: 20, height: 36, weight: 15 },
        subItems: [
          { name: "Dining Chair", dimensions: { length: 20, width: 20, height: 36, weight: 15 } },
          { name: "Office Chair", dimensions: { length: 24, width: 24, height: 40, weight: 25 } },
          { name: "Recliner", dimensions: { length: 40, width: 36, height: 40, weight: 80 } },
          { name: "Accent Chair", dimensions: { length: 30, width: 30, height: 36, weight: 30 } }
        ]
      },
      {
        name: "TV Stand",
        dimensions: { length: 60, width: 20, height: 24, weight: 40 }
      },
      {
        name: "Bookcase",
        dimensions: { length: 36, width: 12, height: 72, weight: 40 },
        subItems: [
          { name: "Small Bookcase", dimensions: { length: 24, width: 12, height: 48, weight: 30 } },
          { name: "Large Bookcase", dimensions: { length: 36, width: 12, height: 72, weight: 40 } }
        ]
      }
    ]
  },
  {
    name: "Appliances",
    items: [
      { name: "Mini Fridge", dimensions: { length: 20, width: 20, height: 36, weight: 50 } },
      { name: "Standard Refrigerator", dimensions: { length: 36, width: 36, height: 70, weight: 200 } },
      { name: "Large Refrigerator", dimensions: { length: 36, width: 36, height: 80, weight: 250 } },
      { name: "Washer", dimensions: { length: 27, width: 27, height: 38, weight: 150 } },
      { name: "Dryer", dimensions: { length: 27, width: 27, height: 38, weight: 125 } },
      { name: "Dishwasher", dimensions: { length: 24, width: 24, height: 35, weight: 100 } },
      { name: "Microwave", dimensions: { length: 20, width: 20, height: 12, weight: 30 } },
      { name: "Chest Freezer", dimensions: { length: 30, width: 30, height: 36, weight: 150 } }
    ]
  },
  {
    name: "Boxes",
    items: [
      { name: "Small Box", dimensions: { length: 16, width: 12, height: 12, weight: 20 } },
      { name: "Medium Box", dimensions: { length: 18, width: 18, height: 16, weight: 30 } },
      { name: "Large Box", dimensions: { length: 24, width: 18, height: 18, weight: 40 } },
      { name: "Wardrobe Box", dimensions: { length: 24, width: 24, height: 48, weight: 35 } },
      { name: "TV Box (for Flatscreens)", dimensions: { length: 55, width: 8, height: 36, weight: 25 } }
    ]
  },
  {
    name: "Outdoor",
    items: [
      { name: "BBQ Grill (Small)", dimensions: { length: 48, width: 24, height: 45, weight: 80 } },
      { name: "BBQ Grill (Large)", dimensions: { length: 65, width: 28, height: 50, weight: 120 } },
      { name: "Patio Chair", dimensions: { length: 30, width: 30, height: 36, weight: 25 } },
      { name: "Patio Table", dimensions: { length: 60, width: 60, height: 30, weight: 50 } },
      { name: "Lawn Mower (Push)", dimensions: { length: 40, width: 22, height: 36, weight: 60 } },
      { name: "Lawn Mower (Ride-on)", dimensions: { length: 72, width: 48, height: 48, weight: 400 } }
    ]
  },
  {
    name: "Electronics",
    items: [
      { name: "TV (Small <40\")", dimensions: { length: 36, width: 6, height: 24, weight: 30 } },
      { name: "TV (Medium 40–60\")", dimensions: { length: 48, width: 6, height: 30, weight: 50 } },
      { name: "TV (Large >60\")", dimensions: { length: 60, width: 8, height: 36, weight: 80 } },
      { name: "Bicycle", dimensions: { length: 68, width: 24, height: 40, weight: 30 } },
      { name: "Treadmill", dimensions: { length: 75, width: 36, height: 50, weight: 200 } },
      { name: "Elliptical Machine", dimensions: { length: 60, width: 30, height: 60, weight: 150 } },
      { name: "Mirror (Large Fragile Item)", dimensions: { length: 60, width: 40, height: 4, weight: 40 } }
    ]
  }
]; 
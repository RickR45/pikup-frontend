import React, { useState } from 'react';
import { ItemCategory, ItemVariant, ItemDimension, itemCategories } from './itemConfig';
import './ItemSelector.css';

interface ItemSelectorProps {
  onItemAdd: (item: ItemVariant, dimensions: ItemDimension) => void;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({ onItemAdd }) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItemVariant | null>(null);

  const handleAddItem = () => {
    if (selectedItem) {
      onItemAdd(selectedItem, selectedItem.dimensions);
      setSelectedItem(null);
    }
  };

  return (
    <div className="item-selector-container">
      <div className="item-selector-scroll">
        <div className="item-selector-section">
          <h3 className="item-selector-title">Categories</h3>
          <div className="item-selector-button-container">
            {itemCategories.map((category) => (
              <button
                key={category.name}
                className={`item-selector-button ${selectedCategory?.name === category.name ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {selectedCategory && (
          <div className="item-selector-section">
            <h3 className="item-selector-title">Items</h3>
            <div className="item-selector-button-container">
              {selectedCategory.items.map((item) => (
                <button
                  key={item.name}
                  className={`item-selector-button ${selectedItem?.name === item.name ? 'selected' : ''}`}
                  onClick={() => setSelectedItem(item)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedItem && selectedItem.subItems && (
          <div className="item-selector-section">
            <h3 className="item-selector-title">Sub Items</h3>
            <div className="item-selector-button-container">
              {selectedItem.subItems.map((subItem) => (
                <button
                  key={subItem.name}
                  className="item-selector-button selected"
                  onClick={() => {
                    onItemAdd(subItem, subItem.dimensions);
                    setSelectedItem(null);
                  }}
                >
                  {subItem.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedItem && !selectedItem.subItems && (
          <button
            className="item-selector-add-button"
            onClick={handleAddItem}
          >
            Add Item
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemSelector; 
import React, { useState } from 'react';
import { ItemCategory, ItemVariant, ItemDimension, itemCategories } from './itemConfig';
import './ItemSelector.css';

interface ItemSelectorProps {
  onItemAdd: (item: ItemVariant, dimensions: ItemDimension) => void;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({ onItemAdd }) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItemVariant | null>(null);
  const [selectedSubItem, setSelectedSubItem] = useState<ItemVariant | null>(null);

  const handleAddItem = () => {
    if (selectedSubItem) {
      onItemAdd(selectedSubItem, selectedSubItem.dimensions);
      setSelectedSubItem(null);
    } else if (selectedItem) {
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
                  onClick={() => {
                    setSelectedItem(item);
                    setSelectedSubItem(null);
                  }}
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
                  className={`item-selector-button ${selectedSubItem?.name === subItem.name ? 'selected' : ''}`}
                  onClick={() => setSelectedSubItem(subItem)}
                >
                  {subItem.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {(selectedItem || selectedSubItem) && (
          <button
            onClick={handleAddItem}
            className="add-item-button"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '1.5rem',
              width: '100%',
              minHeight: '60px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>+</span> Add Item
          </button>
        )}
      </div>
    </div>
  );
};

const styles = `
  .add-item-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1.25rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1.5rem;
    width: 100%;
    min-height: 60px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .add-item-button:hover {
    background-color: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  .plus-icon {
    font-size: 2rem;
    font-weight: bold;
  }
`;

export default ItemSelector; 
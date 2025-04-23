import React, { useState } from 'react';
import { itemCategories, ItemDimension } from './itemConfig';
import './ItemSelector.css';

interface ItemSelectorProps {
  onItemAdd: (itemName: string, dimensions: ItemDimension) => void;
}

const ItemSelector: React.FC<ItemSelectorProps> = ({ onItemAdd }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="item-selector">
      {!selectedCategory ? (
        <div className="category-grid">
          {itemCategories.map((category) => (
            <button
              key={category.name}
              className="category-button"
              onClick={() => setSelectedCategory(category.name)}
            >
              <div className="category-icon">
                {/* You can add icons here later */}
                {category.name[0]}
              </div>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="variant-selector">
          <div className="variant-header">
            <button
              className="back-button"
              onClick={() => setSelectedCategory(null)}
            >
              ← Back
            </button>
            <h3>{selectedCategory}</h3>
          </div>
          <div className="variant-grid">
            {itemCategories
              .find((cat) => cat.name === selectedCategory)
              ?.variants.map((variant) => (
                <button
                  key={variant.name}
                  className="variant-button"
                  onClick={() => {
                    onItemAdd(variant.name, variant.dimensions);
                    setSelectedCategory(null);
                  }}
                >
                  <div className="variant-info">
                    <span className="variant-name">{variant.name}</span>
                    <span className="variant-dimensions">
                      {variant.dimensions.length}" × {variant.dimensions.width}" × {variant.dimensions.height}"
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemSelector; 
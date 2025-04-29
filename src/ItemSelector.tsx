import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ItemCategory, ItemVariant, ItemDimension, itemCategories } from './itemConfig';

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
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.buttonContainer}>
            {itemCategories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.button,
                  selectedCategory?.name === category.name && styles.selectedButton
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={styles.buttonText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {selectedCategory && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items</Text>
            <View style={styles.buttonContainer}>
              {selectedCategory.items.map((item) => (
                <TouchableOpacity
                  key={item.name}
                  style={[
                    styles.button,
                    selectedItem?.name === item.name && styles.selectedButton
                  ]}
                  onPress={() => setSelectedItem(item)}
                >
                  <Text style={styles.buttonText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {selectedItem && selectedItem.subItems && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sub Items</Text>
            <View style={styles.buttonContainer}>
              {selectedItem.subItems.map((subItem) => (
                <TouchableOpacity
                  key={subItem.name}
                  style={[
                    styles.button,
                    styles.selectedButton
                  ]}
                  onPress={() => {
                    onItemAdd(subItem, subItem.dimensions);
                    setSelectedItem(null);
                  }}
                >
                  <Text style={styles.buttonText}>{subItem.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {selectedItem && !selectedItem.subItems && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddItem}
          >
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 100,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#2196f3',
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ItemSelector; 
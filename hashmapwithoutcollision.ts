// --- HashMap without Collision Handling ---
// Simple implementation that assumes no two keys will hash to the same index
// In real-world scenarios, this would overwrite values on collision

class SimpleHashMap<K, V> {
  private buckets: (V | null)[];
  private keys: (K | null)[];
  private capacity: number;
  private size: number;

  constructor(capacity: number = 16) {
    this.capacity = capacity;
    this.size = 0;
    this.buckets = new Array(capacity).fill(null);
    this.keys = new Array(capacity).fill(null);
  }

  // Simple hash function - converts key to array index
  private hash(key: K): number {
    const keyString = String(key);
    let hash = 0;
    for (let i = 0; i < keyString.length; i++) {
      hash = (hash + keyString.charCodeAt(i)) % this.capacity;
    }
    return hash;
  }

  // Insert key-value pair (overwrites on collision)
  put(key: K, value: V): void {
    const index = this.hash(key);
    
    // If slot is empty, increment size
    if (this.buckets[index] === null) {
      this.size++;
    }
    
    // Store key and value at the hashed index
    this.keys[index] = key;
    this.buckets[index] = value;
    
    console.log(`Stored [${key}: ${value}] at index ${index}`);
  }

  // Get value by key
  get(key: K): V | null {
    const index = this.hash(key);
    
    // Check if the key at this index matches our search key
    if (this.keys[index] === key) {
      return this.buckets[index];
    }
    
    return null; // Key not found or collision occurred
  }

  // Remove key-value pair
  remove(key: K): boolean {
    const index = this.hash(key);
    
    // Check if the key exists at this index
    if (this.keys[index] === key) {
      this.keys[index] = null;
      this.buckets[index] = null;
      this.size--;
      return true;
    }
    
    return false; // Key not found
  }

  // Check if key exists
  has(key: K): boolean {
    const index = this.hash(key);
    return this.keys[index] === key;
  }

  // Get all stored keys
  getKeys(): K[] {
    return this.keys.filter(key => key !== null) as K[];
  }

  // Get current size
  getSize(): number {
    return this.size;
  }

  // Display the hash map structure
  display(): void {
    console.log("SimpleHashMap contents:");
    for (let i = 0; i < this.capacity; i++) {
      if (this.buckets[i] !== null) {
        console.log(`Index ${i}: [${this.keys[i]}: ${this.buckets[i]}]`);
      }
    }
    console.log(`Size: ${this.size}/${this.capacity}`);
  }
}

// --- Example Usage ---
const simpleMap = new SimpleHashMap<string, number>(8); // Small capacity to show potential issues

console.log("=== Adding items ===");
simpleMap.put("apple", 5);
simpleMap.put("banana", 7);
simpleMap.put("orange", 3);

console.log("\n=== Current state ===");
simpleMap.display();

console.log("\n=== Getting values ===");
console.log("apple:", simpleMap.get("apple"));
console.log("banana:", simpleMap.get("banana"));
console.log("grape:", simpleMap.get("grape")); // Not found

console.log("\n=== Demonstrating collision problem ===");
// These might hash to the same index and cause overwriting
simpleMap.put("cat", 10);
simpleMap.put("dog", 15);

console.log("\n=== Final state ===");
simpleMap.display();

console.log("\n=== Testing collision ===");
// Let's force a collision by adding keys that hash to same index
const map2 = new SimpleHashMap<string, number>(4); // Very small capacity
map2.put("a", 1);   // hash("a") might = 1
map2.put("e", 5);   // hash("e") might = 1 (collision!)
map2.put("i", 9);   // hash("i") might = 1 (collision!)

console.log("\nAfter potential collisions:");
map2.display();

console.log("\nTrying to get 'a':", map2.get("a")); // Might return null if overwritten
console.log("Trying to get 'e':", map2.get("e")); // Might return null if overwritten
console.log("Trying to get 'i':", map2.get("i")); // Should return 9 (last written)
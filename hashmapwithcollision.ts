// --- HashMap with Collision Handling ---
// Uses chaining method to handle collisions (multiple keys hashing to the same index)

// Node class for chaining (linked list)
class HashNode<K, V> {
  key: K;
  value: V;
  next: HashNode<K, V> | null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

// HashMap class with collision handling
class HashMap<K, V> {
  private buckets: (HashNode<K, V> | null)[];
  private size: number;
  private capacity: number;

  constructor(capacity: number = 16) {
    this.capacity = capacity;
    this.size = 0;
    this.buckets = new Array(capacity).fill(null);
  }

  // Hash function - converts key to array index
  private hash(key: K): number {
    const keyString = String(key);
    let hash = 0;
    for (let i = 0; i < keyString.length; i++) {
      hash = (hash + keyString.charCodeAt(i) * i) % this.capacity;
    }
    return hash;
  }

  // Insert key-value pair
  put(key: K, value: V): void {
    const index = this.hash(key);
    
    // If bucket is empty, create new node
    if (!this.buckets[index]) {
      this.buckets[index] = new HashNode(key, value);
      this.size++;
      return;
    }

    // Handle collision: traverse the chain
    let current = this.buckets[index];
    while (current) {
      // If key already exists, update value
      if (current.key === key) {
        current.value = value;
        return;
      }
      // If we reach the end, add new node
      if (!current.next) {
        current.next = new HashNode(key, value);
        this.size++;
        return;
      }
      current = current.next;
    }
  }

  // Get value by key
  get(key: K): V | null {
    const index = this.hash(key);
    let current = this.buckets[index];

    // Traverse the chain to find the key
    while (current) {
      if (current.key === key) {
        return current.value;
      }
      current = current.next;
    }
    return null; // Key not found
  }

  // Remove key-value pair
  remove(key: K): boolean {
    const index = this.hash(key);
    let current = this.buckets[index];

    // If bucket is empty
    if (!current) return false;

    // If first node has the key
    if (current.key === key) {
      this.buckets[index] = current.next;
      this.size--;
      return true;
    }

    // Traverse to find the key
    while (current.next) {
      if (current.next.key === key) {
        current.next = current.next.next;
        this.size--;
        return true;
      }
      current = current.next;
    }
    return false; // Key not found
  }

  // Check if key exists
  has(key: K): boolean {
    return this.get(key) !== null;
  }

  // Get all keys
  keys(): K[] {
    const keys: K[] = [];
    for (let i = 0; i < this.capacity; i++) {
      let current = this.buckets[i];
      while (current) {
        keys.push(current.key);
        current = current.next;
      }
    }
    return keys;
  }

  // Get current size
  getSize(): number {
    return this.size;
  }

  // Display the hash map structure
  display(): void {
    console.log("HashMap contents:");
    for (let i = 0; i < this.capacity; i++) {
      let current = this.buckets[i];
      if (current) {
        let chain = `Bucket ${i}: `;
        while (current) {
          chain += `[${current.key}: ${current.value}]`;
          if (current.next) chain += " -> ";
          current = current.next;
        }
        console.log(chain);
      }
    }
  }
}

// --- Example Usage ---
const hashMap = new HashMap<string, number>();

// Adding values (some will cause collisions)
hashMap.put("apple", 5);
hashMap.put("banana", 7);
hashMap.put("orange", 3);
hashMap.put("grape", 12);
hashMap.put("kiwi", 8);

// Display the structure
hashMap.display();

// Get values
console.log("apple:", hashMap.get("apple")); // 5
console.log("banana:", hashMap.get("banana")); // 7
console.log("cherry:", hashMap.get("cherry")); // null

// Check if key exists
console.log("Has orange:", hashMap.has("orange")); // true

// Remove a key
hashMap.remove("banana");
console.log("After removing banana:");
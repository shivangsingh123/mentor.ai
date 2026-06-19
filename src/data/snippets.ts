import { CodeSnippet } from '../types';

export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'js-vulnerable',
    name: 'JS: SQL Injection & Async Leak',
    language: 'javascript',
    description: 'An unsafe database query vulnerable to SQL injection with unhandled async promise issues.',
    code: `// Express handler with authentication risk & SQL Injection
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Vulnerable SQL Injection Query
  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
  
  db.query(query, (err, users) => {
    if (err) {
      // Unhandled state - potential crash or data exposure
      res.status(500).send(err.message);
    }
    
    if (users.length > 0) {
      // Security warning: Sending entire user object containing salts/hashes to browser
      res.json({ success: true, user: users[0] });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});`
  },
  {
    id: 'py-mutable-args',
    name: 'Python: Mutable Default & O(N²) Loop',
    language: 'python',
    description: 'Classic Python pitfall with dynamic mutable arguments paired with a highly sub-optimal quadratic lookup.',
    code: `# Unoptimized user processing with mutable default arguments
def process_user_records(new_users, active_cache=[]):
    # DANGEROUS: active_cache retains state across multiple calls!
    for user in new_users:
        active_cache.append(user)
    
    duplicates = []
    # O(N^2) inefficient nested lookup for locating duplicates
    for i in range(len(active_cache)):
        for j in range(len(active_cache)):
            if i != j and active_cache[i]['email'] == active_cache[j]['email']:
                if active_cache[i] not in duplicates:
                    duplicates.append(active_cache[i])
                    
    return duplicates, active_cache`
  },
  {
    id: 'cpp-memory-leak',
    name: 'C++: Raw Pointers & Mem Leak',
    language: 'cpp',
    description: 'Demonstrates manual heap allocation without safety nets, leading to potential segment violations and leak paths.',
    code: `#include <iostream>
#include <vector>

class DataProcessor {
private:
    int* rawBuffer;
    int size;
public:
    DataProcessor(int s) {
        size = s;
        rawBuffer = new int[s]; // Allocated on heap
    }
    
    // Violation: Missing destructor, copy constructor, and assignment operator (Rule of 3/5)
    
    void loadData(std::vector<int> source) {
        for(int i = 0; i < source.size(); i++) {
            if(i >= size) {
                // Out of bounds raw access, undefined behavior!
                rawBuffer[i] = source[i]; 
            } else {
                rawBuffer[i] = source[i];
            }
        }
    }
    
    void display() {
        std::cout << "Buffer item 0: " << rawBuffer[0] << std::endl;
    }
};

int main() {
    DataProcessor* proc = new DataProcessor(50);
    std::vector<int> testData = {10, 20, 30, 40};
    proc->loadData(testData);
    proc->display();
    // CRITICAL LEAK: Destructors never invoked, proc itself never deleted!
    return 0;
}`
  },
  {
    id: 'rust-borrow-checker',
    name: 'Rust: Complex Lifecycle Struggle',
    language: 'rust',
    description: 'Common compilation struggles involving heap mutability inside iterate flows.',
    code: `// Sub-optimal Rust structure striving to modify values
fn update_tags(records: &mut Vec<String>) {
    let mut updated = Vec::new();
    
    for r in records.iter() {
        if r.starts_with("legacy_") {
            // Unsafe string slicing or allocations
            let clean = r.replace("legacy_", "");
            updated.push(clean);
        }
    }
    
    // Attempting to append mutable items with active borrow conflicts
    for val in updated {
        records.push(val); // Error: records is already borrowed as immutable during iter!
    }
}`
  },
  {
    id: 'go-race-condition',
    name: 'Go: Map Concurrency Race',
    language: 'go',
    description: 'Goroutines accessing a shared native map without synchronization, triggering critical runtime panic.',
    code: `package main

import (
	"fmt"
	"sync"
)

type UserCache struct {
	data map[string]string
}

// CRITICAL BUG: Maps are not safe for concurrent usage!
func main() {
	cache := UserCache{data: make(map[string]string)}
	var wg sync.WaitGroup

	for i := 0; i < 1000; i++ {
		wg.Add(2)
		
		go func(key, val string) {
			defer wg.Done()
			cache.data[key] = val // Concurrent Write
		}(fmt.Sprintf("key-%d", i), "active")

		go func(key string) {
			defer wg.Done()
			_ = cache.data[key] // Concurrent Read, will Panic on write conflict!
		}(fmt.Sprintf("key-%d", i))
	}

	wg.Wait()
}`
  }
];

import { Lesson } from '../types';

export const lessons: Lesson[] = [
  {
    id: 'intro',
    title: '1. พื้นฐาน Riverpod',
    shortDescription: 'ทำความรู้จัก Providerscope และ Provider ตัวแรก',
    content: `
# ยินดีต้อนรับสู่ Riverpod

Riverpod เป็น State Management ที่ทันสมัยสำหรับ Flutter ถูกออกแบบมาเพื่อแก้ปัญหาของ Provider ตัวเก่า โดยมีความปลอดภัย (Compile-safe) และทดสอบง่ายกว่า

### สิ่งที่ต้องเตรียม (Setup)
ก่อนจะเริ่มใช้งาน เราต้องคลุม App ของเราด้วย \`ProviderScope\` ก่อน เพื่อให้ Widget ทั้งหมดสามารถเข้าถึง State ได้

### Provider พื้นฐาน
เราจะเริ่มจาก \`Provider\` แบบธรรมดา ซึ่งเหมาะสำหรับค่าที่ **อ่านอย่างเดียว (Read-only)** ไม่มีการเปลี่ยนแปลง
    `,
    codeSnippet: `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';

// 1. สร้าง Provider (Global variable แบบ testable)
final helloProvider = Provider<String>((ref) {
  return 'สวัสดี Riverpod!';
});

void main() {
  runApp(
    // 2. ต้องคลุมด้วย ProviderScope เสมอ
    const ProviderScope(
      child: MyApp(),
    ),
  );
}

// 3. เปลี่ยนจาก StatelessWidget เป็น ConsumerWidget
class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 4. ใช้ ref.watch เพื่ออ่านค่า
    final String message = ref.watch(helloProvider);

    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text(message),
        ),
      ),
    );
  }
}`
  },
  {
    id: 'state',
    title: '2. จัดการ State (Notifier)',
    shortDescription: 'การสร้าง State ที่เปลี่ยนแปลงได้ด้วย NotifierProvider',
    content: `
# การจัดการ State ที่เปลี่ยนแปลงได้

ใน Riverpod 2.0+ เราแนะนำให้ใช้ \`Notifier\` และ \`NotifierProvider\` แทน StateProvider หรือ ChangeNotifier แบบเก่า เพื่อความสะอาดและโครงสร้างที่ชัดเจน

### คอนเซปต์ CRUD พื้นฐาน
ในการทำระบบ CRUD (Create, Read, Update, Delete) เราต้องมี Model และ Class ที่คอยจัดการ Logic (Business Logic)

ตัวอย่างนี้เราจะสร้างระบบ **Counter** อย่างง่ายเพื่อเข้าใจการ Update state ก่อน
    `,
    codeSnippet: `// 1. สร้าง Notifier Class
class CounterNotifier extends Notifier<int> {
  @override
  int build() {
    return 0; // ค่าเริ่มต้นของ State
  }

  void increment() {
    state = state + 1; // การเปลี่ยนค่า state จะทำให้ UI rebuild
  }
  
  void decrement() {
    state = state - 1;
  }
}

// 2. สร้าง Provider เชื่อมกับ Notifier
final counterProvider = NotifierProvider<CounterNotifier, int>(() {
  return CounterNotifier();
});

class CounterPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Read: อ่านค่า
    final int count = ref.watch(counterProvider);

    return Scaffold(
      body: Center(child: Text('Count: $count')),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Update: เรียกใช้ function ใน Notifier
          ref.read(counterProvider.notifier).increment();
        },
        child: Icon(Icons.add),
      ),
    );
  }
}`
  },
  {
    id: 'crud-model',
    title: '3. CRUD กับ Immutable List',
    shortDescription: 'การเพิ่ม ลบ แก้ไข ข้อมูลใน List แบบ Immutable',
    content: `
# CRUD แบบ Immutable

ใน Flutter การจัดการ List ควรทำแบบ Immutable (สร้าง List ใหม่เสมอเมื่อมีการแก้ไข) เพื่อให้ Riverpod ตรวจจับการเปลี่ยนแปลงได้ถูกต้อง

### โจทย์: Todo List
เราจะสร้าง Todo List ที่สามารถ เพิ่ม (Create), เปลี่ยนสถานะ (Update), และลบ (Delete) ได้

**เทคนิคสำคัญ:**
*   **Add:** \`[...state, newItem]\`
*   **Remove:** \`state.where((item) => item.id != id).toList()\`
*   **Update:** \`state.map((item) => ...).toList()\`
    `,
    codeSnippet: `class Todo {
  final String id;
  final String description;
  final bool completed;
  Todo({required this.id, required this.description, this.completed = false});
  
  // copyWith method ช่วยให้เราสร้าง object ใหม่จากตัวเดิมได้ง่าย
  Todo copyWith({String? id, String? description, bool? completed}) {
    return Todo(
      id: id ?? this.id,
      description: description ?? this.description,
      completed: completed ?? this.completed,
    );
  }
}

class TodoListNotifier extends Notifier<List<Todo>> {
  @override
  List<Todo> build() => [];

  // Create
  void addTodo(String description) {
    final newTodo = Todo(
      id: DateTime.now().toString(), 
      description: description
    );
    state = [...state, newTodo];
  }

  // Update (Toggle)
  void toggleTodo(String id) {
    state = state.map((todo) {
      if (todo.id == id) {
        return todo.copyWith(completed: !todo.completed);
      }
      return todo;
    }).toList();
  }

  // Delete
  void removeTodo(String id) {
    state = state.where((todo) => todo.id != id).toList();
  }
}

final todoListProvider = NotifierProvider<TodoListNotifier, List<Todo>>(TodoListNotifier.new);`
  },
  {
    id: 'async',
    title: '4. AsyncValue (API Calls)',
    shortDescription: 'จัดการ Loading และ Error state อย่างมืออาชีพ',
    content: `
# การทำงานกับ API (Async)

Riverpod มีคลาสพระเอกชื่อ \`AsyncValue\` ช่วยจัดการสถานะ 3 อย่างให้เราอัตโนมัติ:
1.  **data**: โหลดเสร็จแล้ว มีข้อมูล
2.  **loading**: กำลังโหลด
3.  **error**: เกิดข้อผิดพลาด

เราจะเปลี่ยนจาก \`Notifier\` เป็น \`AsyncNotifier\` เมื่อข้อมูลมาจาก Future/API

### การใช้งานใน UI
ใช้ \`.when\` ในการแตก UI ออกเป็น 3 สถานะ ทำให้โค้ดสะอาดมาก ไม่ต้องเขียน if-else เช็ค isLoading เอง
    `,
    codeSnippet: `// สมมติว่านี่คือ API service
class FakeApiService {
  Future<List<String>> fetchProducts() async {
    await Future.delayed(const Duration(seconds: 2));
    return ['iPhone', 'MacBook', 'iPad'];
  }
}

// ใช้ AsyncNotifier แทน Notifier ปกติ
class ProductsNotifier extends AsyncNotifier<List<String>> {
  @override
  Future<List<String>> build() async {
    // โหลดข้อมูลครั้งแรก
    return FakeApiService().fetchProducts();
  }

  Future<void> refresh() async {
    // set state เป็น loading เพื่อโชว์ spinner
    state = const AsyncValue.loading();
    // guard ช่วย try-catch ให้เอง
    state = await AsyncValue.guard(() => FakeApiService().fetchProducts());
  }
}

final productsProvider = AsyncNotifierProvider<ProductsNotifier, List<String>>(ProductsNotifier.new);

// UI
class ProductPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productsAsync = ref.watch(productsProvider);

    return Scaffold(
      body: productsAsync.when(
        data: (products) => ListView(
          children: products.map((p) => Text(p)).toList(),
        ),
        loading: () => const CircularProgressIndicator(),
        error: (err, stack) => Text('Error: $err'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => ref.read(productsProvider.notifier).refresh(),
        child: const Icon(Icons.refresh),
      ),
    );
  }
}`
  }
];

export interface QuestionItem {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correct: string;
}

export const JAVA_QUESTIONS: QuestionItem[] = [
  { id: "j1", text: "Which keyword is used to define a class in Java?", options: [{ id: "a", text: "class" }, { id: "b", text: "Class" }, { id: "c", text: "define" }, { id: "d", text: "struct" }], correct: "a" },
  { id: "j2", text: "What is the default value of a boolean variable in Java?", options: [{ id: "a", text: "true" }, { id: "b", text: "false" }, { id: "c", text: "null" }, { id: "d", text: "0" }], correct: "b" },
  { id: "j3", text: "Which method is the entry point of a Java application?", options: [{ id: "a", text: "start()" }, { id: "b", text: "run()" }, { id: "c", text: "main()" }, { id: "d", text: "init()" }], correct: "c" },
  { id: "j4", text: "What does JVM stand for?", options: [{ id: "a", text: "Java Very Machine" }, { id: "b", text: "Java Virtual Machine" }, { id: "c", text: "Java Variable Method" }, { id: "d", text: "Java Verified Module" }], correct: "b" },
  { id: "j5", text: "Which data type is used to store a single character in Java?", options: [{ id: "a", text: "String" }, { id: "b", text: "char" }, { id: "c", text: "Character" }, { id: "d", text: "letter" }], correct: "b" },
  { id: "j6", text: "What is the size of an int in Java?", options: [{ id: "a", text: "16 bits" }, { id: "b", text: "32 bits" }, { id: "c", text: "64 bits" }, { id: "d", text: "8 bits" }], correct: "b" },
  { id: "j7", text: "Which keyword is used to inherit a class in Java?", options: [{ id: "a", text: "implements" }, { id: "b", text: "inherits" }, { id: "c", text: "extends" }, { id: "d", text: "super" }], correct: "c" },
  { id: "j8", text: "What is the parent class of all classes in Java?", options: [{ id: "a", text: "Main" }, { id: "b", text: "Object" }, { id: "c", text: "Base" }, { id: "d", text: "Super" }], correct: "b" },
  { id: "j9", text: "Which collection class allows duplicate elements?", options: [{ id: "a", text: "Set" }, { id: "b", text: "Map" }, { id: "c", text: "List" }, { id: "d", text: "HashSet" }], correct: "c" },
  { id: "j10", text: "What does the 'final' keyword prevent?", options: [{ id: "a", text: "Compilation" }, { id: "b", text: "Inheritance or reassignment" }, { id: "c", text: "Garbage collection" }, { id: "d", text: "Instantiation" }], correct: "b" },
  { id: "j11", text: "Which operator is used to compare two objects in Java?", options: [{ id: "a", text: "==" }, { id: "b", text: ".equals()" }, { id: "c", text: "===" }, { id: "d", text: ".compare()" }], correct: "b" },
  { id: "j12", text: "What is an interface in Java?", options: [{ id: "a", text: "A class with only static methods" }, { id: "b", text: "A blueprint with abstract methods" }, { id: "c", text: "A type of variable" }, { id: "d", text: "A loop construct" }], correct: "b" },
  { id: "j13", text: "Which access modifier makes a member accessible only within its class?", options: [{ id: "a", text: "public" }, { id: "b", text: "protected" }, { id: "c", text: "private" }, { id: "d", text: "default" }], correct: "c" },
  { id: "j14", text: "What does 'static' mean in Java?", options: [{ id: "a", text: "Variable is constant" }, { id: "b", text: "Belongs to the class, not instances" }, { id: "c", text: "Cannot be changed" }, { id: "d", text: "Is thread-safe" }], correct: "b" },
  { id: "j15", text: "Which exception is thrown when dividing by zero?", options: [{ id: "a", text: "NullPointerException" }, { id: "b", text: "ArithmeticException" }, { id: "c", text: "IOException" }, { id: "d", text: "NumberFormatException" }], correct: "b" },
  { id: "j16", text: "What is polymorphism in Java?", options: [{ id: "a", text: "Using multiple variables" }, { id: "b", text: "One interface, many implementations" }, { id: "c", text: "Writing code in multiple files" }, { id: "d", text: "Using multiple threads" }], correct: "b" },
  { id: "j17", text: "Which loop is guaranteed to execute at least once?", options: [{ id: "a", text: "for" }, { id: "b", text: "while" }, { id: "c", text: "do-while" }, { id: "d", text: "for-each" }], correct: "c" },
  { id: "j18", text: "What is the purpose of the 'this' keyword?", options: [{ id: "a", text: "Refers to the parent class" }, { id: "b", text: "Refers to the current object" }, { id: "c", text: "Creates a new instance" }, { id: "d", text: "Calls the main method" }], correct: "b" },
  { id: "j19", text: "Which package is automatically imported in Java?", options: [{ id: "a", text: "java.util" }, { id: "b", text: "java.io" }, { id: "c", text: "java.lang" }, { id: "d", text: "java.net" }], correct: "c" },
  { id: "j20", text: "What is encapsulation?", options: [{ id: "a", text: "Hiding implementation details" }, { id: "b", text: "Using many classes" }, { id: "c", text: "Running multiple threads" }, { id: "d", text: "Compiling code faster" }], correct: "a" },
];

export const PYTHON_QUESTIONS: QuestionItem[] = [
  { id: "p1", text: "What is the correct file extension for Python files?", options: [{ id: "a", text: ".python" }, { id: "b", text: ".py" }, { id: "c", text: ".pt" }, { id: "d", text: ".pyt" }], correct: "b" },
  { id: "p2", text: "How do you create a variable in Python?", options: [{ id: "a", text: "var x = 5" }, { id: "b", text: "int x = 5" }, { id: "c", text: "x = 5" }, { id: "d", text: "let x = 5" }], correct: "c" },
  { id: "p3", text: "Which function is used to output text in Python?", options: [{ id: "a", text: "echo()" }, { id: "b", text: "print()" }, { id: "c", text: "write()" }, { id: "d", text: "console.log()" }], correct: "b" },
  { id: "p4", text: "How do you insert comments in Python?", options: [{ id: "a", text: "//" }, { id: "b", text: "/* */" }, { id: "c", text: "#" }, { id: "d", text: "--" }], correct: "c" },
  { id: "p5", text: "Which keyword is used to define a function in Python?", options: [{ id: "a", text: "function" }, { id: "b", text: "func" }, { id: "c", text: "def" }, { id: "d", text: "define" }], correct: "c" },
  { id: "p6", text: "What is the output of: type(3.14)?", options: [{ id: "a", text: "int" }, { id: "b", text: "float" }, { id: "c", text: "double" }, { id: "d", text: "decimal" }], correct: "b" },
  { id: "p7", text: "Which method adds an element to the end of a list?", options: [{ id: "a", text: "add()" }, { id: "b", text: "insert()" }, { id: "c", text: "append()" }, { id: "d", text: "push()" }], correct: "c" },
  { id: "p8", text: "What does 'len()' do in Python?", options: [{ id: "a", text: "Returns the type" }, { id: "b", text: "Returns the length" }, { id: "c", text: "Converts to string" }, { id: "d", text: "Sorts the list" }], correct: "b" },
  { id: "p9", text: "How do you start a for loop in Python?", options: [{ id: "a", text: "for (i=0; i<n; i++)" }, { id: "b", text: "for i in range(n):" }, { id: "c", text: "foreach i in n:" }, { id: "d", text: "loop i to n:" }], correct: "b" },
  { id: "p10", text: "Which data type is immutable in Python?", options: [{ id: "a", text: "list" }, { id: "b", text: "dict" }, { id: "c", text: "set" }, { id: "d", text: "tuple" }], correct: "d" },
  { id: "p11", text: "What is a dictionary in Python?", options: [{ id: "a", text: "An ordered list" }, { id: "b", text: "A key-value pair collection" }, { id: "c", text: "A type of loop" }, { id: "d", text: "A function" }], correct: "b" },
  { id: "p12", text: "How do you handle exceptions in Python?", options: [{ id: "a", text: "try/catch" }, { id: "b", text: "try/except" }, { id: "c", text: "if/else" }, { id: "d", text: "handle/error" }], correct: "b" },
  { id: "p13", text: "What does 'import' do in Python?", options: [{ id: "a", text: "Exports a module" }, { id: "b", text: "Includes a module" }, { id: "c", text: "Deletes a module" }, { id: "d", text: "Compiles a module" }], correct: "b" },
  { id: "p14", text: "Which operator is used for exponentiation in Python?", options: [{ id: "a", text: "^" }, { id: "b", text: "**" }, { id: "c", text: "exp()" }, { id: "d", text: "^^" }], correct: "b" },
  { id: "p15", text: "What is a lambda function?", options: [{ id: "a", text: "A named function" }, { id: "b", text: "An anonymous small function" }, { id: "c", text: "A class method" }, { id: "d", text: "A loop" }], correct: "b" },
  { id: "p16", text: "Which method removes whitespace from both ends of a string?", options: [{ id: "a", text: "trim()" }, { id: "b", text: "strip()" }, { id: "c", text: "clean()" }, { id: "d", text: "remove()" }], correct: "b" },
  { id: "p17", text: "What is the result of: bool(0)?", options: [{ id: "a", text: "True" }, { id: "b", text: "False" }, { id: "c", text: "0" }, { id: "d", text: "None" }], correct: "b" },
  { id: "p18", text: "How do you create a class in Python?", options: [{ id: "a", text: "class MyClass:" }, { id: "b", text: "create MyClass:" }, { id: "c", text: "new class MyClass" }, { id: "d", text: "define MyClass:" }], correct: "a" },
  { id: "p19", text: "What does 'self' refer to in a Python class?", options: [{ id: "a", text: "The class itself" }, { id: "b", text: "The current instance" }, { id: "c", text: "The parent class" }, { id: "d", text: "A global variable" }], correct: "b" },
  { id: "p20", text: "Which built-in function converts a string to an integer?", options: [{ id: "a", text: "str()" }, { id: "b", text: "float()" }, { id: "c", text: "int()" }, { id: "d", text: "num()" }], correct: "c" },
];

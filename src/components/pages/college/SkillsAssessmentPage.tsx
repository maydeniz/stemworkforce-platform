// ===========================================
// Skills Assessment Page - College Students
// Interactive skill assessments with real quizzes
// ===========================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  BarChart3,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Code,
  Database,
  Cloud,
  Shield,
  Brain,
  Users,
  BookOpen,
  Play,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  RotateCcw,
  Atom,
  Cpu,
  Zap,
  Dna,
  Factory,
  Info,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================
interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Assessment {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  color: string;
  description: string;
  duration: string;
  questions: Question[];
}

interface AssessmentResult {
  assessmentId: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  answers: number[];
}

// ===========================================
// ASSESSMENT DATA
// ===========================================
const ASSESSMENTS: Assessment[] = [
  {
    id: 'python',
    name: 'Python Programming',
    category: 'Programming',
    icon: Code,
    color: 'blue',
    description: 'Test your Python fundamentals including data structures, OOP, and common libraries.',
    duration: '10 min',
    questions: [
      {
        id: 'py1',
        text: 'What is the output of: print(type([]) == type({}))',
        options: ['True', 'False', 'TypeError', 'None'],
        correctIndex: 1,
        explanation: 'Lists [] and dictionaries {} are different types in Python. type([]) returns <class \'list\'> while type({}) returns <class \'dict\'>.',
      },
      {
        id: 'py2',
        text: 'Which method is used to add an element to the end of a list?',
        options: ['add()', 'append()', 'insert()', 'extend()'],
        correctIndex: 1,
        explanation: 'append() adds a single element to the end of a list. extend() adds multiple elements, insert() adds at a specific position.',
      },
      {
        id: 'py3',
        text: 'What does the __init__ method do in a Python class?',
        options: ['Destroys an object', 'Initializes object attributes', 'Imports modules', 'Defines class methods'],
        correctIndex: 1,
        explanation: '__init__ is the constructor method that initializes object attributes when an instance is created.',
      },
      {
        id: 'py4',
        text: 'What is a Python decorator?',
        options: ['A type of variable', 'A function that modifies another function', 'A loop structure', 'A class attribute'],
        correctIndex: 1,
        explanation: 'Decorators are functions that modify the behavior of other functions or methods, using the @decorator syntax.',
      },
      {
        id: 'py5',
        text: 'Which statement about Python lists is FALSE?',
        options: ['Lists are mutable', 'Lists can contain mixed types', 'Lists are hashable', 'Lists are ordered'],
        correctIndex: 2,
        explanation: 'Lists are NOT hashable because they are mutable. This means they cannot be used as dictionary keys.',
      },
      {
        id: 'py6',
        text: 'What does "self" refer to in a Python class method?',
        options: ['The class itself', 'The current instance', 'The parent class', 'The module'],
        correctIndex: 1,
        explanation: '"self" refers to the current instance of the class, allowing access to instance attributes and methods.',
      },
      {
        id: 'py7',
        text: 'Which library is commonly used for data manipulation in Python?',
        options: ['NumPy', 'Pandas', 'Matplotlib', 'All of the above'],
        correctIndex: 3,
        explanation: 'All three are commonly used: NumPy for numerical operations, Pandas for data manipulation, and Matplotlib for visualization.',
      },
      {
        id: 'py8',
        text: 'What is the difference between "==" and "is" in Python?',
        options: ['No difference', '"==" compares values, "is" compares identity', '"is" is faster', '"==" only works with numbers'],
        correctIndex: 1,
        explanation: '"==" checks if two objects have the same value, while "is" checks if they are the same object in memory.',
      },
    ],
  },
  {
    id: 'sql',
    name: 'SQL & Databases',
    category: 'Data',
    icon: Database,
    color: 'green',
    description: 'Evaluate your SQL skills including queries, joins, aggregations, and database design.',
    duration: '12 min',
    questions: [
      {
        id: 'sql1',
        text: 'Which SQL clause is used to filter groups?',
        options: ['WHERE', 'HAVING', 'FILTER', 'GROUP BY'],
        correctIndex: 1,
        explanation: 'HAVING filters groups after GROUP BY, while WHERE filters rows before grouping.',
      },
      {
        id: 'sql2',
        text: 'What type of JOIN returns all rows from both tables?',
        options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
        correctIndex: 3,
        explanation: 'FULL OUTER JOIN returns all rows from both tables, with NULL values where there\'s no match.',
      },
      {
        id: 'sql3',
        text: 'What does ACID stand for in database transactions?',
        options: ['Advanced, Consistent, Isolated, Durable', 'Atomicity, Consistency, Isolation, Durability', 'Automatic, Controlled, Independent, Direct', 'None of the above'],
        correctIndex: 1,
        explanation: 'ACID properties ensure reliable database transactions: Atomicity, Consistency, Isolation, and Durability.',
      },
      {
        id: 'sql4',
        text: 'Which statement is used to remove duplicate rows from results?',
        options: ['UNIQUE', 'DISTINCT', 'REMOVE DUPLICATES', 'SINGLE'],
        correctIndex: 1,
        explanation: 'SELECT DISTINCT removes duplicate rows from the result set.',
      },
      {
        id: 'sql5',
        text: 'What is a primary key?',
        options: ['Any column in a table', 'A unique identifier for each row', 'A foreign reference', 'An index'],
        correctIndex: 1,
        explanation: 'A primary key uniquely identifies each row in a table and cannot contain NULL values.',
      },
      {
        id: 'sql6',
        text: 'What does the COUNT(*) function do?',
        options: ['Counts only non-NULL values', 'Counts all rows including NULLs', 'Counts unique values', 'Returns the sum'],
        correctIndex: 1,
        explanation: 'COUNT(*) counts all rows in the result set, including rows with NULL values.',
      },
      {
        id: 'sql7',
        text: 'Which is the correct order of SQL clauses?',
        options: ['SELECT, WHERE, FROM, GROUP BY', 'SELECT, FROM, WHERE, GROUP BY', 'FROM, SELECT, WHERE, GROUP BY', 'SELECT, FROM, GROUP BY, WHERE'],
        correctIndex: 1,
        explanation: 'The correct order is: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY.',
      },
      {
        id: 'sql8',
        text: 'What is normalization in database design?',
        options: ['Making all tables the same size', 'Organizing data to reduce redundancy', 'Adding indexes', 'Encrypting data'],
        correctIndex: 1,
        explanation: 'Normalization organizes data to minimize redundancy and dependency by dividing tables and defining relationships.',
      },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud Computing (AWS)',
    category: 'Infrastructure',
    icon: Cloud,
    color: 'orange',
    description: 'Assess your knowledge of cloud services, architecture, and AWS fundamentals.',
    duration: '10 min',
    questions: [
      {
        id: 'aws1',
        text: 'What is AWS EC2?',
        options: ['A database service', 'A virtual server service', 'A storage service', 'A networking service'],
        correctIndex: 1,
        explanation: 'EC2 (Elastic Compute Cloud) provides resizable virtual servers in the cloud.',
      },
      {
        id: 'aws2',
        text: 'Which AWS service is used for object storage?',
        options: ['EBS', 'S3', 'EFS', 'Glacier'],
        correctIndex: 1,
        explanation: 'S3 (Simple Storage Service) is AWS\'s object storage service for storing and retrieving data.',
      },
      {
        id: 'aws3',
        text: 'What does "serverless" mean in cloud computing?',
        options: ['No servers exist', 'You don\'t manage servers', 'Free computing', 'Local computing'],
        correctIndex: 1,
        explanation: 'Serverless means the cloud provider manages servers; you just deploy code without managing infrastructure.',
      },
      {
        id: 'aws4',
        text: 'Which service would you use for a managed relational database?',
        options: ['DynamoDB', 'RDS', 'ElastiCache', 'Redshift'],
        correctIndex: 1,
        explanation: 'RDS (Relational Database Service) provides managed relational databases like MySQL, PostgreSQL, etc.',
      },
      {
        id: 'aws5',
        text: 'What is an AWS Region?',
        options: ['A building', 'A geographic area with multiple data centers', 'A type of server', 'A pricing tier'],
        correctIndex: 1,
        explanation: 'A Region is a geographic area containing multiple isolated Availability Zones.',
      },
      {
        id: 'aws6',
        text: 'What is the purpose of an IAM role?',
        options: ['Store data', 'Grant permissions to AWS services', 'Monitor costs', 'Create backups'],
        correctIndex: 1,
        explanation: 'IAM roles grant permissions to AWS services and resources without using permanent credentials.',
      },
      {
        id: 'aws7',
        text: 'Which AWS service is used for content delivery (CDN)?',
        options: ['Route 53', 'CloudFront', 'API Gateway', 'Direct Connect'],
        correctIndex: 1,
        explanation: 'CloudFront is AWS\'s Content Delivery Network for distributing content globally with low latency.',
      },
      {
        id: 'aws8',
        text: 'What is auto-scaling?',
        options: ['Manually adding servers', 'Automatically adjusting resources based on demand', 'A type of database', 'A security feature'],
        correctIndex: 1,
        explanation: 'Auto-scaling automatically adjusts compute resources based on traffic and workload demands.',
      },
    ],
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    category: 'AI/ML',
    icon: Brain,
    color: 'purple',
    description: 'Test your understanding of ML concepts, algorithms, and best practices.',
    duration: '12 min',
    questions: [
      {
        id: 'ml1',
        text: 'What is supervised learning?',
        options: ['Learning without labels', 'Learning with labeled data', 'Learning by trial and error', 'Unsupervised clustering'],
        correctIndex: 1,
        explanation: 'Supervised learning uses labeled training data where inputs are mapped to known outputs.',
      },
      {
        id: 'ml2',
        text: 'What is overfitting?',
        options: ['Model performs well on all data', 'Model memorizes training data but fails on new data', 'Model is too simple', 'Model trains too fast'],
        correctIndex: 1,
        explanation: 'Overfitting occurs when a model learns training data too well, including noise, and fails to generalize.',
      },
      {
        id: 'ml3',
        text: 'Which metric is best for imbalanced classification?',
        options: ['Accuracy', 'F1 Score', 'MSE', 'R-squared'],
        correctIndex: 1,
        explanation: 'F1 Score balances precision and recall, making it better for imbalanced datasets than accuracy.',
      },
      {
        id: 'ml4',
        text: 'What is the purpose of cross-validation?',
        options: ['Speed up training', 'Evaluate model on unseen data', 'Reduce dataset size', 'Add more features'],
        correctIndex: 1,
        explanation: 'Cross-validation evaluates model performance by training on different subsets and testing on held-out data.',
      },
      {
        id: 'ml5',
        text: 'What is gradient descent used for?',
        options: ['Feature selection', 'Optimizing model parameters', 'Data cleaning', 'Visualization'],
        correctIndex: 1,
        explanation: 'Gradient descent iteratively adjusts model parameters to minimize the loss function.',
      },
      {
        id: 'ml6',
        text: 'What is a neural network activation function?',
        options: ['Starts the network', 'Introduces non-linearity', 'Stops training', 'Saves the model'],
        correctIndex: 1,
        explanation: 'Activation functions introduce non-linearity, allowing neural networks to learn complex patterns.',
      },
      {
        id: 'ml7',
        text: 'What is the difference between classification and regression?',
        options: ['No difference', 'Classification predicts categories, regression predicts continuous values', 'Regression is faster', 'Classification uses more data'],
        correctIndex: 1,
        explanation: 'Classification predicts discrete labels/categories, while regression predicts continuous numerical values.',
      },
      {
        id: 'ml8',
        text: 'What is feature engineering?',
        options: ['Building new software', 'Creating new input variables from existing data', 'Removing features', 'Training the model'],
        correctIndex: 1,
        explanation: 'Feature engineering creates new input variables from existing data to improve model performance.',
      },
    ],
  },
  {
    id: 'security',
    name: 'Cybersecurity Basics',
    category: 'Security',
    icon: Shield,
    color: 'red',
    description: 'Evaluate your knowledge of security fundamentals, threats, and best practices.',
    duration: '10 min',
    questions: [
      {
        id: 'sec1',
        text: 'What is the CIA triad in security?',
        options: ['A spy agency', 'Confidentiality, Integrity, Availability', 'Central Intelligence Access', 'Computer Information Architecture'],
        correctIndex: 1,
        explanation: 'The CIA triad represents the three core principles of information security: Confidentiality, Integrity, and Availability.',
      },
      {
        id: 'sec2',
        text: 'What is SQL injection?',
        options: ['A database feature', 'An attack that inserts malicious SQL code', 'A backup method', 'A type of query'],
        correctIndex: 1,
        explanation: 'SQL injection is an attack where malicious SQL code is inserted into application queries to manipulate databases.',
      },
      {
        id: 'sec3',
        text: 'What is phishing?',
        options: ['A fishing technique', 'Fraudulent attempt to obtain sensitive information', 'Network scanning', 'Password cracking'],
        correctIndex: 1,
        explanation: 'Phishing is a social engineering attack that tricks users into revealing sensitive information through fake communications.',
      },
      {
        id: 'sec4',
        text: 'What does HTTPS provide that HTTP does not?',
        options: ['Faster speed', 'Encryption', 'Better SEO', 'More bandwidth'],
        correctIndex: 1,
        explanation: 'HTTPS encrypts data in transit using TLS/SSL, protecting it from interception and tampering.',
      },
      {
        id: 'sec5',
        text: 'What is two-factor authentication (2FA)?',
        options: ['Using two passwords', 'Using two different verification methods', 'Logging in twice', 'Having two accounts'],
        correctIndex: 1,
        explanation: '2FA requires two different types of verification (e.g., password + phone code) for added security.',
      },
      {
        id: 'sec6',
        text: 'What is a firewall?',
        options: ['Antivirus software', 'A network security device that monitors traffic', 'An encryption tool', 'A password manager'],
        correctIndex: 1,
        explanation: 'A firewall monitors and controls incoming/outgoing network traffic based on security rules.',
      },
      {
        id: 'sec7',
        text: 'What is XSS (Cross-Site Scripting)?',
        options: ['A programming language', 'An attack that injects malicious scripts into web pages', 'A CSS framework', 'A testing tool'],
        correctIndex: 1,
        explanation: 'XSS attacks inject malicious scripts into web pages viewed by other users to steal data or hijack sessions.',
      },
      {
        id: 'sec8',
        text: 'What is the principle of least privilege?',
        options: ['Giving everyone admin access', 'Users should only have minimum necessary permissions', 'Removing all permissions', 'A type of encryption'],
        correctIndex: 1,
        explanation: 'Least privilege means users should only have the minimum permissions needed to perform their job.',
      },
    ],
  },
  {
    id: 'softskills',
    name: 'Professional Soft Skills',
    category: 'Soft Skills',
    icon: Users,
    color: 'teal',
    description: 'Assess your communication, teamwork, and problem-solving abilities.',
    duration: '8 min',
    questions: [
      {
        id: 'soft1',
        text: 'When receiving critical feedback, the best response is to:',
        options: ['Defend yourself immediately', 'Listen, ask clarifying questions, and thank them', 'Ignore it', 'Criticize them back'],
        correctIndex: 1,
        explanation: 'Active listening and asking questions shows maturity and helps you learn from feedback.',
      },
      {
        id: 'soft2',
        text: 'In a team disagreement about a technical approach, you should:',
        options: ['Insist your way is best', 'Go with the majority opinion', 'Discuss pros/cons objectively and seek consensus', 'Escalate to management immediately'],
        correctIndex: 2,
        explanation: 'Objective discussion of trade-offs leads to better decisions and maintains team relationships.',
      },
      {
        id: 'soft3',
        text: 'When you realize you won\'t meet a deadline, you should:',
        options: ['Work silently and hope to finish', 'Communicate early with stakeholders', 'Blame external factors', 'Submit incomplete work on time'],
        correctIndex: 1,
        explanation: 'Early communication allows for adjustments and demonstrates professionalism and accountability.',
      },
      {
        id: 'soft4',
        text: 'The most effective way to explain a complex technical concept to non-technical stakeholders is:',
        options: ['Use all technical terminology', 'Use analogies and simple language', 'Tell them it\'s too complex to explain', 'Skip the explanation'],
        correctIndex: 1,
        explanation: 'Analogies and simple language make complex concepts accessible without oversimplifying.',
      },
      {
        id: 'soft5',
        text: 'When starting a new project, prioritizing tasks should be based on:',
        options: ['What\'s easiest first', 'Business impact and dependencies', 'Personal preference', 'Random order'],
        correctIndex: 1,
        explanation: 'Prioritizing by impact and dependencies ensures the most valuable work is done efficiently.',
      },
      {
        id: 'soft6',
        text: 'If you notice a teammate struggling, you should:',
        options: ['Ignore it - not your problem', 'Offer help privately without embarrassing them', 'Report them to the manager', 'Do their work for them'],
        correctIndex: 1,
        explanation: 'Offering private support builds trust and helps the team succeed without creating awkwardness.',
      },
    ],
  },
  {
    id: 'quantum',
    name: 'Quantum Technologies',
    category: 'Emerging Tech',
    icon: Atom,
    color: 'indigo',
    description: 'Assess your understanding of quantum computing, quantum mechanics principles, and quantum applications.',
    duration: '12 min',
    questions: [
      {
        id: 'qt1',
        text: 'What is a qubit?',
        options: ['A classical bit with two states', 'A quantum bit that can exist in superposition', 'A type of quantum gate', 'A measurement device'],
        correctIndex: 1,
        explanation: 'A qubit (quantum bit) is the fundamental unit of quantum information. Unlike classical bits, qubits can exist in superposition of both 0 and 1 states simultaneously.',
      },
      {
        id: 'qt2',
        text: 'What is quantum superposition?',
        options: ['When two qubits are connected', 'A qubit existing in multiple states simultaneously', 'The speed of quantum computation', 'Error correction in quantum systems'],
        correctIndex: 1,
        explanation: 'Superposition is a quantum mechanical principle where a quantum system can exist in multiple states at the same time until it is measured.',
      },
      {
        id: 'qt3',
        text: 'What is quantum entanglement?',
        options: ['Physical connection between qubits', 'Correlation between qubits regardless of distance', 'A type of quantum error', 'Quantum memory storage'],
        correctIndex: 1,
        explanation: 'Quantum entanglement is a phenomenon where two or more particles become correlated such that the quantum state of each particle cannot be described independently, regardless of the distance separating them.',
      },
      {
        id: 'qt4',
        text: 'Which algorithm demonstrates quantum advantage for factoring large numbers?',
        options: ['Grover\'s algorithm', 'Shor\'s algorithm', 'Dijkstra\'s algorithm', 'RSA algorithm'],
        correctIndex: 1,
        explanation: 'Shor\'s algorithm can factor large integers exponentially faster than the best known classical algorithms, posing a threat to RSA encryption.',
      },
      {
        id: 'qt5',
        text: 'What is quantum decoherence?',
        options: ['Strengthening of quantum states', 'Loss of quantum properties due to environmental interaction', 'Faster quantum computation', 'Quantum state initialization'],
        correctIndex: 1,
        explanation: 'Decoherence occurs when a quantum system loses its quantum properties through interaction with the environment, causing qubits to lose their superposition and entanglement.',
      },
      {
        id: 'qt6',
        text: 'What is a quantum gate?',
        options: ['Physical barrier for qubits', 'Basic operation that manipulates qubits', 'Measurement device', 'Quantum storage unit'],
        correctIndex: 1,
        explanation: 'Quantum gates are the building blocks of quantum circuits, performing operations on qubits similar to how logic gates operate on classical bits.',
      },
      {
        id: 'qt7',
        text: 'What does NISQ stand for in quantum computing?',
        options: ['National Institute of Scientific Quantum', 'Noisy Intermediate-Scale Quantum', 'Next-generation Integrated Superconducting Qubits', 'Non-classical Information System Quantum'],
        correctIndex: 1,
        explanation: 'NISQ (Noisy Intermediate-Scale Quantum) refers to current quantum computers with 50-1000 qubits that are prone to errors and lack full error correction.',
      },
      {
        id: 'qt8',
        text: 'Which technology is commonly used to create superconducting qubits?',
        options: ['Room temperature semiconductors', 'Josephson junctions cooled to near absolute zero', 'Standard silicon transistors', 'Optical fibers'],
        correctIndex: 1,
        explanation: 'Superconducting qubits typically use Josephson junctions and must be cooled to temperatures near absolute zero (around 15 millikelvin) to maintain quantum properties.',
      },
    ],
  },
  {
    id: 'robotics',
    name: 'Robotics & Automation',
    category: 'Engineering',
    icon: Cpu,
    color: 'cyan',
    description: 'Test your knowledge of robotics fundamentals, control systems, and industrial automation.',
    duration: '12 min',
    questions: [
      {
        id: 'rob1',
        text: 'What are the three laws of robotics proposed by Isaac Asimov?',
        options: ['Speed, accuracy, efficiency', 'Protect humans, obey orders, self-preserve (in that priority)', 'Sense, plan, act', 'Input, process, output'],
        correctIndex: 1,
        explanation: 'Asimov\'s Three Laws prioritize: 1) A robot may not harm humans, 2) Must obey human orders, 3) Must protect its own existence—each subordinate to the preceding law.',
      },
      {
        id: 'rob2',
        text: 'What is a degree of freedom (DOF) in robotics?',
        options: ['Robot\'s intelligence level', 'Number of independent motion parameters', 'Power consumption rating', 'Maximum payload capacity'],
        correctIndex: 1,
        explanation: 'Degrees of freedom represent the number of independent parameters that define a robot\'s configuration. A typical industrial robot arm has 6 DOF for full spatial manipulation.',
      },
      {
        id: 'rob3',
        text: 'What is inverse kinematics used for in robotics?',
        options: ['Measuring robot speed', 'Calculating joint angles to reach a target position', 'Determining energy consumption', 'Programming the robot'],
        correctIndex: 1,
        explanation: 'Inverse kinematics calculates the joint parameters needed to place the end-effector at a desired position and orientation in space.',
      },
      {
        id: 'rob4',
        text: 'What is a PID controller commonly used for in robotics?',
        options: ['Power management', 'Precise motion control through feedback', 'Image processing', 'Network communication'],
        correctIndex: 1,
        explanation: 'PID (Proportional-Integral-Derivative) controllers use feedback to continuously adjust motor outputs for precise position, velocity, or force control.',
      },
      {
        id: 'rob5',
        text: 'What is SLAM in autonomous robotics?',
        options: ['Speed Limiting Automatic Mode', 'Simultaneous Localization and Mapping', 'System Load Analysis Method', 'Sensor Linear Adjustment Module'],
        correctIndex: 1,
        explanation: 'SLAM enables robots to build a map of an unknown environment while simultaneously tracking their location within it, essential for autonomous navigation.',
      },
      {
        id: 'rob6',
        text: 'What type of sensor is commonly used for proximity detection in robots?',
        options: ['Thermometer', 'LiDAR or ultrasonic sensors', 'Barometer', 'Gyroscope'],
        correctIndex: 1,
        explanation: 'LiDAR uses laser light and ultrasonic sensors use sound waves to detect distances to objects, making them ideal for proximity detection and obstacle avoidance.',
      },
      {
        id: 'rob7',
        text: 'What is an end-effector in robotics?',
        options: ['The robot\'s power supply', 'The tool or gripper at the end of a robot arm', 'The control computer', 'The base of the robot'],
        correctIndex: 1,
        explanation: 'The end-effector is the device at the end of a robotic arm designed to interact with the environment—examples include grippers, welding torches, and spray guns.',
      },
      {
        id: 'rob8',
        text: 'What is a cobot (collaborative robot)?',
        options: ['A robot that works in space', 'A robot designed to safely work alongside humans', 'A computer that controls robots', 'A robot made of multiple units'],
        correctIndex: 1,
        explanation: 'Cobots are designed with safety features like force limiting and collision detection, allowing them to work directly alongside human workers without safety cages.',
      },
    ],
  },
  {
    id: 'nuclear',
    name: 'Nuclear Science',
    category: 'Energy',
    icon: Zap,
    color: 'yellow',
    description: 'Evaluate your understanding of nuclear physics, reactor technology, and radiation safety.',
    duration: '12 min',
    questions: [
      {
        id: 'nuc1',
        text: 'What is nuclear fission?',
        options: ['Combining light nuclei', 'Splitting heavy nuclei into lighter ones', 'Electron emission', 'Neutron decay'],
        correctIndex: 1,
        explanation: 'Nuclear fission is the process where a heavy nucleus (like uranium-235) splits into smaller nuclei, releasing a large amount of energy and additional neutrons.',
      },
      {
        id: 'nuc2',
        text: 'What is the purpose of control rods in a nuclear reactor?',
        options: ['Generate electricity', 'Absorb neutrons to regulate the chain reaction', 'Cool the reactor', 'Contain radiation'],
        correctIndex: 1,
        explanation: 'Control rods, typically made of neutron-absorbing materials like boron or cadmium, regulate the fission rate by absorbing excess neutrons.',
      },
      {
        id: 'nuc3',
        text: 'What is the half-life of a radioactive isotope?',
        options: ['When it becomes stable', 'Time for half the atoms to decay', 'Its maximum radiation level', 'Time to reach critical mass'],
        correctIndex: 1,
        explanation: 'Half-life is the time required for half of the radioactive atoms in a sample to undergo decay. Each isotope has a characteristic half-life.',
      },
      {
        id: 'nuc4',
        text: 'What is the difference between alpha, beta, and gamma radiation?',
        options: ['They are the same', 'Alpha=helium nuclei, Beta=electrons, Gamma=photons', 'They differ only in color', 'They vary only in speed'],
        correctIndex: 1,
        explanation: 'Alpha particles are helium nuclei (2 protons, 2 neutrons), beta particles are electrons or positrons, and gamma rays are high-energy electromagnetic photons.',
      },
      {
        id: 'nuc5',
        text: 'What does the unit "rem" or "Sievert" measure?',
        options: ['Reactor power output', 'Biological effect of radiation dose on tissue', 'Nuclear fuel efficiency', 'Neutron flux'],
        correctIndex: 1,
        explanation: 'Rem (Roentgen equivalent man) and Sievert measure the biological effect of ionizing radiation, accounting for both the energy absorbed and the type of radiation.',
      },
      {
        id: 'nuc6',
        text: 'What fuel is used in most commercial nuclear power plants?',
        options: ['Plutonium-238', 'Enriched uranium (U-235)', 'Thorium-232', 'Hydrogen isotopes'],
        correctIndex: 1,
        explanation: 'Most commercial reactors use uranium enriched to 3-5% U-235. Natural uranium contains only 0.7% U-235, requiring enrichment for reactor use.',
      },
      {
        id: 'nuc7',
        text: 'What is nuclear fusion?',
        options: ['Splitting atoms apart', 'Combining light nuclei to form heavier ones', 'Radioactive decay', 'Neutron capture'],
        correctIndex: 1,
        explanation: 'Nuclear fusion combines light nuclei (like hydrogen isotopes) to form heavier nuclei, releasing enormous energy. This powers the sun and is the goal of fusion research.',
      },
      {
        id: 'nuc8',
        text: 'What is the ALARA principle in radiation safety?',
        options: ['Always Lock All Radioactive Areas', 'As Low As Reasonably Achievable', 'Automatic Level Adjustment for Radiation Assessment', 'Advanced Linear Absorption Rate Analysis'],
        correctIndex: 1,
        explanation: 'ALARA (As Low As Reasonably Achievable) is a radiation safety principle that aims to minimize radiation exposure through time, distance, and shielding considerations.',
      },
    ],
  },
  {
    id: 'biotech',
    name: 'Biotechnology',
    category: 'Life Sciences',
    icon: Dna,
    color: 'emerald',
    description: 'Assess your knowledge of genetic engineering, molecular biology, and biotech applications.',
    duration: '12 min',
    questions: [
      {
        id: 'bio1',
        text: 'What is CRISPR-Cas9?',
        options: ['A type of microscope', 'A gene editing tool using guide RNA and an enzyme', 'A protein synthesis method', 'A cell culture technique'],
        correctIndex: 1,
        explanation: 'CRISPR-Cas9 is a revolutionary gene-editing technology that uses guide RNA to direct the Cas9 enzyme to specific DNA sequences for precise cutting and modification.',
      },
      {
        id: 'bio2',
        text: 'What is PCR (Polymerase Chain Reaction) used for?',
        options: ['Protein synthesis', 'Amplifying specific DNA sequences', 'Cell division', 'RNA transcription'],
        correctIndex: 1,
        explanation: 'PCR exponentially amplifies specific DNA segments using thermal cycling and DNA polymerase, enabling analysis of tiny DNA samples.',
      },
      {
        id: 'bio3',
        text: 'What is a plasmid in genetic engineering?',
        options: ['A type of virus', 'A small circular DNA used as a vector', 'A cell membrane protein', 'An enzyme'],
        correctIndex: 1,
        explanation: 'Plasmids are small, circular DNA molecules that replicate independently. They\'re commonly used as vectors to introduce foreign genes into bacteria.',
      },
      {
        id: 'bio4',
        text: 'What does recombinant DNA technology allow scientists to do?',
        options: ['Clone entire organisms', 'Combine DNA from different sources', 'Destroy harmful bacteria', 'Visualize cells'],
        correctIndex: 1,
        explanation: 'Recombinant DNA technology combines DNA sequences from different organisms, enabling production of insulin, vaccines, and genetically modified organisms.',
      },
      {
        id: 'bio5',
        text: 'What is gel electrophoresis used for?',
        options: ['Growing cells', 'Separating DNA fragments by size', 'Measuring temperature', 'Sterilizing equipment'],
        correctIndex: 1,
        explanation: 'Gel electrophoresis separates DNA, RNA, or proteins by size using an electric field. Smaller molecules move faster through the gel matrix.',
      },
      {
        id: 'bio6',
        text: 'What are stem cells?',
        options: ['Dead cells used for research', 'Undifferentiated cells that can develop into various cell types', 'Plant root cells', 'Bacteria used in fermentation'],
        correctIndex: 1,
        explanation: 'Stem cells are unspecialized cells capable of self-renewal and differentiation into specialized cell types, making them valuable for regenerative medicine.',
      },
      {
        id: 'bio7',
        text: 'What is the central dogma of molecular biology?',
        options: ['All cells are identical', 'DNA → RNA → Protein', 'Proteins create DNA', 'RNA cannot be modified'],
        correctIndex: 1,
        explanation: 'The central dogma describes the flow of genetic information: DNA is transcribed to RNA, which is translated to protein. This is fundamental to all life.',
      },
      {
        id: 'bio8',
        text: 'What is bioinformatics?',
        options: ['Marketing of biotech products', 'Using computational tools to analyze biological data', 'Growing bacteria in computers', 'Biological information security'],
        correctIndex: 1,
        explanation: 'Bioinformatics applies computational methods to analyze biological data, including genomics, proteomics, and drug discovery through algorithms and databases.',
      },
    ],
  },
  {
    id: 'manufacturing',
    name: 'Advanced Manufacturing',
    category: 'Industry 4.0',
    icon: Factory,
    color: 'slate',
    description: 'Test your knowledge of modern manufacturing technologies, Industry 4.0, and process optimization.',
    duration: '12 min',
    questions: [
      {
        id: 'mfg1',
        text: 'What is additive manufacturing commonly known as?',
        options: ['CNC machining', '3D printing', 'Injection molding', 'Casting'],
        correctIndex: 1,
        explanation: 'Additive manufacturing (3D printing) builds objects layer by layer from digital models, as opposed to subtractive methods that remove material.',
      },
      {
        id: 'mfg2',
        text: 'What does Industry 4.0 refer to?',
        options: ['The fourth industrial company', 'The integration of digital technologies in manufacturing', 'A quality standard', 'Factory floor layout'],
        correctIndex: 1,
        explanation: 'Industry 4.0 represents the fourth industrial revolution, characterized by IoT, AI, cloud computing, and cyber-physical systems integration in manufacturing.',
      },
      {
        id: 'mfg3',
        text: 'What is a digital twin in manufacturing?',
        options: ['Two identical products', 'A virtual replica of a physical system', 'Duplicate factory', 'Backup data storage'],
        correctIndex: 1,
        explanation: 'A digital twin is a virtual model of a physical product, process, or system that enables simulation, monitoring, and optimization in real-time.',
      },
      {
        id: 'mfg4',
        text: 'What is lean manufacturing focused on?',
        options: ['Increasing inventory', 'Eliminating waste and maximizing value', 'Reducing worker involvement', 'Maximizing production speed only'],
        correctIndex: 1,
        explanation: 'Lean manufacturing aims to eliminate waste (muda) in all forms—defects, overproduction, waiting, transportation, inventory, motion, and over-processing.',
      },
      {
        id: 'mfg5',
        text: 'What does Six Sigma methodology aim to achieve?',
        options: ['Six production lines', 'Near-perfect quality with minimal defects', 'Six-day work weeks', 'Maximum speed'],
        correctIndex: 1,
        explanation: 'Six Sigma uses data-driven methods to reduce process variation and defects to 3.4 per million opportunities, achieving near-perfect quality.',
      },
      {
        id: 'mfg6',
        text: 'What is CNC in manufacturing?',
        options: ['Computer Numerical Control', 'Central Network Connection', 'Continuous Numerical Calculation', 'Custom Node Configuration'],
        correctIndex: 0,
        explanation: 'CNC (Computer Numerical Control) uses pre-programmed software to control machine tools like lathes, mills, and routers for precise automated manufacturing.',
      },
      {
        id: 'mfg7',
        text: 'What is predictive maintenance?',
        options: ['Maintenance on a fixed schedule', 'Using data to predict equipment failures before they occur', 'Replacing all parts regularly', 'Manual inspection only'],
        correctIndex: 1,
        explanation: 'Predictive maintenance uses sensors, IoT, and machine learning to analyze equipment data and predict failures, reducing downtime and maintenance costs.',
      },
      {
        id: 'mfg8',
        text: 'What materials can be used in metal additive manufacturing?',
        options: ['Only plastic filaments', 'Titanium, aluminum, steel, and other metal powders', 'Only precious metals', 'Ceramics only'],
        correctIndex: 1,
        explanation: 'Metal additive manufacturing uses powdered metals including titanium, aluminum alloys, stainless steel, Inconel, and others, melted by lasers or electron beams.',
      },
    ],
  },
];

const SKILL_LEVELS = [
  { min: 0, max: 25, label: 'Beginner', color: 'red' },
  { min: 26, max: 50, label: 'Elementary', color: 'orange' },
  { min: 51, max: 75, label: 'Intermediate', color: 'yellow' },
  { min: 76, max: 90, label: 'Advanced', color: 'green' },
  { min: 91, max: 100, label: 'Expert', color: 'blue' },
];

// ===========================================
// COMPONENT
// ===========================================
const SkillsAssessmentPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'browse' | 'quiz' | 'results'>('browse');
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedResults, setCompletedResults] = useState<AssessmentResult[]>([]);

  const startAssessment = (assessment: Assessment) => {
    setCurrentAssessment(assessment);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowExplanation(false);
    setActiveView('quiz');
  };

  const selectAnswer = (answerIndex: number) => {
    if (showExplanation) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (!currentAssessment) return;

    if (currentQuestionIndex < currentAssessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      // Quiz complete - calculate results
      const correctCount = selectedAnswers.filter(
        (answer, index) => answer === currentAssessment.questions[index].correctIndex
      ).length;

      const result: AssessmentResult = {
        assessmentId: currentAssessment.id,
        score: Math.round((correctCount / currentAssessment.questions.length) * 100),
        totalQuestions: currentAssessment.questions.length,
        completedAt: new Date(),
        answers: selectedAnswers,
      };

      setCompletedResults([...completedResults.filter(r => r.assessmentId !== currentAssessment.id), result]);
      setActiveView('results');
    }
  };

  const getSkillLevel = (score: number) => {
    return SKILL_LEVELS.find(level => score >= level.min && score <= level.max) || SKILL_LEVELS[0];
  };

  const getResultForAssessment = (assessmentId: string) => {
    return completedResults.find(r => r.assessmentId === assessmentId);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-gray-950 to-amber-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 text-orange-400 mb-4">
            <Link to="/college/professional-development" className="hover:underline">Professional Development</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Skills Assessment</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Skills
              <span className="text-orange-400"> Assessment</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Take interactive assessments to evaluate your technical and soft skills.
              Get instant feedback and personalized learning recommendations.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Target className="w-5 h-5 text-orange-400" />
                <span>{ASSESSMENTS.length} Assessments Available</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-5 h-5 text-orange-400" />
                <span>8-12 minutes each</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Award className="w-5 h-5 text-orange-400" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Disclaimer Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-amber-200 font-medium">Important Disclaimer</p>
              <p className="text-amber-200/80 mt-1">
                These assessments are <strong>AI-generated educational tools for self-awareness purposes only</strong>.
                Results do not constitute professional certification, qualification, or endorsement of competency.
                They are designed to help you identify areas for learning and should not be used for employment
                verification or credential claims. For official certifications, please pursue accredited programs
                in your field of interest.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Browse Assessments */}
        {activeView === 'browse' && (
          <>
            {/* Progress Summary */}
            {completedResults.length > 0 && (
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 mb-8">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                  Your Progress
                </h2>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">{completedResults.length}</div>
                    <div className="text-sm text-gray-400">Assessments Completed</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">
                      {Math.round(completedResults.reduce((sum, r) => sum + r.score, 0) / completedResults.length)}%
                    </div>
                    <div className="text-sm text-gray-400">Average Score</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-400">
                      {completedResults.filter(r => r.score >= 75).length}
                    </div>
                    <div className="text-sm text-gray-400">Proficient Skills</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-400">
                      {ASSESSMENTS.length - completedResults.length}
                    </div>
                    <div className="text-sm text-gray-400">Remaining</div>
                  </div>
                </div>
              </div>
            )}

            {/* Assessment Grid */}
            <h2 className="text-2xl font-bold text-white mb-6">Available Assessments</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ASSESSMENTS.map(assessment => {
                const result = getResultForAssessment(assessment.id);
                const skillLevel = result ? getSkillLevel(result.score) : null;

                return (
                  <div
                    key={assessment.id}
                    className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-${assessment.color}-500/10 flex items-center justify-center`}>
                        <assessment.icon className={`w-6 h-6 text-${assessment.color}-400`} />
                      </div>
                      {result && (
                        <div className={`px-3 py-1 rounded-full text-sm font-medium bg-${skillLevel?.color}-500/10 text-${skillLevel?.color}-400`}>
                          {skillLevel?.label}
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-1">{assessment.name}</h3>
                    <span className="text-sm text-gray-500 mb-3 block">{assessment.category}</span>
                    <p className="text-gray-400 text-sm mb-4">{assessment.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {assessment.duration}
                      </span>
                      <span>{assessment.questions.length} questions</span>
                    </div>

                    {result && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Your Score</span>
                          <span className={`text-${skillLevel?.color}-400 font-medium`}>{result.score}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-${skillLevel?.color}-500 rounded-full transition-all`}
                            style={{ width: `${result.score}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => startAssessment(assessment)}
                      className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                        result
                          ? 'bg-gray-800 hover:bg-gray-700 text-white'
                          : 'bg-orange-600 hover:bg-orange-500 text-white'
                      }`}
                    >
                      {result ? (
                        <>
                          <RotateCcw className="w-4 h-4" />
                          Retake Assessment
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Start Assessment
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Quiz View */}
        {activeView === 'quiz' && currentAssessment && (
          <div className="max-w-3xl mx-auto">
            {/* Progress Header */}
            <div className="mb-8">
              <button
                onClick={() => setActiveView('browse')}
                className="text-gray-400 hover:text-white flex items-center gap-1 mb-4"
              >
                <ChevronLeft className="w-4 h-4" />
                Exit Assessment
              </button>

              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-white">{currentAssessment.name}</h2>
                <span className="text-gray-400">
                  Question {currentQuestionIndex + 1} of {currentAssessment.questions.length}
                </span>
              </div>

              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all"
                  style={{ width: `${((currentQuestionIndex + 1) / currentAssessment.questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8">
              <h3 className="text-xl text-white mb-6">
                {currentAssessment.questions[currentQuestionIndex].text}
              </h3>

              <div className="space-y-3">
                {currentAssessment.questions[currentQuestionIndex].options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === index;
                  const isCorrect = index === currentAssessment.questions[currentQuestionIndex].correctIndex;
                  const showResult = showExplanation;

                  return (
                    <button
                      key={index}
                      onClick={() => selectAnswer(index)}
                      disabled={showExplanation}
                      className={`w-full p-4 rounded-lg text-left transition-all flex items-center justify-between ${
                        showResult
                          ? isCorrect
                            ? 'bg-green-500/10 border-2 border-green-500 text-white'
                            : isSelected
                              ? 'bg-red-500/10 border-2 border-red-500 text-white'
                              : 'bg-gray-800/50 border border-gray-700 text-gray-400'
                          : isSelected
                            ? 'bg-orange-500/10 border-2 border-orange-500 text-white'
                            : 'bg-gray-800/50 border border-gray-700 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <span>{option}</span>
                      {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className={`mt-6 p-4 rounded-lg ${
                  selectedAnswers[currentQuestionIndex] === currentAssessment.questions[currentQuestionIndex].correctIndex
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-orange-500/10 border border-orange-500/30'
                }`}>
                  <div className="flex items-start gap-3">
                    {selectedAnswers[currentQuestionIndex] === currentAssessment.questions[currentQuestionIndex].correctIndex ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className={`font-medium mb-1 ${
                        selectedAnswers[currentQuestionIndex] === currentAssessment.questions[currentQuestionIndex].correctIndex
                          ? 'text-green-400'
                          : 'text-orange-400'
                      }`}>
                        {selectedAnswers[currentQuestionIndex] === currentAssessment.questions[currentQuestionIndex].correctIndex
                          ? 'Correct!'
                          : 'Not quite right'}
                      </h4>
                      <p className="text-gray-300 text-sm">
                        {currentAssessment.questions[currentQuestionIndex].explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Button */}
              {showExplanation && (
                <button
                  onClick={nextQuestion}
                  className="mt-6 w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {currentQuestionIndex < currentAssessment.questions.length - 1 ? (
                    <>
                      Next Question
                      <ChevronRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      View Results
                      <Award className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results View */}
        {activeView === 'results' && currentAssessment && (
          <div className="max-w-3xl mx-auto">
            {(() => {
              const result = completedResults.find(r => r.assessmentId === currentAssessment.id);
              const skillLevel = result ? getSkillLevel(result.score) : null;
              const correctCount = result ? result.answers.filter(
                (answer, index) => answer === currentAssessment.questions[index].correctIndex
              ).length : 0;

              return (
                <>
                  {/* Score Card */}
                  <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 text-center mb-8">
                    <div className={`w-24 h-24 mx-auto rounded-full bg-${skillLevel?.color}-500/10 flex items-center justify-center mb-6`}>
                      <Award className={`w-12 h-12 text-${skillLevel?.color}-400`} />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">Assessment Complete!</h2>
                    <p className="text-gray-400 mb-6">{currentAssessment.name}</p>

                    <div className={`text-6xl font-bold text-${skillLevel?.color}-400 mb-2`}>
                      {result?.score}%
                    </div>
                    <div className={`text-xl text-${skillLevel?.color}-400 mb-4`}>
                      {skillLevel?.label} Level
                    </div>

                    <div className="text-gray-400">
                      You got {correctCount} out of {currentAssessment.questions.length} questions correct
                    </div>
                  </div>

                  {/* Question Review */}
                  <h3 className="text-xl font-semibold text-white mb-4">Question Review</h3>
                  <div className="space-y-4 mb-8">
                    {currentAssessment.questions.map((question, index) => {
                      const userAnswer = result?.answers[index];
                      const isCorrect = userAnswer === question.correctIndex;

                      return (
                        <div
                          key={question.id}
                          className={`p-4 rounded-lg border ${
                            isCorrect
                              ? 'bg-green-500/5 border-green-500/20'
                              : 'bg-red-500/5 border-red-500/20'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="text-white mb-2">{question.text}</p>
                              <p className="text-sm text-gray-400">
                                Your answer: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                                  {question.options[userAnswer ?? 0]}
                                </span>
                              </p>
                              {!isCorrect && (
                                <p className="text-sm text-gray-400">
                                  Correct answer: <span className="text-green-400">
                                    {question.options[question.correctIndex]}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => startAssessment(currentAssessment)}
                      className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Retake Assessment
                    </button>
                    <button
                      onClick={() => setActiveView('browse')}
                      className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Target className="w-5 h-5" />
                      More Assessments
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Learning Recommendations */}
        {activeView === 'browse' && completedResults.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-orange-400" />
              Recommended Learning Paths
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {completedResults
                .filter(r => r.score < 75)
                .slice(0, 4)
                .map(result => {
                  const assessment = ASSESSMENTS.find(a => a.id === result.assessmentId);
                  if (!assessment) return null;

                  return (
                    <div key={result.assessmentId} className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <assessment.icon className={`w-6 h-6 text-${assessment.color}-400`} />
                        <div>
                          <h4 className="text-white font-medium">Improve your {assessment.name}</h4>
                          <span className="text-sm text-gray-500">Current: {result.score}%</span>
                        </div>
                      </div>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-center gap-2 text-sm text-gray-400">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          Review incorrect answers above
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-400">
                          <BookOpen className="w-4 h-4 text-blue-400" />
                          Take online courses on this topic
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-400">
                          <Code className="w-4 h-4 text-purple-400" />
                          Practice with hands-on projects
                        </li>
                      </ul>
                      <button
                        onClick={() => startAssessment(assessment)}
                        className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Retake to Track Progress
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-orange-900/30 to-amber-900/30 rounded-2xl border border-orange-500/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Track Your Growth</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Take assessments regularly to measure your progress and identify areas for improvement.
            Build a comprehensive skills profile for your job applications.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/college/portfolio-builder"
              className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Target className="w-5 h-5" />
              Build Your Portfolio
            </Link>
            <Link
              to="/college/professional-development"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors border border-gray-700"
            >
              View Certifications
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsAssessmentPage;

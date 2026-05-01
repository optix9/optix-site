const algebraQuestions = [

  // EASY (1)
  { question: "Solve: x + 5 = 12", options: ["5", "6", "7", "8"], answer: "7", difficulty: "1", topic: "Algebra" },
  { question: "Solve: 2x = 14", options: ["6", "7", "8", "9"], answer: "7", difficulty: "1", topic: "Algebra" },
  { question: "Solve: x - 9 = 3", options: ["10", "11", "12", "13"], answer: "12", difficulty: "1", topic: "Algebra" },
  { question: "Evaluate: 3x when x = 4", options: ["10", "11", "12", "13"], answer: "12", difficulty: "1", topic: "Algebra" },
  { question: "Solve: x/2 = 6", options: ["10", "11", "12", "13"], answer: "12", difficulty: "1", topic: "Algebra" },
  { question: "Solve: 5 + x = 9", options: ["2", "3", "4", "5"], answer: "4", difficulty: "1", topic: "Algebra" },
  { question: "Solve: 3x = 21", options: ["6", "7", "8", "9"], answer: "7", difficulty: "1", topic: "Algebra" },
  { question: "Solve: x - 4 = 10", options: ["12", "13", "14", "15"], answer: "14", difficulty: "1", topic: "Algebra" },
  { question: "Evaluate: x + 3 when x = 5", options: ["6", "7", "8", "9"], answer: "8", difficulty: "1", topic: "Algebra" },
  { question: "Solve: 4x = 20", options: ["4", "5", "6", "7"], answer: "5", difficulty: "1", topic: "Algebra" },

  // MEDIUM (2)
  { question: "Solve: 2x + 3 = 11", options: ["3", "4", "5", "6"], answer: "4", difficulty: "2", topic: "Algebra" },
  { question: "Solve: 3x - 5 = 16", options: ["6", "7", "8", "9"], answer: "7", difficulty: "2", topic: "Algebra" },
  { question: "Solve: 5x + 2 = 27", options: ["4", "5", "6", "7"], answer: "5", difficulty: "2", topic: "Algebra" },
  { question: "Solve: 4x - 7 = 9", options: ["3", "4", "5", "6"], answer: "4", difficulty: "2", topic: "Algebra" },
  { question: "Evaluate: 2(x + 3) when x = 4", options: ["12", "13", "14", "15"], answer: "14", difficulty: "2", topic: "Algebra" },
  { question: "Solve: 6x = 2x + 16", options: ["3", "4", "5", "6"], answer: "4", difficulty: "2", topic: "Algebra" },
  { question: "Solve: 3(x + 2) = 18", options: ["4", "5", "6", "7"], answer: "4", difficulty: "2", topic: "Algebra" },
  { question: "Solve: 2x + 5 = x + 9", options: ["3", "4", "5", "6"], answer: "4", difficulty: "2", topic: "Algebra" },
  { question: "Solve: 7x - 2 = 5x + 10", options: ["4", "5", "6", "7"], answer: "6", difficulty: "2", topic: "Algebra" },
  { question: "Evaluate: x^2 when x = 6", options: ["30", "32", "34", "36"], answer: "36", difficulty: "2", topic: "Algebra" },

  // HARD (3)
  { question: "Solve: 2(x + 3) = 3x - 4", options: ["8", "9", "10", "11"], answer: "10", difficulty: "3", topic: "Algebra" },
  { question: "Solve: 5(x - 2) = 3x + 4", options: ["6", "7", "8", "9"], answer: "7", difficulty: "3", topic: "Algebra" },
  { question: "Solve: 3(x + 4) = 2(x + 7)", options: ["1", "2", "3", "4"], answer: "2", difficulty: "3", topic: "Algebra" },
  { question: "Solve: 4x + 3 = 2x + 15", options: ["5", "6", "7", "8"], answer: "6", difficulty: "3", topic: "Algebra" },
  { question: "Solve: (x/2) + 5 = 9", options: ["6", "7", "8", "9"], answer: "8", difficulty: "3", topic: "Algebra" },
  { question: "Solve: 2x + 3x - 4 = 21", options: ["4", "5", "6", "7"], answer: "5", difficulty: "3", topic: "Algebra" },
  { question: "Solve: 3(x - 2) + 4 = 16", options: ["4", "5", "6", "7"], answer: "6", difficulty: "3", topic: "Algebra" },
  { question: "Solve: 2(x + 5) - 3 = 17", options: ["4", "5", "6", "7"], answer: "5", difficulty: "3", topic: "Algebra" },
  { question: "Solve: (x + 2)/3 = 5", options: ["12", "13", "14", "15"], answer: "13", difficulty: "3", topic: "Algebra" },
  { question: "Solve: 2x + 3 = 3x - 7", options: ["8", "9", "10", "11"], answer: "10", difficulty: "3", topic: "Algebra" }

];

const geometryQuestions = [

  // EASY
  { question: "What is the area of a rectangle with length 6 and width 4?", options: ["20", "22", "24", "26"], answer: "24", difficulty: "1", topic: "Geometry" },
  { question: "What is the perimeter of a square with side 5?", options: ["15", "20", "25", "30"], answer: "20", difficulty: "1", topic: "Geometry" },
  { question: "How many degrees in a triangle?", options: ["90", "180", "270", "360"], answer: "180", difficulty: "1", topic: "Geometry" },
  { question: "What is the area of a triangle with base 10 and height 2?", options: ["10", "15", "20", "25"], answer: "10", difficulty: "1", topic: "Geometry" },
  { question: "How many sides does an octagon have?", options: ["6", "7", "8", "9"], answer: "8", difficulty: "1", topic: "Geometry" },
  { question: "What is the circumference formula?", options: ["πr²", "2πr", "r²", "2r"], answer: "2πr", difficulty: "1", topic: "Geometry" },
  { question: "What is the area of a square with side 7?", options: ["42", "49", "56", "63"], answer: "49", difficulty: "1", topic: "Geometry" },
  { question: "Right angle measure?", options: ["45", "60", "90", "120"], answer: "90", difficulty: "1", topic: "Geometry" },
  { question: "What is 5²?", options: ["10", "20", "25", "30"], answer: "25", difficulty: "1", topic: "Geometry" },
  { question: "Perimeter of rectangle 3x8?", options: ["18", "20", "22", "24"], answer: "22", difficulty: "1", topic: "Geometry" },

  // MEDIUM
  { question: "Find hypotenuse: legs 3 and 4", options: ["5", "6", "7", "8"], answer: "5", difficulty: "2", topic: "Geometry" },
  { question: "Area of circle radius 3?", options: ["6π", "9π", "12π", "18π"], answer: "9π", difficulty: "2", topic: "Geometry" },
  { question: "Triangle angles: 50 and 60, third?", options: ["60", "70", "80", "90"], answer: "70", difficulty: "2", topic: "Geometry" },
  { question: "Volume cube side 4?", options: ["16", "32", "64", "128"], answer: "64", difficulty: "2", topic: "Geometry" },
  { question: "Perimeter of triangle 5,6,7?", options: ["16", "17", "18", "19"], answer: "18", difficulty: "2", topic: "Geometry" },
  { question: "Area rectangle 9x3?", options: ["18", "24", "27", "30"], answer: "27", difficulty: "2", topic: "Geometry" },
  { question: "Circumference radius 4?", options: ["6π", "8π", "10π", "12π"], answer: "8π", difficulty: "2", topic: "Geometry" },
  { question: "Area triangle base 8 height 5?", options: ["20", "25", "30", "35"], answer: "20", difficulty: "2", topic: "Geometry" },
  { question: "Diagonal square side 1?", options: ["1", "√2", "2", "√3"], answer: "√2", difficulty: "2", topic: "Geometry" },
  { question: "Volume rectangular prism 2x3x4?", options: ["12", "18", "24", "30"], answer: "24", difficulty: "2", topic: "Geometry" },

  // HARD
  { question: "Hypotenuse legs 5 and 12?", options: ["11", "12", "13", "14"], answer: "13", difficulty: "3", topic: "Geometry" },
  { question: "Area circle radius 5?", options: ["10π", "15π", "20π", "25π"], answer: "25π", difficulty: "3", topic: "Geometry" },
  { question: "Volume sphere radius 3?", options: ["36π", "27π", "36π/3", "36π"], answer: "36π", difficulty: "3", topic: "Geometry" },
  { question: "Surface area cube side 3?", options: ["27", "36", "45", "54"], answer: "54", difficulty: "3", topic: "Geometry" },
  { question: "Area trapezoid bases 6,10 height 4?", options: ["28", "30", "32", "34"], answer: "32", difficulty: "3", topic: "Geometry" },
  { question: "Distance (0,0) to (6,8)?", options: ["8", "9", "10", "11"], answer: "10", difficulty: "3", topic: "Geometry" },
  { question: "Area sector 90° radius 2?", options: ["π", "2π", "3π", "4π"], answer: "π", difficulty: "3", topic: "Geometry" },
  { question: "Volume cylinder r=2 h=5?", options: ["10π", "15π", "20π", "25π"], answer: "20π", difficulty: "3", topic: "Geometry" },
  { question: "Diagonal rectangle 9x12?", options: ["13", "14", "15", "16"], answer: "15", difficulty: "3", topic: "Geometry" },
  { question: "Triangle sides 7,24,25 type?", options: ["Right", "Acute", "Obtuse", "Isosceles"], answer: "Right", difficulty: "3", topic: "Geometry" }

];

const numberTheoryQuestions = [

  // EASY
  { question: "Is 7 prime?", options: ["Yes", "No", "Sometimes", "Undefined"], answer: "Yes", difficulty: "1", topic: "Number Theory" },
  { question: "Even number?", options: ["3", "5", "8", "9"], answer: "8", difficulty: "1", topic: "Number Theory" },
  { question: "GCF of 4 and 8?", options: ["2", "4", "6", "8"], answer: "4", difficulty: "1", topic: "Number Theory" },
  { question: "LCM of 3 and 4?", options: ["6", "8", "10", "12"], answer: "12", difficulty: "1", topic: "Number Theory" },
  { question: "Multiple of 5?", options: ["12", "15", "18", "22"], answer: "15", difficulty: "1", topic: "Number Theory" },
  { question: "Prime number?", options: ["4", "6", "9", "11"], answer: "11", difficulty: "1", topic: "Number Theory" },
  { question: "Odd number?", options: ["2", "4", "6", "7"], answer: "7", difficulty: "1", topic: "Number Theory" },
  { question: "GCF of 6 and 9?", options: ["1", "2", "3", "6"], answer: "3", difficulty: "1", topic: "Number Theory" },
  { question: "LCM of 2 and 5?", options: ["5", "10", "15", "20"], answer: "10", difficulty: "1", topic: "Number Theory" },
  { question: "Divisible by 2?", options: ["11", "13", "14", "15"], answer: "14", difficulty: "1", topic: "Number Theory" },

  // MEDIUM
  { question: "Prime factorization of 12?", options: ["2×6", "3×4", "2×2×3", "1×12"], answer: "2×2×3", difficulty: "2", topic: "Number Theory" },
  { question: "GCF of 12 and 18?", options: ["3", "4", "6", "9"], answer: "6", difficulty: "2", topic: "Number Theory" },
  { question: "LCM of 6 and 8?", options: ["12", "18", "24", "30"], answer: "24", difficulty: "2", topic: "Number Theory" },
  { question: "Is 121 prime?", options: ["Yes", "No", "Sometimes", "Undefined"], answer: "No", difficulty: "2", topic: "Number Theory" },
  { question: "Factors of 15 count?", options: ["2", "3", "4", "5"], answer: "4", difficulty: "2", topic: "Number Theory" },
  { question: "Divisible by 3?", options: ["14", "16", "18", "20"], answer: "18", difficulty: "2", topic: "Number Theory" },
  { question: "GCF 20,30?", options: ["5", "10", "15", "20"], answer: "10", difficulty: "2", topic: "Number Theory" },
  { question: "LCM 4,6?", options: ["8", "10", "12", "16"], answer: "12", difficulty: "2", topic: "Number Theory" },
  { question: "Prime factorization of 18?", options: ["2×9", "3×6", "2×3×3", "1×18"], answer: "2×3×3", difficulty: "2", topic: "Number Theory" },
  { question: "Smallest prime?", options: ["0", "1", "2", "3"], answer: "2", difficulty: "2", topic: "Number Theory" },

  // HARD
  { question: "GCF of 48 and 180?", options: ["6", "12", "24", "36"], answer: "12", difficulty: "3", topic: "Number Theory" },
  { question: "LCM of 12 and 15?", options: ["30", "45", "60", "75"], answer: "60", difficulty: "3", topic: "Number Theory" },
  { question: "Prime factorization of 60?", options: ["2×30", "3×20", "2×2×3×5", "5×12"], answer: "2×2×3×5", difficulty: "3", topic: "Number Theory" },
  { question: "Is 97 prime?", options: ["Yes", "No", "Sometimes", "Undefined"], answer: "Yes", difficulty: "3", topic: "Number Theory" },
  { question: "Number of factors of 16?", options: ["3", "4", "5", "6"], answer: "5", difficulty: "3", topic: "Number Theory" },
  { question: "LCM 9,12?", options: ["18", "24", "36", "48"], answer: "36", difficulty: "3", topic: "Number Theory" },
  { question: "GCF 81,27?", options: ["9", "18", "27", "81"], answer: "27", difficulty: "3", topic: "Number Theory" },
  { question: "Prime factorization 100?", options: ["2×50", "4×25", "2×2×5×5", "10×10"], answer: "2×2×5×5", difficulty: "3", topic: "Number Theory" },
  { question: "Is 1 prime?", options: ["Yes", "No", "Sometimes", "Undefined"], answer: "No", difficulty: "3", topic: "Number Theory" },
  { question: "LCM 7,8?", options: ["14", "28", "56", "64"], answer: "56", difficulty: "3", topic: "Number Theory" }

];

const probabilityQuestions = [

  // EASY
  { question: "Probability of heads?", options: ["0", "1/2", "1", "2"], answer: "1/2", difficulty: "1", topic: "Probability" },
  { question: "Roll a 6-sided die, chance of 1?", options: ["1/3", "1/4", "1/5", "1/6"], answer: "1/6", difficulty: "1", topic: "Probability" },
  { question: "Mean of 2,4,6?", options: ["3", "4", "5", "6"], answer: "4", difficulty: "1", topic: "Probability" },
  { question: "Median of 1,3,5?", options: ["1", "3", "5", "9"], answer: "3", difficulty: "1", topic: "Probability" },
  { question: "Mode of 2,2,3?", options: ["2", "3", "Both", "None"], answer: "2", difficulty: "1", topic: "Probability" },
  { question: "Probability impossible event?", options: ["0", "1/2", "1", "2"], answer: "0", difficulty: "1", topic: "Probability" },
  { question: "Probability certain event?", options: ["0", "1/2", "1", "2"], answer: "1", difficulty: "1", topic: "Probability" },
  { question: "Mean of 5,5,5?", options: ["3", "4", "5", "6"], answer: "5", difficulty: "1", topic: "Probability" },
  { question: "Range of 2,6?", options: ["2", "3", "4", "5"], answer: "4", difficulty: "1", topic: "Probability" },
  { question: "Probability tails?", options: ["0", "1/2", "1", "2"], answer: "1/2", difficulty: "1", topic: "Probability" },

  // MEDIUM
  { question: "Probability even on die?", options: ["1/2", "1/3", "1/4", "1/6"], answer: "1/2", difficulty: "2", topic: "Probability" },
  { question: "Mean of 1,2,3,4?", options: ["2", "2.5", "3", "3.5"], answer: "2.5", difficulty: "2", topic: "Probability" },
  { question: "Median of 1,2,3,4?", options: ["2", "2.5", "3", "3.5"], answer: "2.5", difficulty: "2", topic: "Probability" },
  { question: "Mode of 1,2,3?", options: ["1", "2", "3", "None"], answer: "None", difficulty: "2", topic: "Probability" },
  { question: "Range of 3,9?", options: ["3", "6", "9", "12"], answer: "6", difficulty: "2", topic: "Probability" },
  { question: "Probability odd on die?", options: ["1/2", "1/3", "1/4", "1/6"], answer: "1/2", difficulty: "2", topic: "Probability" },
  { question: "Mean of 10,20,30?", options: ["10", "15", "20", "25"], answer: "20", difficulty: "2", topic: "Probability" },
  { question: "Median of 5,7,9,11,13?", options: ["7", "9", "11", "13"], answer: "9", difficulty: "2", topic: "Probability" },
  { question: "Probability >4 on die?", options: ["1/6", "1/3", "1/2", "2/3"], answer: "1/3", difficulty: "2", topic: "Probability" },
  { question: "Mean of 4,6,8,10?", options: ["6", "7", "8", "9"], answer: "7", difficulty: "2", topic: "Probability" },

  // HARD
  { question: "Probability two heads?", options: ["1/2", "1/3", "1/4", "1/6"], answer: "1/4", difficulty: "3", topic: "Probability" },
  { question: "Mean of 1–5?", options: ["2", "2.5", "3", "3.5"], answer: "3", difficulty: "3", topic: "Probability" },
  { question: "Median of 2,4,6,8?", options: ["4", "5", "6", "7"], answer: "5", difficulty: "3", topic: "Probability" },
  { question: "Range of 10,20,30?", options: ["10", "15", "20", "25"], answer: "20", difficulty: "3", topic: "Probability" },
  { question: "Probability sum 7 (2 dice)?", options: ["1/12", "1/6", "1/8", "1/10"], answer: "1/6", difficulty: "3", topic: "Probability" },
  { question: "Mean of 2,4,6,8,10?", options: ["5", "6", "7", "8"], answer: "6", difficulty: "3", topic: "Probability" },
  { question: "Probability not 6?", options: ["1/6", "5/6", "1/2", "2/3"], answer: "5/6", difficulty: "3", topic: "Probability" },
  { question: "Median of 1–7?", options: ["3", "4", "5", "6"], answer: "4", difficulty: "3", topic: "Probability" },
  { question: "Range of 5,15,25?", options: ["10", "15", "20", "25"], answer: "20", difficulty: "3", topic: "Probability" },
  { question: "Probability 1 or 2?", options: ["1/6", "1/3", "1/2", "2/3"], answer: "1/3", difficulty: "3", topic: "Probability" }

];

export {
  algebraQuestions,
  geometryQuestions,
  numberTheoryQuestions,
  probabilityQuestions
};
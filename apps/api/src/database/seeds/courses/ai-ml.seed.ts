import { CourseModel } from '../../models/Course';
import { ModuleModel } from '../../models/Module';
import { LessonModel } from '../../models/Lesson';
import { ActivityModel } from '../../models/Activity';
import { AssessmentModel } from '../../models/Assessment';
import { ChallengeModel } from '../../models/Challenge';

export async function seedAiMlCourses(resourceMap: Map<string, any>) {
  const getRes = (titlePrefix: string) => {
    for (const [title, r] of resourceMap.entries()) {
      if (title.toLowerCase().includes(titlePrefix.toLowerCase())) return r;
    }
    return undefined;
  };

  // =========================================================================
  // 1. MACHINE LEARNING & PREDICTIVE MODELING (4 MODULES, 8 LESSONS)
  // =========================================================================
  const mlCourse = await CourseModel.create({
    slug: 'machine-learning',
    title: 'Machine Learning & Predictive Systems Engineering',
    description: 'Master supervised and unsupervised machine learning algorithms, mathematical foundations, scikit-learn, ensemble models, validation metrics, and production pipelines.',
    domain: 'AI & Machine Learning',
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    estimatedHours: 40,
    skillsCovered: ['machine-learning', 'python-data-science', 'scikit-learn', 'model-evaluation'],
    prerequisites: ['Python programming', 'Basic linear algebra and calculus'],
    modules: [],
  });

  const mlMod1 = await ModuleModel.create({
    courseId: mlCourse._id,
    title: `Module 1: ML Foundations & Supervised Learning`,
    description: `Understand the machine learning lifecycle, training/testing splits, feature normalization, and regression models.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: Supervised Learning Foundations & Data Preprocessing ---
  const mlL1 = await LessonModel.create({
    moduleId: mlMod1._id,
    courseId: mlCourse._id,
    title: `Supervised Learning Foundations & Data Preprocessing`,
    description: `Explore features, target vectors, feature scaling (StandardScaler), and train/test splitting.`,
    order: 1,
    activities: [],
  });

  const mlL1_Video = await ActivityModel.create({
    lessonId: mlL1._id,
    type: 'VIDEO',
    title: `Video: Machine Learning Foundations & Preprocessing Pipelines`,
    order: 1,
    resourceRef: getRes('Machine Learning Foundations in Tamil')?._id,
    content: `# Key Takeaways:
- Supervised learning trains models on labeled input-output pairs (X -> y).
- Always split data into train and test sets before fitting transformers to prevent data leakage.
- Feature scaling prevents high-magnitude features from dominating gradient updates.`,
  });

  const mlL1_Notes = await ActivityModel.create({
    lessonId: mlL1._id,
    type: 'NOTES',
    title: `Codexa Notes: Supervised Learning Foundations & Data Preprocessing`,
    order: 2,
    content: `# Supervised Learning Foundations & Data Preprocessing

Explore features, target vectors, feature scaling (StandardScaler), and train/test splitting.

Machine learning algorithms discover statistical patterns in structured and unstructured data to make predictions on unseen samples.

---

### 1. The Supervised Learning Formalism
Given training data $\\mathcal{D} = \\{(x_1, y_1), (x_2, y_2), \\dots, (x_n, y_n)\\}$, learn a mapping function $f_	heta: \\mathcal{X} 	o \\mathcal{Y}$ minimizing an empirical loss function:
$$\\min_	heta rac{1}{n} \\sum_{i=1}^n \\mathcal{L}(f_	heta(x_i), y_i)$$

### 2. Preventing Data Leakage with Scalers
Fit scalers *only* on training data, then transform both training and test partitions:
\`\`\`python
import numpy as np

def standard_scale(X_train, X_test):
    mean = np.mean(X_train, axis=0)
    std = np.std(X_train, axis=0) + 1e-8
    return (X_train - mean) / std, (X_test - mean) / std
\`\`\`

## Why Supervised Learning Foundations & Data Preprocessing Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Calculate mean = sum(data)/len(data)

> ⚠️ **Common Mistake**: Fitting scalers on test data introduces data leakage (test set information contaminating the training pipeline), yielding overly optimistic and unreliable performance metrics.

## Real-World Production Scenario

In production engineering, **Supervised Learning Foundations & Data Preprocessing** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Supervised Learning Foundations & Data Preprocessing. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Scikit-Learn User Guide')?._id,
  });

  const mlL1_Challenge = await ChallengeModel.create({
    title: `Implement Z-Score Feature Standardization`,
    description: `Write a Python function \`standardize_features(data)\` that calculates the mean and standard deviation of a 1D list of numbers and returns a list of standardized values: \`(x - mean) / std\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def standardize_features(data):
    # Return list of standardized float values
    pass
`,
    solutionCode: `def standardize_features(data):
    if not data:
        return []
    mean = sum(data) / len(data)
    variance = sum((x - mean) ** 2 for x in data) / len(data)
    std = variance ** 0.5
    if std == 0:
        return [0.0 for _ in data]
    return [(x - mean) / std for x in data]`,
    hints: ["Calculate mean = sum(data)/len(data)", "Calculate variance and square root for std", "Divide (x - mean) by std"],
    skills: [{"skillId": "python-data-science", "weight": 1.0}],
    testCases: [{"input": "standardize_features([10, 20, 30])", "expectedOutput": "[-1.224744871391589, 0.0, 1.224744871391589]", "description": "Standardizes numeric list", "hidden": false}],
  });

  const mlL1_Practice = await ActivityModel.create({
    lessonId: mlL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Implement Z-Score Feature Standardization`,
    order: 3,
    challengeRef: mlL1_Challenge._id,
    content: `# Code Practice: Implement Z-Score Feature Standardization\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mlL1_Challenge.activityId = mlL1_Practice._id;
  await mlL1_Challenge.save();

  const mlL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Preprocessing & Data Splits`,
    description: `Validate data split mechanics and leakage prevention.`,
    passingScore: 70,
    skills: [{"skillId": "machine-learning", "weight": 1.0}],
    questions: [
    {
        "question": "Why is it critical to compute feature scaling statistics (mean and variance) ONLY on the training dataset?",
        "options": [
            "To reduce computation time on test data",
            "To avoid data leakage, ensuring test set distributions do not contaminate model training",
            "Because test datasets cannot contain floating-point numbers",
            "Scikit-learn raises an error otherwise"
        ],
        "explanation": "Fitting scalers on test data introduces data leakage (test set information contaminating the training pipeline), yielding overly optimistic and unreliable performance metrics.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const mlL1_Assessment = await ActivityModel.create({
    lessonId: mlL1._id,
    type: 'QUIZ',
    title: `Assessment: Preprocessing & Data Splits`,
    order: 4,
    assessmentRef: mlL1_Quiz._id,
  });
  mlL1_Quiz.activityId = mlL1_Assessment._id;
  await mlL1_Quiz.save();

  mlL1.activities = [
    mlL1_Video._id,
    mlL1_Notes._id,
    mlL1_Practice._id,
    mlL1_Assessment._id,
  ] as any;
  await mlL1.save();

  // --- Lesson 2: Linear & Logistic Regression Mechanics ---
  const mlL2 = await LessonModel.create({
    moduleId: mlMod1._id,
    courseId: mlCourse._id,
    title: `Linear & Logistic Regression Mechanics`,
    description: `Master ordinary least squares, gradient descent optimization, and sigmoid probability activation.`,
    order: 2,
    activities: [],
  });

  const mlL2_Video = await ActivityModel.create({
    lessonId: mlL2._id,
    type: 'VIDEO',
    title: `Video: Linear & Logistic Regression from Scratch`,
    order: 1,
    resourceRef: getRes('Linear Regression and Logistic Regression in Tamil')?._id,
    content: `# Key Takeaways:
- Linear regression models continuous numeric targets: y = wX + b.
- Logistic regression applies the Sigmoid function to output class probabilities.
- Weights are optimized iteratively using Gradient Descent.`,
  });

  const mlL2_Notes = await ActivityModel.create({
    lessonId: mlL2._id,
    type: 'NOTES',
    title: `Codexa Notes: Linear & Logistic Regression Mechanics`,
    order: 2,
    content: `# Linear & Logistic Regression Mechanics

Master ordinary least squares, gradient descent optimization, and sigmoid probability activation.

Regression and classification form the bedrock of supervised learning.

---

### 1. Linear Regression (Mean Squared Error)
$$\\hat{y} = w^T x + b$$
$$\\mathcal{L}_{MSE} = rac{1}{2n}\\sum_{i=1}^n (\\hat{y}_i - y_i)^2$$

### 2. Logistic Regression (Binary Cross-Entropy)
Pass linear predictions through the Sigmoid activation function $\\sigma(z) = rac{1}{1 + e^{-z}}$:
$$\\hat{p} = \\sigma(w^T x + b) = rac{1}{1 + e^{-(w^T x + b)}}$$
$$\\mathcal{L}_{BCE} = -rac{1}{n}\\sum_{i=1}^n [y_i \\log(\\hat{p}_i) + (1 - y_i) \\log(1 - \\hat{p}_i)]$$

## Why Linear & Logistic Regression Mechanics Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
import math

def sigmoid(z):
    if z < -700:
        return 0.0
    if z > 700:
        return 1.0
    return 1.0 / (1.0 + math.exp(-z))
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Use 1.0 / (1.0 + math.exp(-z))

> ⚠️ **Common Mistake**: Sigmoid maps unbounded real-valued inputs (-infinity to +infinity) onto the range (0, 1), representing class probability.

## Real-World Production Scenario

In production engineering, **Linear & Logistic Regression Mechanics** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Linear & Logistic Regression Mechanics. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Scikit-Learn User Guide')?._id,
  });

  const mlL2_Challenge = await ChallengeModel.create({
    title: `Implement Sigmoid Activation Function`,
    description: `Write a Python function \`sigmoid(z)\` that calculates \`1.0 / (1.0 + math.exp(-z))\` with protection against overflow when \`z < -700\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `import math

def sigmoid(z):
    # Return sigmoid probability
    pass
`,
    solutionCode: `import math

def sigmoid(z):
    if z < -700:
        return 0.0
    if z > 700:
        return 1.0
    return 1.0 / (1.0 + math.exp(-z))`,
    hints: ["Use 1.0 / (1.0 + math.exp(-z))", "Cap extremes to avoid overflow"],
    skills: [{"skillId": "machine-learning", "weight": 1.0}],
    testCases: [{"input": "sigmoid(0)", "expectedOutput": "0.5", "description": "Sigmoid of 0 is 0.5", "hidden": false}],
  });

  const mlL2_Practice = await ActivityModel.create({
    lessonId: mlL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Implement Sigmoid Activation Function`,
    order: 3,
    challengeRef: mlL2_Challenge._id,
    content: `# Code Practice: Implement Sigmoid Activation Function\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mlL2_Challenge.activityId = mlL2_Practice._id;
  await mlL2_Challenge.save();

  const mlL2_Quiz = await AssessmentModel.create({
    title: `Assessment: Regression & Classification`,
    description: `Test your grasp of loss functions and Sigmoid probabilities.`,
    passingScore: 70,
    skills: [{"skillId": "machine-learning", "weight": 1.0}],
    questions: [
    {
        "question": "What is the purpose of the Sigmoid activation function in logistic regression?",
        "options": [
            "To convert continuous linear logits into calibrated probabilities bounded between 0 and 1",
            "To speed up matrix multiplication",
            "To normalize features across columns",
            "To replace gradient descent"
        ],
        "explanation": "Sigmoid maps unbounded real-valued inputs (-infinity to +infinity) onto the range (0, 1), representing class probability.",
        "correctOption": 0,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const mlL2_Assessment = await ActivityModel.create({
    lessonId: mlL2._id,
    type: 'QUIZ',
    title: `Assessment: Regression & Classification`,
    order: 4,
    assessmentRef: mlL2_Quiz._id,
  });
  mlL2_Quiz.activityId = mlL2_Assessment._id;
  await mlL2_Quiz.save();

  mlL2.activities = [
    mlL2_Video._id,
    mlL2_Notes._id,
    mlL2_Practice._id,
    mlL2_Assessment._id,
  ] as any;
  await mlL2.save();

  mlMod1.lessons = [mlL1._id, mlL2._id] as any;
  await mlMod1.save();

  const mlMod2 = await ModuleModel.create({
    courseId: mlCourse._id,
    title: `Module 2: Tree-Based Models & Ensemble Architectures`,
    description: `Master Decision Trees, Gini impurity, Information Gain, Random Forests (Bagging), and Gradient Boosted Trees (Boosting).`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Decision Trees, Gini Impurity & Information Gain ---
  const mlL3 = await LessonModel.create({
    moduleId: mlMod2._id,
    courseId: mlCourse._id,
    title: `Decision Trees, Gini Impurity & Information Gain`,
    description: `Understand recursive binary splitting, Gini impurity, Shannon entropy, and tree pruning.`,
    order: 1,
    activities: [],
  });

  const mlL3_Video = await ActivityModel.create({
    lessonId: mlL3._id,
    type: 'VIDEO',
    title: `Video: Decision Tree Algorithms & Splitting Criteria`,
    order: 1,
    resourceRef: getRes('Decision Trees Classifier Algorithm in Tamil')?._id,
    content: `# Key Takeaways:
- Decision trees recursively partition feature space into pure homogeneous leaf nodes.
- Splitting criteria include Gini Impurity and Shannon Entropy.
- Tree depth must be constrained (pruning) to prevent catastrophic overfitting.`,
  });

  const mlL3_Notes = await ActivityModel.create({
    lessonId: mlL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Decision Trees, Gini Impurity & Information Gain`,
    order: 2,
    content: `# Decision Trees, Gini Impurity & Information Gain

Understand recursive binary splitting, Gini impurity, Shannon entropy, and tree pruning.

Decision trees are intuitive, non-parametric supervised models that learn recursive if-then-else decision rules.

---

### 1. Gini Impurity
Measures the likelihood of an element being incorrectly labeled if randomly classified according to the label distribution:
$$I_G(p) = 1 - \\sum_{k=1}^K p_k^2$$

### 2. Shannon Entropy & Information Gain
$$H(S) = -\\sum_{k=1}^K p_k \\log_2(p_k)$$
$$IG(S, A) = H(S) - \\sum_{v \\in Values(A)} rac{|S_v|}{|S|} H(S_v)$$

## Why Decision Trees, Gini Impurity & Information Gain Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
def gini_impurity(positives, negatives):
    total = positives + negatives
    if total == 0:
        return 0.0
    p1 = positives / total
    p2 = negatives / total
    return 1.0 - (p1 ** 2 + p2 ** 2)
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Calculate p1 = positives/total, p2 = negatives/total

> ⚠️ **Common Mistake**: A pure node has p = 1.0 for one class and 0 for all others, resulting in 1 - (1.0^2) = 0.0 Gini impurity.

## Real-World Production Scenario

In production engineering, **Decision Trees, Gini Impurity & Information Gain** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Decision Trees, Gini Impurity & Information Gain. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Scikit-Learn User Guide')?._id,
  });

  const mlL3_Challenge = await ChallengeModel.create({
    title: `Calculate Binary Gini Impurity`,
    description: `Write a Python function \`gini_impurity(positives, negatives)\` that calculates and returns the Gini impurity for a split containing positive and negative sample counts.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def gini_impurity(positives, negatives):
    # Return Gini impurity float
    pass
`,
    solutionCode: `def gini_impurity(positives, negatives):
    total = positives + negatives
    if total == 0:
        return 0.0
    p1 = positives / total
    p2 = negatives / total
    return 1.0 - (p1 ** 2 + p2 ** 2)`,
    hints: ["Calculate p1 = positives/total, p2 = negatives/total", "Return 1.0 - (p1^2 + p2^2)"],
    skills: [{"skillId": "machine-learning", "weight": 1.0}],
    testCases: [{"input": "gini_impurity(50, 50)", "expectedOutput": "0.5", "description": "Even split yields 0.5 Gini impurity", "hidden": false}],
  });

  const mlL3_Practice = await ActivityModel.create({
    lessonId: mlL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Calculate Binary Gini Impurity`,
    order: 3,
    challengeRef: mlL3_Challenge._id,
    content: `# Code Practice: Calculate Binary Gini Impurity\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mlL3_Challenge.activityId = mlL3_Practice._id;
  await mlL3_Challenge.save();

  const mlL3_Quiz = await AssessmentModel.create({
    title: `Assessment: Decision Trees`,
    description: `Assess knowledge of impurity calculations and tree overfitting.`,
    passingScore: 70,
    skills: [{"skillId": "machine-learning", "weight": 1.0}],
    questions: [
    {
        "question": "What is the Gini impurity of a perfectly pure node where 100% of samples belong to the same class?",
        "options": [
            "1.0",
            "0.5",
            "0.0",
            "Undefined"
        ],
        "explanation": "A pure node has p = 1.0 for one class and 0 for all others, resulting in 1 - (1.0^2) = 0.0 Gini impurity.",
        "correctOption": 2,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const mlL3_Assessment = await ActivityModel.create({
    lessonId: mlL3._id,
    type: 'QUIZ',
    title: `Assessment: Decision Trees`,
    order: 4,
    assessmentRef: mlL3_Quiz._id,
  });
  mlL3_Quiz.activityId = mlL3_Assessment._id;
  await mlL3_Quiz.save();

  mlL3.activities = [
    mlL3_Video._id,
    mlL3_Notes._id,
    mlL3_Practice._id,
    mlL3_Assessment._id,
  ] as any;
  await mlL3.save();

  // --- Lesson 2: Random Forests & Gradient Boosted Decision Trees (XGBoost) ---
  const mlL4 = await LessonModel.create({
    moduleId: mlMod2._id,
    courseId: mlCourse._id,
    title: `Random Forests & Gradient Boosted Decision Trees (XGBoost)`,
    description: `Explore Bagging (Bootstrap Aggregation), feature subsampling, and sequential gradient boosting with residual fitting.`,
    order: 2,
    activities: [],
  });

  const mlL4_Video = await ActivityModel.create({
    lessonId: mlL4._id,
    type: 'VIDEO',
    title: `Video: Random Forests vs Gradient Boosting (XGBoost / LightGBM)`,
    order: 1,
    resourceRef: getRes('Random Forest Ensemble Classifier in Tamil')?._id,
    content: `# Key Takeaways:
- Random Forests use Bagging (bootstrap aggregation) to reduce model variance.
- Gradient Boosting trains trees sequentially to fit the residual pseudo-errors of prior trees.
- GBDTs achieve state-of-the-art performance on tabular datasets.`,
  });

  const mlL4_Notes = await ActivityModel.create({
    lessonId: mlL4._id,
    type: 'NOTES',
    title: `Codexa Notes: Random Forests & Gradient Boosted Decision Trees (XGBoost)`,
    order: 2,
    content: `# Random Forests & Gradient Boosted Decision Trees (XGBoost)

Explore Bagging (Bootstrap Aggregation), feature subsampling, and sequential gradient boosting with residual fitting.

Ensemble methods combine multiple base estimators to produce superior generalization performance.

---

### 1. Random Forests (Bagging)
- Trains $N$ decision trees in parallel on bootstrap samples (random with replacement).
- At each split, only a random subset of features (typically $\\sqrt{D}$) is considered.
- Reduces variance without increasing bias.

### 2. Gradient Boosting (XGBoost / LightGBM)
- Trains trees sequentially: each new tree $T_m(x)$ fits the negative gradient (residuals) of the loss function with respect to current ensemble predictions:
$$r_{im} = -\\left[rac{\\partial \\mathcal{L}(y_i, F_{m-1}(x_i))}{\\partial F_{m-1}(x_i)}
ight]$$
$$F_m(x) = F_{m-1}(x) + \\eta \\cdot T_m(x)$$

## Why Random Forests & Gradient Boosted Decision Trees (XGBoost) Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
def compute_residuals(y_true, y_pred):
    return [yt - yp for yt, yp in zip(y_true, y_pred)]
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Iterate using zip(y_true, y_pred)

> ⚠️ **Common Mistake**: Random Forest is a bagging ensemble where independent trees vote in parallel to reduce variance, while Gradient Boosting is a sequential boosting ensemble where each tree fits the residuals of the prior ensemble.

## Real-World Production Scenario

In production engineering, **Random Forests & Gradient Boosted Decision Trees (XGBoost)** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Random Forests & Gradient Boosted Decision Trees (XGBoost). In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Scikit-Learn User Guide')?._id,
  });

  const mlL4_Challenge = await ChallengeModel.create({
    title: `Calculate Residuals for Gradient Boosting`,
    description: `Write a Python function \`compute_residuals(y_true, y_pred)\` that computes and returns the list of residuals \`y_true[i] - y_pred[i]\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def compute_residuals(y_true, y_pred):
    # Return list of float residuals
    pass
`,
    solutionCode: `def compute_residuals(y_true, y_pred):
    return [yt - yp for yt, yp in zip(y_true, y_pred)]`,
    hints: ["Iterate using zip(y_true, y_pred)", "Subtract predicted value from true value"],
    skills: [{"skillId": "machine-learning", "weight": 1.0}],
    testCases: [{"input": "compute_residuals([10, 20, 30], [8, 22, 28])", "expectedOutput": "[2, -2, 2]", "description": "Computes exact residuals", "hidden": false}],
  });

  const mlL4_Practice = await ActivityModel.create({
    lessonId: mlL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Calculate Residuals for Gradient Boosting`,
    order: 3,
    challengeRef: mlL4_Challenge._id,
    content: `# Code Practice: Calculate Residuals for Gradient Boosting\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mlL4_Challenge.activityId = mlL4_Practice._id;
  await mlL4_Challenge.save();

  const mlL4_Quiz = await AssessmentModel.create({
    title: `Assessment: Ensemble Methods`,
    description: `Test Bagging vs Boosting concepts and residual minimization.`,
    passingScore: 70,
    skills: [{"skillId": "machine-learning", "weight": 1.0}],
    questions: [
    {
        "question": "How does Gradient Boosting differ fundamentally from Random Forest?",
        "options": [
            "Random Forest trains trees sequentially; Gradient Boosting trains trees independently in parallel",
            "Random Forest trains independent trees in parallel (Bagging); Gradient Boosting trains trees sequentially where each tree corrects errors of previous trees (Boosting)",
            "Gradient Boosting cannot handle tabular data",
            "Random Forest uses neural networks"
        ],
        "explanation": "Random Forest is a bagging ensemble where independent trees vote in parallel to reduce variance, while Gradient Boosting is a sequential boosting ensemble where each tree fits the residuals of the prior ensemble.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const mlL4_Assessment = await ActivityModel.create({
    lessonId: mlL4._id,
    type: 'QUIZ',
    title: `Assessment: Ensemble Methods`,
    order: 4,
    assessmentRef: mlL4_Quiz._id,
  });
  mlL4_Quiz.activityId = mlL4_Assessment._id;
  await mlL4_Quiz.save();

  mlL4.activities = [
    mlL4_Video._id,
    mlL4_Notes._id,
    mlL4_Practice._id,
    mlL4_Assessment._id,
  ] as any;
  await mlL4.save();

  mlMod2.lessons = [mlL3._id, mlL4._id] as any;
  await mlMod2.save();

  const mlMod3 = await ModuleModel.create({
    courseId: mlCourse._id,
    title: `Module 3: Model Evaluation, Validation & Hyperparameter Tuning`,
    description: `Master cross-validation, Bias-Variance tradeoff, precision, recall, F1-score, ROC-AUC curves, and Grid/Random Search.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: Confusion Matrix, Precision, Recall, & ROC-AUC ---
  const mlL5 = await LessonModel.create({
    moduleId: mlMod3._id,
    courseId: mlCourse._id,
    title: `Confusion Matrix, Precision, Recall, & ROC-AUC`,
    description: `Evaluate classification models using precision, recall, F1 score, PR curves, and Area Under the ROC Curve.`,
    order: 1,
    activities: [],
  });

  const mlL5_Video = await ActivityModel.create({
    lessonId: mlL5._id,
    type: 'VIDEO',
    title: `Video: Model Evaluation: Precision, Recall, F1 & ROC-AUC`,
    order: 1,
    resourceRef: getRes('Underfitting and Overfitting Bias-Variance in Tamil')?._id,
    content: `# Key Takeaways:
- Accuracy is misleading on imbalanced datasets.
- Precision measures purity of positive predictions: TP / (TP + FP).
- Recall measures sensitivity: TP / (TP + FN).
- ROC-AUC measures ranking discrimination across all classification thresholds.`,
  });

  const mlL5_Notes = await ActivityModel.create({
    lessonId: mlL5._id,
    type: 'NOTES',
    title: `Codexa Notes: Confusion Matrix, Precision, Recall, & ROC-AUC`,
    order: 2,
    content: `# Confusion Matrix, Precision, Recall, & ROC-AUC

Evaluate classification models using precision, recall, F1 score, PR curves, and Area Under the ROC Curve.

Accuracy alone fails when evaluating models on skewed or imbalanced distributions.

---

### Confusion Matrix Metrics
- **True Positives (TP)**: Correctly predicted positives.
- **False Positives (FP)**: Type I Error (false alarm).
- **False Negatives (FN)**: Type II Error (missed detection).

$$	ext{Precision} = rac{TP}{TP + FP}, \\quad 	ext{Recall} = rac{TP}{TP + FN}$$
$$F_1	ext{-Score} = 2 \\cdot rac{	ext{Precision} \\cdot 	ext{Recall}}{	ext{Precision} + 	ext{Recall}}$$

### ROC-AUC Curve
Plots True Positive Rate (Recall) vs False Positive Rate ($FPR = rac{FP}{FP + TN}$) across all decision thresholds. A random guesser yields an AUC of 0.5; a perfect classifier yields 1.0.

## Why Confusion Matrix, Precision, Recall, & ROC-AUC Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
def calculate_metrics(tp, fp, fn):
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    return {'precision': round(precision, 4), 'recall': round(recall, 4), 'f1': round(f1, 4)}
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Precision = tp / (tp + fp)

> ⚠️ **Common Mistake**: High recall minimizes False Negatives (missed diseased patients), which is critical in medical diagnostics where missing a sick patient carries catastrophic consequences.

## Real-World Production Scenario

In production engineering, **Confusion Matrix, Precision, Recall, & ROC-AUC** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Confusion Matrix, Precision, Recall, & ROC-AUC. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Scikit-Learn User Guide')?._id,
  });

  const mlL5_Challenge = await ChallengeModel.create({
    title: `Compute Precision, Recall & F1-Score`,
    description: `Write a Python function \`calculate_metrics(tp, fp, fn)\` that returns a dictionary \`{'precision': float, 'recall': float, 'f1': float}\` with values rounded to 4 decimals.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def calculate_metrics(tp, fp, fn):
    # Return dict with precision, recall, f1
    pass
`,
    solutionCode: `def calculate_metrics(tp, fp, fn):
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    return {'precision': round(precision, 4), 'recall': round(recall, 4), 'f1': round(f1, 4)}`,
    hints: ["Precision = tp / (tp + fp)", "Recall = tp / (tp + fn)", "F1 = 2 * (P * R) / (P + R)"],
    skills: [{"skillId": "model-evaluation", "weight": 1.0}],
    testCases: [{"input": "calculate_metrics(80, 20, 10)", "expectedOutput": "{'precision': 0.8, 'recall': 0.8889, 'f1': 0.8421}", "description": "Calculates precision, recall, and F1", "hidden": false}],
  });

  const mlL5_Practice = await ActivityModel.create({
    lessonId: mlL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Compute Precision, Recall & F1-Score`,
    order: 3,
    challengeRef: mlL5_Challenge._id,
    content: `# Code Practice: Compute Precision, Recall & F1-Score\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mlL5_Challenge.activityId = mlL5_Practice._id;
  await mlL5_Challenge.save();

  const mlL5_Quiz = await AssessmentModel.create({
    title: `Assessment: Evaluation Metrics`,
    description: `Test selection of appropriate metrics for imbalanced datasets.`,
    passingScore: 70,
    skills: [{"skillId": "model-evaluation", "weight": 1.0}],
    questions: [
    {
        "question": "In a medical diagnostic model screening for a rare fatal disease, which metric should be prioritized to minimize missed sick patients?",
        "options": [
            "Accuracy",
            "Precision",
            "Recall (Sensitivity)",
            "Specificity"
        ],
        "explanation": "High recall minimizes False Negatives (missed diseased patients), which is critical in medical diagnostics where missing a sick patient carries catastrophic consequences.",
        "correctOption": 2,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const mlL5_Assessment = await ActivityModel.create({
    lessonId: mlL5._id,
    type: 'QUIZ',
    title: `Assessment: Evaluation Metrics`,
    order: 4,
    assessmentRef: mlL5_Quiz._id,
  });
  mlL5_Quiz.activityId = mlL5_Assessment._id;
  await mlL5_Quiz.save();

  mlL5.activities = [
    mlL5_Video._id,
    mlL5_Notes._id,
    mlL5_Practice._id,
    mlL5_Assessment._id,
  ] as any;
  await mlL5.save();

  // --- Lesson 2: K-Fold Cross-Validation & Hyperparameter Tuning ---
  const mlL6 = await LessonModel.create({
    moduleId: mlMod3._id,
    courseId: mlCourse._id,
    title: `K-Fold Cross-Validation & Hyperparameter Tuning`,
    description: `Implement Stratified K-Fold cross-validation, hyperparameter tuning with GridSearchCV and Bayesian optimization.`,
    order: 2,
    activities: [],
  });

  const mlL6_Video = await ActivityModel.create({
    lessonId: mlL6._id,
    type: 'VIDEO',
    title: `Video: Cross-Validation & Hyperparameter Optimization`,
    order: 1,
    resourceRef: getRes('Underfitting and Overfitting Bias-Variance in Tamil')?._id,
    content: `# Key Takeaways:
- K-Fold cross-validation provides unbiased out-of-fold generalization estimates.
- Use Stratified K-Fold for classification to preserve class ratios across folds.
- Grid and Random search explore hyperparameter spaces systematically.`,
  });

  const mlL6_Notes = await ActivityModel.create({
    lessonId: mlL6._id,
    type: 'NOTES',
    title: `Codexa Notes: K-Fold Cross-Validation & Hyperparameter Tuning`,
    order: 2,
    content: `# K-Fold Cross-Validation & Hyperparameter Tuning

Implement Stratified K-Fold cross-validation, hyperparameter tuning with GridSearchCV and Bayesian optimization.

Proper validation prevents models from overfitting to a single arbitrary validation split.

---

### 1. K-Fold Cross-Validation
1. Partition dataset into $K$ equal subsets (folds).
2. Train model on $K-1$ folds and evaluate on the remaining fold.
3. Repeat $K$ times and compute the mean and variance across all $K$ validation runs.

### 2. Hyperparameter Search Strategies
- **GridSearchCV**: Exhaustive evaluation of all Cartesian product parameter combinations.
- **RandomizedSearchCV**: Samples fixed number of parameter combinations from continuous/discrete distributions (significantly faster in high dimensions).

## Why K-Fold Cross-Validation & Hyperparameter Tuning Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
import itertools

def generate_param_grid(param_dict):
    keys = list(param_dict.keys())
    values = list(param_dict.values())
    combinations = list(itertools.product(*values))
    return [dict(zip(keys, combo)) for combo in combinations]
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Use itertools.product(*param_dict.values())

> ⚠️ **Common Mistake**: Stratification maintains the proportional representation of each class across every fold, preventing unbalanced folds that skew metric calculations.

## Real-World Production Scenario

In production engineering, **K-Fold Cross-Validation & Hyperparameter Tuning** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of K-Fold Cross-Validation & Hyperparameter Tuning. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Scikit-Learn User Guide')?._id,
  });

  const mlL6_Challenge = await ChallengeModel.create({
    title: `Generate Grid Search Parameter Combinations`,
    description: `Write a Python function \`generate_param_grid(param_dict)\` that takes a dictionary of lists like \`{'lr': [0.01, 0.1], 'depth': [3, 5]}\` and returns a list of all parameter combination dictionaries.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `import itertools

def generate_param_grid(param_dict):
    # Return list of combination dicts
    pass
`,
    solutionCode: `import itertools

def generate_param_grid(param_dict):
    keys = list(param_dict.keys())
    values = list(param_dict.values())
    combinations = list(itertools.product(*values))
    return [dict(zip(keys, combo)) for combo in combinations]`,
    hints: ["Use itertools.product(*param_dict.values())", "Zip keys with each combination tuple"],
    skills: [{"skillId": "python-data-science", "weight": 1.0}],
    testCases: [{"input": "generate_param_grid({'a': [1, 2], 'b': [10]})", "expectedOutput": "[{'a': 1, 'b': 10}, {'a': 2, 'b': 10}]", "description": "Generates Cartesian grid products", "hidden": false}],
  });

  const mlL6_Practice = await ActivityModel.create({
    lessonId: mlL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Generate Grid Search Parameter Combinations`,
    order: 3,
    challengeRef: mlL6_Challenge._id,
    content: `# Code Practice: Generate Grid Search Parameter Combinations\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mlL6_Challenge.activityId = mlL6_Practice._id;
  await mlL6_Challenge.save();

  const mlL6_Quiz = await AssessmentModel.create({
    title: `Assessment: Cross-Validation`,
    description: `Assess validation strategies and parameter search trade-offs.`,
    passingScore: 70,
    skills: [{"skillId": "model-evaluation", "weight": 1.0}],
    questions: [
    {
        "question": "Why is Stratified K-Fold preferred over standard K-Fold for classification tasks?",
        "options": [
            "It trains faster because it skips data shuffling",
            "It ensures that each fold contains approximately the same percentage of samples of each target class as the complete dataset",
            "It automatically removes duplicate records",
            "It converts strings to categorical integers"
        ],
        "explanation": "Stratification maintains the proportional representation of each class across every fold, preventing unbalanced folds that skew metric calculations.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const mlL6_Assessment = await ActivityModel.create({
    lessonId: mlL6._id,
    type: 'QUIZ',
    title: `Assessment: Cross-Validation`,
    order: 4,
    assessmentRef: mlL6_Quiz._id,
  });
  mlL6_Quiz.activityId = mlL6_Assessment._id;
  await mlL6_Quiz.save();

  mlL6.activities = [
    mlL6_Video._id,
    mlL6_Notes._id,
    mlL6_Practice._id,
    mlL6_Assessment._id,
  ] as any;
  await mlL6.save();

  mlMod3.lessons = [mlL5._id, mlL6._id] as any;
  await mlMod3.save();

  const mlMod4 = await ModuleModel.create({
    courseId: mlCourse._id,
    title: `Module 4: Unsupervised Learning & Dimensionality Reduction`,
    description: `Master K-Means clustering, Elbow method, Silhouette scores, and Principal Component Analysis (PCA).`,
    order: 4,
    lessons: [],
  });

  // --- Lesson 1: K-Means Clustering, Inertia & Silhouette Analysis ---
  const mlL7 = await LessonModel.create({
    moduleId: mlMod4._id,
    courseId: mlCourse._id,
    title: `K-Means Clustering, Inertia & Silhouette Analysis`,
    description: `Understand Lloyd's algorithm, Voronoi partitions, cluster inertia, and the Elbow method.`,
    order: 1,
    activities: [],
  });

  const mlL7_Video = await ActivityModel.create({
    lessonId: mlL7._id,
    type: 'VIDEO',
    title: `Video: K-Means Clustering & Evaluation Metrics`,
    order: 1,
    resourceRef: getRes('K-Nearest Neighbors Algorithm in Tamil')?._id,
    content: `# Key Takeaways:
- K-Means partitions unlabeled data into K clusters by iteratively updating centroids.
- Inertia measures within-cluster sum of squared distances.
- Silhouette score evaluates cluster separation vs cohesion between -1 and +1.`,
  });

  const mlL7_Notes = await ActivityModel.create({
    lessonId: mlL7._id,
    type: 'NOTES',
    title: `Codexa Notes: K-Means Clustering, Inertia & Silhouette Analysis`,
    order: 2,
    content: `# K-Means Clustering, Inertia & Silhouette Analysis

Understand Lloyd's algorithm, Voronoi partitions, cluster inertia, and the Elbow method.

K-Means discovers latent groupings within unlabeled multi-dimensional data.

---

### Lloyd's Algorithm
1. Initialize $K$ centroids randomly (or via K-Means++).
2. **Assignment Step**: Assign each data point $x_i$ to its nearest centroid $c_k$:
$$z_i = rg\\min_k \\|x_i - c_k\\|^2$$
3. **Update Step**: Recompute each centroid as the arithmetic mean of its assigned points:
$$c_k = rac{1}{|S_k|}\\sum_{x \\in S_k} x$$
4. Repeat until centroids converge.

### Determining Optimal K
- **Elbow Method**: Look for inflection point in Inertia vs $K$ curve.
- **Silhouette Coefficient**: $s(i) = rac{b(i) - a(i)}{\\max(a(i), b(i))}$ (1 = well clustered, 0 = overlapping, -1 = misclassified).

## Why K-Means Clustering, Inertia & Silhouette Analysis Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
def assign_clusters(points, centroids):
    assignments = []
    for p in points:
        distances = [abs(p - c) for c in centroids]
        nearest_idx = distances.index(min(distances))
        assignments.append(nearest_idx)
    return assignments
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Calculate abs(p - c) for each centroid

> ⚠️ **Common Mistake**: K-Means++ samples initial centroids proportional to their squared distance from existing centroids, spreading them out across data space and preventing suboptimal local clustering traps.

## Real-World Production Scenario

In production engineering, **K-Means Clustering, Inertia & Silhouette Analysis** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of K-Means Clustering, Inertia & Silhouette Analysis. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Scikit-Learn User Guide')?._id,
  });

  const mlL7_Challenge = await ChallengeModel.create({
    title: `Assign Points to Nearest Centroid`,
    description: `Write a Python function \`assign_clusters(points, centroids)\` where \`points\` is a list of numbers and \`centroids\` is a list of numbers. Return a list of centroid indices \`[0, 1, ...]\` representing the nearest centroid for each point.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def assign_clusters(points, centroids):
    # Return list of assigned cluster indices
    pass
`,
    solutionCode: `def assign_clusters(points, centroids):
    assignments = []
    for p in points:
        distances = [abs(p - c) for c in centroids]
        nearest_idx = distances.index(min(distances))
        assignments.append(nearest_idx)
    return assignments`,
    hints: ["Calculate abs(p - c) for each centroid", "Find index of minimum distance using .index(min(...))"],
    skills: [{"skillId": "machine-learning", "weight": 1.0}],
    testCases: [{"input": "assign_clusters([1, 2, 8, 9], [0, 10])", "expectedOutput": "[0, 0, 1, 1]", "description": "Assigns points to closest cluster center", "hidden": false}],
  });

  const mlL7_Practice = await ActivityModel.create({
    lessonId: mlL7._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Assign Points to Nearest Centroid`,
    order: 3,
    challengeRef: mlL7_Challenge._id,
    content: `# Code Practice: Assign Points to Nearest Centroid\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mlL7_Challenge.activityId = mlL7_Practice._id;
  await mlL7_Challenge.save();

  const mlL7_Quiz = await AssessmentModel.create({
    title: `Assessment: K-Means Clustering`,
    description: `Test clustering mechanics and centroid optimization.`,
    passingScore: 70,
    skills: [{"skillId": "machine-learning", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary advantage of K-Means++ initialization over naive uniform random centroid initialization?",
        "options": [
            "It guarantees the optimal global clustering solution without iterations",
            "It spaces initial centroids far apart from each other based on probability, dramatically reducing convergence time and poor local minima",
            "It automatically finds the optimal value of K",
            "It removes outliers before clustering"
        ],
        "explanation": "K-Means++ samples initial centroids proportional to their squared distance from existing centroids, spreading them out across data space and preventing suboptimal local clustering traps.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const mlL7_Assessment = await ActivityModel.create({
    lessonId: mlL7._id,
    type: 'QUIZ',
    title: `Assessment: K-Means Clustering`,
    order: 4,
    assessmentRef: mlL7_Quiz._id,
  });
  mlL7_Quiz.activityId = mlL7_Assessment._id;
  await mlL7_Quiz.save();

  mlL7.activities = [
    mlL7_Video._id,
    mlL7_Notes._id,
    mlL7_Practice._id,
    mlL7_Assessment._id,
  ] as any;
  await mlL7.save();

  // --- Lesson 2: Principal Component Analysis (PCA) & Feature Reduction ---
  const mlL8 = await LessonModel.create({
    moduleId: mlMod4._id,
    courseId: mlCourse._id,
    title: `Principal Component Analysis (PCA) & Feature Reduction`,
    description: `Master covariance matrices, eigenvalues/eigenvectors, explained variance ratio, and orthogonal projection.`,
    order: 2,
    activities: [],
  });

  const mlL8_Video = await ActivityModel.create({
    lessonId: mlL8._id,
    type: 'VIDEO',
    title: `Video: Principal Component Analysis (PCA) Step-by-Step`,
    order: 1,
    resourceRef: getRes('Machine Learning Foundations in Tamil')?._id,
    content: `# Key Takeaways:
- PCA projects high-dimensional data onto orthogonal axes of maximum variance.
- Eigenvectors define principal directions; eigenvalues represent variance along each axis.
- Explained variance ratio helps decide how many components to retain.`,
  });

  const mlL8_Notes = await ActivityModel.create({
    lessonId: mlL8._id,
    type: 'NOTES',
    title: `Codexa Notes: Principal Component Analysis (PCA) & Feature Reduction`,
    order: 2,
    content: `# Principal Component Analysis (PCA) & Feature Reduction

Master covariance matrices, eigenvalues/eigenvectors, explained variance ratio, and orthogonal projection.

PCA reduces feature dimensionality while preserving the maximum possible dataset variance.

---

### Mathematical Pipeline
1. Center data by subtracting feature means: $ar{X} = X - \\mu$.
2. Compute sample covariance matrix: $\\Sigma = rac{1}{n-1} ar{X}^T ar{X}$.
3. Calculate eigenvalues $\\lambda_i$ and eigenvectors $v_i$: $\\Sigma v_i = \\lambda_i v_i$.
4. Sort eigenvectors in descending order of eigenvalues.
5. Project data into top $k$ principal axes: $Z = ar{X} W_k$.

### Explained Variance Ratio
$$	ext{Ratio}_j = rac{\\lambda_j}{\\sum_{i=1}^D \\lambda_i}$$

## Why Principal Component Analysis (PCA) & Feature Reduction Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
def compute_variance_ratios(eigenvalues):
    total = sum(eigenvalues)
    if total == 0:
        return [0.0 for _ in eigenvalues]
    return [round(ev / total, 4) for ev in eigenvalues]
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Calculate total sum of eigenvalues

> ⚠️ **Common Mistake**: PCA maximizes variance. If one feature has values in thousands and another in decimals, the large feature will dominate the principal components simply due to scale.

## Real-World Production Scenario

In production engineering, **Principal Component Analysis (PCA) & Feature Reduction** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Principal Component Analysis (PCA) & Feature Reduction. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Scikit-Learn User Guide')?._id,
  });

  const mlL8_Challenge = await ChallengeModel.create({
    title: `Calculate Explained Variance Ratios`,
    description: `Write a Python function \`compute_variance_ratios(eigenvalues)\` that calculates and returns a list of variance ratios \`[round(ev / total, 4) for ev in eigenvalues]\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def compute_variance_ratios(eigenvalues):
    # Return list of explained variance ratios
    pass
`,
    solutionCode: `def compute_variance_ratios(eigenvalues):
    total = sum(eigenvalues)
    if total == 0:
        return [0.0 for _ in eigenvalues]
    return [round(ev / total, 4) for ev in eigenvalues]`,
    hints: ["Calculate total sum of eigenvalues", "Divide each eigenvalue by total sum and round to 4 decimals"],
    skills: [{"skillId": "python-data-science", "weight": 1.0}],
    testCases: [{"input": "compute_variance_ratios([60, 30, 10])", "expectedOutput": "[0.6, 0.3, 0.1]", "description": "Calculates variance proportions", "hidden": false}],
  });

  const mlL8_Practice = await ActivityModel.create({
    lessonId: mlL8._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Calculate Explained Variance Ratios`,
    order: 3,
    challengeRef: mlL8_Challenge._id,
    content: `# Code Practice: Calculate Explained Variance Ratios\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  mlL8_Challenge.activityId = mlL8_Practice._id;
  await mlL8_Challenge.save();

  const mlL8_Quiz = await AssessmentModel.create({
    title: `Assessment: PCA & Dimensionality`,
    description: `Test linear projections, covariance, and component selection.`,
    passingScore: 70,
    skills: [{"skillId": "machine-learning", "weight": 1.0}],
    questions: [
    {
        "question": "Why must features be standardized (mean=0, variance=1) before applying PCA?",
        "options": [
            "PCA throws a math domain exception on unstandardized data",
            "Features with larger numerical scales will artificially dominate the principal variance directions regardless of their actual informative value",
            "PCA only works on numbers between -1 and 1",
            "To convert categorical strings into numbers"
        ],
        "explanation": "PCA maximizes variance. If one feature has values in thousands and another in decimals, the large feature will dominate the principal components simply due to scale.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const mlL8_Assessment = await ActivityModel.create({
    lessonId: mlL8._id,
    type: 'QUIZ',
    title: `Assessment: PCA & Dimensionality`,
    order: 4,
    assessmentRef: mlL8_Quiz._id,
  });
  mlL8_Quiz.activityId = mlL8_Assessment._id;
  await mlL8_Quiz.save();

  mlL8.activities = [
    mlL8_Video._id,
    mlL8_Notes._id,
    mlL8_Practice._id,
    mlL8_Assessment._id,
  ] as any;
  await mlL8.save();

  mlMod4.lessons = [mlL7._id, mlL8._id] as any;
  await mlMod4.save();

  mlCourse.modules = [mlMod1._id, mlMod2._id, mlMod3._id, mlMod4._id] as any;
  await mlCourse.save();

  // =========================================================================
  // 2. DEEP LEARNING & NEURAL ARCHITECTURES (4 MODULES, 8 LESSONS)
  // =========================================================================
  const dlCourse = await CourseModel.create({
    slug: 'deep-learning',
    title: 'Deep Learning & Neural Network Architectures',
    description: 'Master Multi-Layer Perceptrons, Backpropagation mathematics, Convolutional Neural Networks (CNNs), Recurrent Networks (LSTMs), and Transformer Self-Attention with PyTorch.',
    domain: 'AI & Machine Learning',
    level: 'ADVANCED',
    status: 'PUBLISHED',
    estimatedHours: 45,
    skillsCovered: ['deep-learning', 'pytorch', 'computer-vision', 'transformers'],
    prerequisites: ['Machine learning foundations', 'Linear algebra', 'Python proficiency'],
    modules: [],
  });

  const dlMod1 = await ModuleModel.create({
    courseId: dlCourse._id,
    title: `Module 1: Neural Foundations & Backpropagation Math`,
    description: `Perceptrons, Multi-Layer Perceptrons (MLPs), non-linear activation functions (ReLU, GELU), loss gradients, and automatic differentiation.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: Perceptrons, Activation Functions & Multi-Layer Networks ---
  const dlL1 = await LessonModel.create({
    moduleId: dlMod1._id,
    courseId: dlCourse._id,
    title: `Perceptrons, Activation Functions & Multi-Layer Networks`,
    description: `Understand linear combinations, non-linear activations (ReLU, Sigmoid, Softmax), and universal approximation theorem.`,
    order: 1,
    activities: [],
  });

  const dlL1_Video = await ActivityModel.create({
    lessonId: dlL1._id,
    type: 'VIDEO',
    title: `Video: But what is a neural network? | Chapter 1, Deep learning`,
    order: 1,
    resourceRef: getRes('Deep Learning and Artificial Neural Networks in Tamil')?._id,
    content: `# Key Takeaways:
- Artificial neurons compute affine transformations (W*x + b) followed by non-linear activations.
- Non-linearities (ReLU) enable networks to approximate arbitrary continuous functions.
- Softmax normalizes output logits into a valid multi-class probability distribution.`,
  });

  const dlL1_Notes = await ActivityModel.create({
    lessonId: dlL1._id,
    type: 'NOTES',
    title: `Codexa Notes: Perceptrons, Activation Functions & Multi-Layer Networks`,
    order: 2,
    content: `# Perceptrons, Activation Functions & Multi-Layer Networks

Understand linear combinations, non-linear activations (ReLU, Sigmoid, Softmax), and universal approximation theorem.

Neural networks stack non-linear layers to learn hierarchical representations directly from raw inputs.

---

### 1. Neuron Computation
$$z = \\sum_{j=1}^D w_j x_j + b = \\mathbf{w}^T \\mathbf{x} + b$$
$$a = \\sigma(z)$$

### 2. Modern Activation Functions
- **ReLU (Rectified Linear Unit)**: $f(x) = \\max(0, x)$ (prevents vanishing gradients in positive regime).
- **LeakyReLU**: $f(x) = \\max(lpha x, x)$ with $lpha = 0.01$.
- **GELU (Gaussian Error Linear Unit)**: Used in modern Transformers (GPT/BERT).
- **Softmax (Multi-class output)**: $\\sigma(\\mathbf{z})_i = rac{e^{z_i}}{\\sum_{j=1}^K e^{z_j}}$

## Why Perceptrons, Activation Functions & Multi-Layer Networks Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
import math

def softmax(logits):
    if not logits:
        return []
    max_val = max(logits)
    exp_vals = [math.exp(x - max_val) for x in logits]
    total = sum(exp_vals)
    return [round(x / total, 4) for x in exp_vals]
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Subtract max(logits) before exponentiating

> ⚠️ **Common Mistake**: The composition of linear functions is always another linear function. Without non-linear activations, stacking multiple layers adds zero expressive capacity over a single linear layer.

## Real-World Production Scenario

In production engineering, **Perceptrons, Activation Functions & Multi-Layer Networks** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Perceptrons, Activation Functions & Multi-Layer Networks. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('PyTorch Tutorials: Deep Learning')?._id,
  });

  const dlL1_Challenge = await ChallengeModel.create({
    title: `Implement ReLU and Softmax Functions`,
    description: `Write a Python function \`softmax(logits)\` that takes a list of numeric logits, applies \`exp(x - max(logits))\` for numerical stability, and returns a list of normalized probabilities summing to 1.0.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `import math

def softmax(logits):
    # Return list of normalized probabilities
    pass
`,
    solutionCode: `import math

def softmax(logits):
    if not logits:
        return []
    max_val = max(logits)
    exp_vals = [math.exp(x - max_val) for x in logits]
    total = sum(exp_vals)
    return [round(x / total, 4) for x in exp_vals]`,
    hints: ["Subtract max(logits) before exponentiating", "Divide each exp by total sum"],
    skills: [{"skillId": "deep-learning", "weight": 1.0}],
    testCases: [{"input": "softmax([1.0, 2.0, 3.0])", "expectedOutput": "[0.09, 0.2447, 0.6652]", "description": "Computes stable softmax probabilities", "hidden": false}],
  });

  const dlL1_Practice = await ActivityModel.create({
    lessonId: dlL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Implement ReLU and Softmax Functions`,
    order: 3,
    challengeRef: dlL1_Challenge._id,
    content: `# Code Practice: Implement ReLU and Softmax Functions\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  dlL1_Challenge.activityId = dlL1_Practice._id;
  await dlL1_Challenge.save();

  const dlL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Activation Functions & MLPs`,
    description: `Test understanding of non-linear activations and universal approximation.`,
    passingScore: 70,
    skills: [{"skillId": "deep-learning", "weight": 1.0}],
    questions: [
    {
        "question": "What happens if all activation functions in a 100-layer deep neural network are purely linear (f(x) = x)?",
        "options": [
            "The network trains 100 times faster",
            "The entire 100-layer network collapses mathematically into a single simple linear regression model: W_combined * x + b",
            "The network achieves perfect accuracy",
            "The weights explode to infinity"
        ],
        "explanation": "The composition of linear functions is always another linear function. Without non-linear activations, stacking multiple layers adds zero expressive capacity over a single linear layer.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const dlL1_Assessment = await ActivityModel.create({
    lessonId: dlL1._id,
    type: 'QUIZ',
    title: `Assessment: Activation Functions & MLPs`,
    order: 4,
    assessmentRef: dlL1_Quiz._id,
  });
  dlL1_Quiz.activityId = dlL1_Assessment._id;
  await dlL1_Quiz.save();

  dlL1.activities = [
    dlL1_Video._id,
    dlL1_Notes._id,
    dlL1_Practice._id,
    dlL1_Assessment._id,
  ] as any;
  await dlL1.save();

  // --- Lesson 2: Backpropagation Mathematics & Gradient Descent Optimizers ---
  const dlL2 = await LessonModel.create({
    moduleId: dlMod1._id,
    courseId: dlCourse._id,
    title: `Backpropagation Mathematics & Gradient Descent Optimizers`,
    description: `Derive the Chain Rule of calculus for matrix gradients, Adam optimizer, and learning rate scheduling.`,
    order: 2,
    activities: [],
  });

  const dlL2_Video = await ActivityModel.create({
    lessonId: dlL2._id,
    type: 'VIDEO',
    title: `Video: Backpropagation calculus | Chapter 4, Deep learning`,
    order: 1,
    resourceRef: getRes('Chain Rule and Backpropagation Mechanics in Tamil')?._id,
    content: `# Key Takeaways:
- Backpropagation applies the multivariable chain rule backwards from loss to input weights.
- Computational graphs compute partial derivatives automatically via reverse-mode auto-diff.
- Adam optimizer combines Momentum (1st moment) and RMSprop (2nd moment) adaptive learning rates.`,
  });

  const dlL2_Notes = await ActivityModel.create({
    lessonId: dlL2._id,
    type: 'NOTES',
    title: `Codexa Notes: Backpropagation Mathematics & Gradient Descent Optimizers`,
    order: 2,
    content: `# Backpropagation Mathematics & Gradient Descent Optimizers

Derive the Chain Rule of calculus for matrix gradients, Adam optimizer, and learning rate scheduling.

Backpropagation computes analytical gradients of a scalar loss function with respect to all network weights.

---

### The Multivariable Chain Rule
For output $a^{(L)}$, pre-activation $z^{(L)} = W^{(L)} a^{(L-1)} + b^{(L)}$, and scalar loss $\\mathcal{L}$:
$$rac{\\partial \\mathcal{L}}{\\partial W^{(L)}} = rac{\\partial \\mathcal{L}}{\\partial a^{(L)}} \\cdot rac{\\partial a^{(L)}}{\\partial z^{(L)}} \\cdot rac{\\partial z^{(L)}}{\\partial W^{(L)}} = \\delta^{(L)} (a^{(L-1)})^T$$
$$\\delta^{(l)} = \\left((W^{(l+1)})^T \\delta^{(l+1)}
ight) \\odot \\sigma'(z^{(l)})$$

### Adam Optimizer Formulation
$$m_t = eta_1 m_{t-1} + (1 - eta_1) g_t, \\quad v_t = eta_2 v_{t-1} + (1 - eta_2) g_t^2$$
$$\\hat{m}_t = rac{m_t}{1 - eta_1^t}, \\quad \\hat{v}_t = rac{v_t}{1 - eta_2^t}$$
$$	heta_t = 	heta_{t-1} - rac{\\eta}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t$$

## Why Backpropagation Mathematics & Gradient Descent Optimizers Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
def sgd_update(weights, gradients, lr):
    return [round(w - lr * g, 4) for w, g in zip(weights, gradients)]
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: w_new = w - lr * g

> ⚠️ **Common Mistake**: Adam combines momentum (smoothing gradient direction via moving average) with RMSprop (adapting individual parameter learning rates based on historical gradient variance).

## Real-World Production Scenario

In production engineering, **Backpropagation Mathematics & Gradient Descent Optimizers** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Backpropagation Mathematics & Gradient Descent Optimizers. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('PyTorch Tutorials: Deep Learning')?._id,
  });

  const dlL2_Challenge = await ChallengeModel.create({
    title: `Implement Gradient Descent Parameter Update`,
    description: `Write a Python function \`sgd_update(weights, gradients, lr)\` that returns updated weights \`w - lr * g\` for each weight in the list.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def sgd_update(weights, gradients, lr):
    # Return list of updated float weights
    pass
`,
    solutionCode: `def sgd_update(weights, gradients, lr):
    return [round(w - lr * g, 4) for w, g in zip(weights, gradients)]`,
    hints: ["w_new = w - lr * g", "Round to 4 decimals"],
    skills: [{"skillId": "deep-learning", "weight": 1.0}],
    testCases: [{"input": "sgd_update([1.0, 2.0], [0.5, -0.2], 0.1)", "expectedOutput": "[0.95, 2.02]", "description": "Updates weights along negative gradient", "hidden": false}],
  });

  const dlL2_Practice = await ActivityModel.create({
    lessonId: dlL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Implement Gradient Descent Parameter Update`,
    order: 3,
    challengeRef: dlL2_Challenge._id,
    content: `# Code Practice: Implement Gradient Descent Parameter Update\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  dlL2_Challenge.activityId = dlL2_Practice._id;
  await dlL2_Challenge.save();

  const dlL2_Quiz = await AssessmentModel.create({
    title: `Assessment: Backpropagation & Auto-Diff`,
    description: `Test chain rule mechanics and optimizer behavior.`,
    passingScore: 70,
    skills: [{"skillId": "deep-learning", "weight": 1.0}],
    questions: [
    {
        "question": "Why does the Adam optimizer track both the first moment (m) and second moment (v) of past gradients?",
        "options": [
            "To calculate second-order Hessian matrix inversions",
            "The first moment provides directional momentum while the second moment scales learning rates inversely to gradient magnitude (RMSprop adaptive scaling)",
            "To eliminate the need for training labels",
            "To compress neural network checkpoints"
        ],
        "explanation": "Adam combines momentum (smoothing gradient direction via moving average) with RMSprop (adapting individual parameter learning rates based on historical gradient variance).",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const dlL2_Assessment = await ActivityModel.create({
    lessonId: dlL2._id,
    type: 'QUIZ',
    title: `Assessment: Backpropagation & Auto-Diff`,
    order: 4,
    assessmentRef: dlL2_Quiz._id,
  });
  dlL2_Quiz.activityId = dlL2_Assessment._id;
  await dlL2_Quiz.save();

  dlL2.activities = [
    dlL2_Video._id,
    dlL2_Notes._id,
    dlL2_Practice._id,
    dlL2_Assessment._id,
  ] as any;
  await dlL2.save();

  dlMod1.lessons = [dlL1._id, dlL2._id] as any;
  await dlMod1.save();

  const dlMod2 = await ModuleModel.create({
    courseId: dlCourse._id,
    title: `Module 2: Computer Vision & Convolutional Networks (CNNs)`,
    description: `Master 2D Convolutions, padding, stride, pooling layers, ResNet skip connections, and Transfer Learning.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Convolution Operations, Pooling & Spatial Feature Maps ---
  const dlL3 = await LessonModel.create({
    moduleId: dlMod2._id,
    courseId: dlCourse._id,
    title: `Convolution Operations, Pooling & Spatial Feature Maps`,
    description: `Understand kernel filters, edge detection, valid vs same padding, stride arithmetic, and max pooling.`,
    order: 1,
    activities: [],
  });

  const dlL3_Video = await ActivityModel.create({
    lessonId: dlL3._id,
    type: 'VIDEO',
    title: `Video: Convolutional Neural Networks (CNNs) Explained`,
    order: 1,
    resourceRef: getRes('Training a Neural Network and Loss Functions in Tamil')?._id,
    content: `# Key Takeaways:
- Convolutions exploit translation invariance and local spatial correlation in images.
- Learnable kernel filters slide across input channels to extract feature maps.
- Max pooling downsamples spatial dimensions, expanding the receptive field.`,
  });

  const dlL3_Notes = await ActivityModel.create({
    lessonId: dlL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Convolution Operations, Pooling & Spatial Feature Maps`,
    order: 2,
    content: `# Convolution Operations, Pooling & Spatial Feature Maps

Understand kernel filters, edge detection, valid vs same padding, stride arithmetic, and max pooling.

CNNs introduce parameter sharing and local receptive fields tailored for grid-like spatial data.

---

### 1. 2D Convolution Formula
For input image $I$ and kernel filter $K$ of size $k 	imes k$:
$$S(i, j) = (I * K)(i, j) = \\sum_{m} \\sum_{n} I(i-m, j-n) K(m, n)$$

### 2. Output Spatial Dimension Formula
Given input dimension $W$, filter size $F$, padding $P$, and stride $S$:
$$W_{	ext{out}} = \\left\\lfloor rac{W - F + 2P}{S} 
ight
floor + 1$$

\`\`\`python
# Example: 32x32 image with 3x3 filter, padding=1, stride=1 -> (32 - 3 + 2)/1 + 1 = 32 (SAME padding)
\`\`\`

## Why Convolution Operations, Pooling & Spatial Feature Maps Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use integer division // for floor((W - F + 2P)/S) + 1

> ⚠️ **Common Mistake**: Parameter sharing allows a single kernel to detect a feature (like an edge or texture) anywhere in the image, reducing weights by orders of magnitude compared to dense layers.

## Real-World Production Scenario

In production engineering, **Convolution Operations, Pooling & Spatial Feature Maps** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Convolution Operations, Pooling & Spatial Feature Maps. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('PyTorch Tutorials: Deep Learning')?._id,
  });

  const dlL3_Challenge = await ChallengeModel.create({
    title: `Calculate CNN Output Spatial Dimensions`,
    description: `Write a Python function \`calc_conv_output_dim(input_dim, filter_size, padding, stride)\` implementing the formula \`floor((input_dim - filter_size + 2 * padding) / stride) + 1\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def calc_conv_output_dim(input_dim, filter_size, padding, stride):
    # Return integer output dimension
    pass
`,
    solutionCode: `def calc_conv_output_dim(input_dim, filter_size, padding, stride):
    return ((input_dim - filter_size + 2 * padding) // stride) + 1`,
    hints: ["Use integer division // for floor((W - F + 2P)/S) + 1"],
    skills: [{"skillId": "computer-vision", "weight": 1.0}],
    testCases: [{"input": "calc_conv_output_dim(224, 7, 3, 2)", "expectedOutput": "112", "description": "Calculates ResNet stem conv output dimension", "hidden": false}],
  });

  const dlL3_Practice = await ActivityModel.create({
    lessonId: dlL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Calculate CNN Output Spatial Dimensions`,
    order: 3,
    challengeRef: dlL3_Challenge._id,
    content: `# Code Practice: Calculate CNN Output Spatial Dimensions\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  dlL3_Challenge.activityId = dlL3_Practice._id;
  await dlL3_Challenge.save();

  const dlL3_Quiz = await AssessmentModel.create({
    title: `Assessment: CNN Convolutions`,
    description: `Test convolutional receptive fields and dimension calculations.`,
    passingScore: 70,
    skills: [{"skillId": "computer-vision", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary architectural benefit of parameter sharing in convolutional layers compared to fully connected layers?",
        "options": [
            "It completely removes the need for activation functions",
            "The same kernel weights are applied across all spatial locations, drastically reducing parameter count and enforcing translation equivariance",
            "It forces all feature map values to be positive",
            "It automatically classifies images without a classifier head"
        ],
        "explanation": "Parameter sharing allows a single kernel to detect a feature (like an edge or texture) anywhere in the image, reducing weights by orders of magnitude compared to dense layers.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const dlL3_Assessment = await ActivityModel.create({
    lessonId: dlL3._id,
    type: 'QUIZ',
    title: `Assessment: CNN Convolutions`,
    order: 4,
    assessmentRef: dlL3_Quiz._id,
  });
  dlL3_Quiz.activityId = dlL3_Assessment._id;
  await dlL3_Quiz.save();

  dlL3.activities = [
    dlL3_Video._id,
    dlL3_Notes._id,
    dlL3_Practice._id,
    dlL3_Assessment._id,
  ] as any;
  await dlL3.save();

  // --- Lesson 2: Modern CNN Architectures, ResNet & Transfer Learning ---
  const dlL4 = await LessonModel.create({
    moduleId: dlMod2._id,
    courseId: dlCourse._id,
    title: `Modern CNN Architectures, ResNet & Transfer Learning`,
    description: `Explore Residual Connections (ResNet), vanishing gradient mitigation, fine-tuning pretrained vision backbones.`,
    order: 2,
    activities: [],
  });

  const dlL4_Video = await ActivityModel.create({
    lessonId: dlL4._id,
    type: 'VIDEO',
    title: `Video: ResNet & Deep Residual Learning Explained`,
    order: 1,
    resourceRef: getRes('Vanishing and Exploding Gradient Problem in Tamil')?._id,
    content: `# Key Takeaways:
- Deep networks suffer from degradation/vanishing gradients during backprop.
- ResNet introduces identity shortcut connections: F(x) + x.
- Transfer learning fine-tunes pretrained ImageNet backbones on custom datasets with minimal samples.`,
  });

  const dlL4_Notes = await ActivityModel.create({
    lessonId: dlL4._id,
    type: 'NOTES',
    title: `Codexa Notes: Modern CNN Architectures, ResNet & Transfer Learning`,
    order: 2,
    content: `# Modern CNN Architectures, ResNet & Transfer Learning

Explore Residual Connections (ResNet), vanishing gradient mitigation, fine-tuning pretrained vision backbones.

Residual networks enabled training networks with hundreds of layers (e.g., ResNet-50, ResNet-152) without degradation.

---

### The Residual Block Formulation
Instead of fitting an underlying mapping $\\mathcal{H}(x)$, residual layers fit a residual mapping $\\mathcal{F}(x) = \\mathcal{H}(x) - x$:
$$\\mathbf{y} = \\mathcal{F}(\\mathbf{x}, \\{W_i\\}) + \\mathbf{x}$$

### Why Skip Connections Work
During backpropagation, gradients propagate directly through the identity shortcut:
$$rac{\\partial \\mathcal{L}}{\\partial \\mathbf{x}} = rac{\\partial \\mathcal{L}}{\\partial \\mathbf{y}} \\left( rac{\\partial \\mathcal{F}}{\\partial \\mathbf{x}} + \\mathbf{I} 
ight)$$
The identity matrix $\\mathbf{I}$ ensures gradients never vanish, even if $rac{\\partial \\mathcal{F}}{\\partial \\mathbf{x}} 	o 0$.

## Practical Code Example

\`\`\`python
def residual_block(x, fx):
    return [max(0.0, a + b) for a, b in zip(x, fx)]
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Add corresponding elements a + b

> ⚠️ **Common Mistake**: The identity connection creates a direct additive gradient path during backprop, ensuring that error signals flow directly to early layers without degrading.

## Real-World Production Scenario

In production engineering, **Modern CNN Architectures, ResNet & Transfer Learning** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Modern CNN Architectures, ResNet & Transfer Learning. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('PyTorch Tutorials: Deep Learning')?._id,
  });

  const dlL4_Challenge = await ChallengeModel.create({
    title: `Implement Residual Addition Block`,
    description: `Write a Python function \`residual_block(x, fx)\` that adds two 1D lists element-wise: \`[a + b for a, b in zip(x, fx)]\` and applies ReLU \`max(0, val)\` to each element.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def residual_block(x, fx):
    # Return list of ReLU(x + fx)
    pass
`,
    solutionCode: `def residual_block(x, fx):
    return [max(0.0, a + b) for a, b in zip(x, fx)]`,
    hints: ["Add corresponding elements a + b", "Apply max(0.0, ...) for ReLU"],
    skills: [{"skillId": "computer-vision", "weight": 1.0}],
    testCases: [{"input": "residual_block([1.0, -2.0, 3.0], [-2.0, 1.0, 2.0])", "expectedOutput": "[0.0, 0.0, 5.0]", "description": "Computes ReLU(x + F(x))", "hidden": false}],
  });

  const dlL4_Practice = await ActivityModel.create({
    lessonId: dlL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Implement Residual Addition Block`,
    order: 3,
    challengeRef: dlL4_Challenge._id,
    content: `# Code Practice: Implement Residual Addition Block\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  dlL4_Challenge.activityId = dlL4_Practice._id;
  await dlL4_Challenge.save();

  const dlL4_Quiz = await AssessmentModel.create({
    title: `Assessment: ResNet & Skip Connections`,
    description: `Assess residual learning theory and transfer learning setups.`,
    passingScore: 70,
    skills: [{"skillId": "computer-vision", "weight": 1.0}],
    questions: [
    {
        "question": "Why do identity skip connections in ResNet effectively resolve the vanishing gradient problem in very deep networks?",
        "options": [
            "They convert all weights into constants",
            "They provide an uninterrupted gradient highway during backpropagation because the derivative of the identity addition term with respect to input is the identity matrix I",
            "They eliminate the need for training epochs",
            "They automatically downsample images"
        ],
        "explanation": "The identity connection creates a direct additive gradient path during backprop, ensuring that error signals flow directly to early layers without degrading.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const dlL4_Assessment = await ActivityModel.create({
    lessonId: dlL4._id,
    type: 'QUIZ',
    title: `Assessment: ResNet & Skip Connections`,
    order: 4,
    assessmentRef: dlL4_Quiz._id,
  });
  dlL4_Quiz.activityId = dlL4_Assessment._id;
  await dlL4_Quiz.save();

  dlL4.activities = [
    dlL4_Video._id,
    dlL4_Notes._id,
    dlL4_Practice._id,
    dlL4_Assessment._id,
  ] as any;
  await dlL4.save();

  dlMod2.lessons = [dlL3._id, dlL4._id] as any;
  await dlMod2.save();

  const dlMod3 = await ModuleModel.create({
    courseId: dlCourse._id,
    title: `Module 3: Sequence Modeling, RNNs & LSTMs`,
    description: `Master recurrent networks, hidden states, vanishing gradients in time, Long Short-Term Memory (LSTM), and Gated Recurrent Units (GRUs).`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: Recurrent Neural Networks (RNNs) & Hidden States ---
  const dlL5 = await LessonModel.create({
    moduleId: dlMod3._id,
    courseId: dlCourse._id,
    title: `Recurrent Neural Networks (RNNs) & Hidden States`,
    description: `Explore temporal recurrence, unrolling in time, Backpropagation Through Time (BPTT), and vanishing gradients.`,
    order: 1,
    activities: [],
  });

  const dlL5_Video = await ActivityModel.create({
    lessonId: dlL5._id,
    type: 'VIDEO',
    title: `Video: Recurrent Neural Networks (RNNs) & LSTMs Explained`,
    order: 1,
    resourceRef: getRes('Multilayer Perceptrons and Hidden Representations in Tamil')?._id,
    content: `# Key Takeaways:
- RNNs maintain an internal hidden state h_t across sequential time steps.
- BPTT unrolls the network across time, causing exponential gradient decay/explosion.
- Vanilla RNNs struggle to retain long-range context beyond ~10 steps.`,
  });

  const dlL5_Notes = await ActivityModel.create({
    lessonId: dlL5._id,
    type: 'NOTES',
    title: `Codexa Notes: Recurrent Neural Networks (RNNs) & Hidden States`,
    order: 2,
    content: `# Recurrent Neural Networks (RNNs) & Hidden States

Explore temporal recurrence, unrolling in time, Backpropagation Through Time (BPTT), and vanishing gradients.

RNNs process variable-length sequential data (text, time-series, audio) by sharing parameters across time steps.

---

### Hidden State Formulation
At each time step $t$:
$$\\mathbf{h}_t = 	anh(\\mathbf{W}_{hh} \\mathbf{h}_{t-1} + \\mathbf{W}_{xh} \\mathbf{x}_t + \\mathbf{b}_h)$$
$$\\mathbf{y}_t = 	ext{Softmax}(\\mathbf{W}_{hy} \\mathbf{h}_t + \\mathbf{b}_y)$$

### The Vanishing Gradient Dilemma in Time
When unrolled for $T$ steps:
$$rac{\\partial \\mathcal{L}_T}{\\partial \\mathbf{h}_1} = rac{\\partial \\mathcal{L}_T}{\\partial \\mathbf{h}_T} \\prod_{t=2}^T rac{\\partial \\mathbf{h}_t}{\\partial \\mathbf{h}_{t-1}} = rac{\\partial \\mathcal{L}_T}{\\partial \\mathbf{h}_T} \\prod_{t=2}^T 	ext{diag}(1 - \\mathbf{h}_t^2) \\mathbf{W}_{hh}^T$$
Repeated multiplication by $\\mathbf{W}_{hh}$ causes gradients to decay exponentially to zero if eigenvalues $< 1$.

## Why Recurrent Neural Networks (RNNs) & Hidden States Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
import math

def rnn_step(x_t, h_prev, w_x, w_h, bias):
    z = (w_x * x_t) + (w_h * h_prev) + bias
    return round(math.tanh(z), 4)
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Calculate z = w_x * x_t + w_h * h_prev + bias

> ⚠️ **Common Mistake**: Unrolling long temporal sequences causes gradients to be repeatedly multiplied by the same recurrent weight matrix W_hh, causing exponential shrinkage.

## Real-World Production Scenario

In production engineering, **Recurrent Neural Networks (RNNs) & Hidden States** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Recurrent Neural Networks (RNNs) & Hidden States. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('PyTorch Tutorials: Deep Learning')?._id,
  });

  const dlL5_Challenge = await ChallengeModel.create({
    title: `Compute Single Step RNN Hidden State`,
    description: `Write a Python function \`rnn_step(x_t, h_prev, w_x, w_h, bias)\` that computes \`math.tanh(w_x * x_t + w_h * h_prev + bias)\` rounded to 4 decimals.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `import math

def rnn_step(x_t, h_prev, w_x, w_h, bias):
    # Return float hidden state
    pass
`,
    solutionCode: `import math

def rnn_step(x_t, h_prev, w_x, w_h, bias):
    z = (w_x * x_t) + (w_h * h_prev) + bias
    return round(math.tanh(z), 4)`,
    hints: ["Calculate z = w_x * x_t + w_h * h_prev + bias", "Apply math.tanh(z) and round"],
    skills: [{"skillId": "deep-learning", "weight": 1.0}],
    testCases: [{"input": "rnn_step(1.0, 0.5, 0.8, 0.4, 0.1)", "expectedOutput": "0.8005", "description": "Computes RNN hidden state activation", "hidden": false}],
  });

  const dlL5_Practice = await ActivityModel.create({
    lessonId: dlL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Compute Single Step RNN Hidden State`,
    order: 3,
    challengeRef: dlL5_Challenge._id,
    content: `# Code Practice: Compute Single Step RNN Hidden State\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  dlL5_Challenge.activityId = dlL5_Practice._id;
  await dlL5_Challenge.save();

  const dlL5_Quiz = await AssessmentModel.create({
    title: `Assessment: RNN Mechanics`,
    description: `Test understanding of recurrent recurrence and BPTT bottlenecks.`,
    passingScore: 70,
    skills: [{"skillId": "deep-learning", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary cause of vanishing gradients during Backpropagation Through Time (BPTT) in standard RNNs?",
        "options": [
            "Too many training samples",
            "Repeated matrix multiplications by the recurrent weight matrix W_hh across multiple time steps in long sequences",
            "Using integer data types",
            "Dropout layers"
        ],
        "explanation": "Unrolling long temporal sequences causes gradients to be repeatedly multiplied by the same recurrent weight matrix W_hh, causing exponential shrinkage.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const dlL5_Assessment = await ActivityModel.create({
    lessonId: dlL5._id,
    type: 'QUIZ',
    title: `Assessment: RNN Mechanics`,
    order: 4,
    assessmentRef: dlL5_Quiz._id,
  });
  dlL5_Quiz.activityId = dlL5_Assessment._id;
  await dlL5_Quiz.save();

  dlL5.activities = [
    dlL5_Video._id,
    dlL5_Notes._id,
    dlL5_Practice._id,
    dlL5_Assessment._id,
  ] as any;
  await dlL5.save();

  // --- Lesson 2: Long Short-Term Memory (LSTM) & Gated Recurrent Units (GRU) ---
  const dlL6 = await LessonModel.create({
    moduleId: dlMod3._id,
    courseId: dlCourse._id,
    title: `Long Short-Term Memory (LSTM) & Gated Recurrent Units (GRU)`,
    description: `Master Forget, Input, and Output gates, Cell state conveyor belts, and additive gradient highways.`,
    order: 2,
    activities: [],
  });

  const dlL6_Video = await ActivityModel.create({
    lessonId: dlL6._id,
    type: 'VIDEO',
    title: `Video: Illustrated Guide to LSTM and GRU Networks`,
    order: 1,
    resourceRef: getRes('Dropout Layers and Neural Network Regularization in Tamil')?._id,
    content: `# Key Takeaways:
- LSTMs solve vanishing gradients via an explicit additive Cell State (C_t).
- Gates (Forget, Input, Output) use sigmoid activations (0 to 1) to regulate information flow.
- GRUs simplify LSTMs into Update and Reset gates with fewer parameters.`,
  });

  const dlL6_Notes = await ActivityModel.create({
    lessonId: dlL6._id,
    type: 'NOTES',
    title: `Codexa Notes: Long Short-Term Memory (LSTM) & Gated Recurrent Units (GRU)`,
    order: 2,
    content: `# Long Short-Term Memory (LSTM) & Gated Recurrent Units (GRU)

Master Forget, Input, and Output gates, Cell state conveyor belts, and additive gradient highways.

LSTMs introduce gated memory cells that preserve long-range dependencies over hundreds of time steps.

---

### The LSTM Gating Equations
1. **Forget Gate**: $f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f)$ (what to erase from memory).
2. **Input Gate**: $i_t = \\sigma(W_i [h_{t-1}, x_t] + b_i)$ (what new info to store).
3. **Candidate Cell State**: $	ilde{C}_t = 	anh(W_c [h_{t-1}, x_t] + b_c)$.
4. **Cell State Update**: $C_t = f_t \\odot C_{t-1} + i_t \\odot 	ilde{C}_t$ (linear additive conveyor belt).
5. **Output Gate & Hidden State**: $o_t = \\sigma(W_o [h_{t-1}, x_t] + b_o), \\quad h_t = o_t \\odot 	anh(C_t)$.

## Why Long Short-Term Memory (LSTM) & Gated Recurrent Units (GRU) Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
def lstm_cell_update(f_t, c_prev, i_t, c_cand):
    return [round(f * c + i * cc, 4) for f, c, i, cc in zip(f_t, c_prev, i_t, c_cand)]
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Compute f_t * c_prev + i_t * c_cand

> ⚠️ **Common Mistake**: The linear additive cell state update avoids continuous matrix multiplications, creating a direct gradient highway across arbitrary time steps.

## Real-World Production Scenario

In production engineering, **Long Short-Term Memory (LSTM) & Gated Recurrent Units (GRU)** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Long Short-Term Memory (LSTM) & Gated Recurrent Units (GRU). In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('PyTorch Tutorials: Deep Learning')?._id,
  });

  const dlL6_Challenge = await ChallengeModel.create({
    title: `Compute LSTM Cell State Update`,
    description: `Write a Python function \`lstm_cell_update(f_t, c_prev, i_t, c_cand)\` that returns \`[round(f * c + i * cc, 4) for f, c, i, cc in zip(f_t, c_prev, i_t, c_cand)]\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def lstm_cell_update(f_t, c_prev, i_t, c_cand):
    # Return list of updated cell state values
    pass
`,
    solutionCode: `def lstm_cell_update(f_t, c_prev, i_t, c_cand):
    return [round(f * c + i * cc, 4) for f, c, i, cc in zip(f_t, c_prev, i_t, c_cand)]`,
    hints: ["Compute f_t * c_prev + i_t * c_cand", "Iterate over zipped lists"],
    skills: [{"skillId": "deep-learning", "weight": 1.0}],
    testCases: [{"input": "lstm_cell_update([0.9], [1.0], [0.2], [0.5])", "expectedOutput": "[1.0]", "description": "Computes gated cell state", "hidden": false}],
  });

  const dlL6_Practice = await ActivityModel.create({
    lessonId: dlL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Compute LSTM Cell State Update`,
    order: 3,
    challengeRef: dlL6_Challenge._id,
    content: `# Code Practice: Compute LSTM Cell State Update\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  dlL6_Challenge.activityId = dlL6_Practice._id;
  await dlL6_Challenge.save();

  const dlL6_Quiz = await AssessmentModel.create({
    title: `Assessment: LSTM Gating Mechanisms`,
    description: `Test grasp of cell state operations and gating logic.`,
    passingScore: 70,
    skills: [{"skillId": "deep-learning", "weight": 1.0}],
    questions: [
    {
        "question": "Why does the Cell State in an LSTM prevent vanishing gradients over long sequences?",
        "options": [
            "The cell state is never updated",
            "The update rule is purely additive (C_t = f * C_{t-1} + i * C_cand), allowing error gradients to flow across time with minimal multiplicative decay",
            "LSTMs do not use backpropagation",
            "The cell state replaces the loss function"
        ],
        "explanation": "The linear additive cell state update avoids continuous matrix multiplications, creating a direct gradient highway across arbitrary time steps.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const dlL6_Assessment = await ActivityModel.create({
    lessonId: dlL6._id,
    type: 'QUIZ',
    title: `Assessment: LSTM Gating Mechanisms`,
    order: 4,
    assessmentRef: dlL6_Quiz._id,
  });
  dlL6_Quiz.activityId = dlL6_Assessment._id;
  await dlL6_Quiz.save();

  dlL6.activities = [
    dlL6_Video._id,
    dlL6_Notes._id,
    dlL6_Practice._id,
    dlL6_Assessment._id,
  ] as any;
  await dlL6.save();

  dlMod3.lessons = [dlL5._id, dlL6._id] as any;
  await dlMod3.save();

  const dlMod4 = await ModuleModel.create({
    courseId: dlCourse._id,
    title: `Module 4: The Transformer Architecture & Self-Attention`,
    description: `Master Scaled Dot-Product Attention, Multi-Head Attention, Positional Encodings, and Transformer Encoders/Decoders.`,
    order: 4,
    lessons: [],
  });

  // --- Lesson 1: Scaled Dot-Product & Multi-Head Self-Attention ---
  const dlL7 = await LessonModel.create({
    moduleId: dlMod4._id,
    courseId: dlCourse._id,
    title: `Scaled Dot-Product & Multi-Head Self-Attention`,
    description: `Derive Query, Key, Value matrix projections, scaled dot-product attention formula, and multi-head representation subspaces.`,
    order: 1,
    activities: [],
  });

  const dlL7_Video = await ActivityModel.create({
    lessonId: dlL7._id,
    type: 'VIDEO',
    title: `Video: Attention is all you need | Transformer neural networks`,
    order: 1,
    resourceRef: getRes('Neural Network Activation Functions ReLU Sigmoid in Tamil')?._id,
    content: `# Key Takeaways:
- Self-attention replaces sequential recurrence with O(1) path length across all token pairs.
- Q, K, V vectors project semantic roles (What I want, What I have, What I communicate).
- Scaling by sqrt(d_k) prevents softmax gradient saturation in high dimensions.`,
  });

  const dlL7_Notes = await ActivityModel.create({
    lessonId: dlL7._id,
    type: 'NOTES',
    title: `Codexa Notes: Scaled Dot-Product & Multi-Head Self-Attention`,
    order: 2,
    content: `# Scaled Dot-Product & Multi-Head Self-Attention

Derive Query, Key, Value matrix projections, scaled dot-product attention formula, and multi-head representation subspaces.

The Transformer architecture completely replaces recurrence with parallel self-attention.

---

### 1. Scaled Dot-Product Attention
Given Query ($Q$), Key ($K$), and Value ($V$) matrices with key dimension $d_k$:
$$	ext{Attention}(Q, K, V) = 	ext{Softmax}\\left(rac{Q K^T}{\\sqrt{d_k}}
ight) V$$

### 2. Multi-Head Attention
Projects queries, keys, and values into $h$ distinct lower-dimensional representation subspaces:
$$	ext{MultiHead}(Q, K, V) = 	ext{Concat}(	ext{head}_1, \\dots, 	ext{head}_h) W^O$$
$$	ext{where } 	ext{head}_i = 	ext{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$$

## Why Scaled Dot-Product & Multi-Head Self-Attention Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
def compute_scaling_factor(d_k):
    return round(1.0 / (d_k ** 0.5), 4)
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Compute 1.0 / sqrt(d_k)

> ⚠️ **Common Mistake**: As d_k increases, the variance of the dot products scales proportionally to d_k, causing large values that push softmax into saturated flat regions with near-zero gradients.

## Real-World Production Scenario

In production engineering, **Scaled Dot-Product & Multi-Head Self-Attention** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Scaled Dot-Product & Multi-Head Self-Attention. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('PyTorch Tutorials: Deep Learning')?._id,
  });

  const dlL7_Challenge = await ChallengeModel.create({
    title: `Compute Attention Score Scaling Factor`,
    description: `Write a Python function \`compute_scaling_factor(d_k)\` that returns \`round(1.0 / (d_k ** 0.5), 4)\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def compute_scaling_factor(d_k):
    # Return float scaling factor
    pass
`,
    solutionCode: `def compute_scaling_factor(d_k):
    return round(1.0 / (d_k ** 0.5), 4)`,
    hints: ["Compute 1.0 / sqrt(d_k)", "Use d_k ** 0.5"],
    skills: [{"skillId": "transformers", "weight": 1.0}],
    testCases: [{"input": "compute_scaling_factor(64)", "expectedOutput": "0.125", "description": "Calculates 1/sqrt(64)", "hidden": false}],
  });

  const dlL7_Practice = await ActivityModel.create({
    lessonId: dlL7._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Compute Attention Score Scaling Factor`,
    order: 3,
    challengeRef: dlL7_Challenge._id,
    content: `# Code Practice: Compute Attention Score Scaling Factor\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  dlL7_Challenge.activityId = dlL7_Practice._id;
  await dlL7_Challenge.save();

  const dlL7_Quiz = await AssessmentModel.create({
    title: `Assessment: Self-Attention Mechanics`,
    description: `Test Q/K/V matrix roles and attention scaling reasons.`,
    passingScore: 70,
    skills: [{"skillId": "transformers", "weight": 1.0}],
    questions: [
    {
        "question": "Why are dot products of Query and Key matrices divided by sqrt(d_k) before applying the Softmax function?",
        "options": [
            "To convert float numbers into integers",
            "For large dimensions d_k, dot products grow large in magnitude, pushing softmax into regions with vanishingly small gradients",
            "To enforce causality in decoding",
            "To reduce parameter size"
        ],
        "explanation": "As d_k increases, the variance of the dot products scales proportionally to d_k, causing large values that push softmax into saturated flat regions with near-zero gradients.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const dlL7_Assessment = await ActivityModel.create({
    lessonId: dlL7._id,
    type: 'QUIZ',
    title: `Assessment: Self-Attention Mechanics`,
    order: 4,
    assessmentRef: dlL7_Quiz._id,
  });
  dlL7_Quiz.activityId = dlL7_Assessment._id;
  await dlL7_Quiz.save();

  dlL7.activities = [
    dlL7_Video._id,
    dlL7_Notes._id,
    dlL7_Practice._id,
    dlL7_Assessment._id,
  ] as any;
  await dlL7.save();

  // --- Lesson 2: Positional Encodings & Full Transformer Architecture ---
  const dlL8 = await LessonModel.create({
    moduleId: dlMod4._id,
    courseId: dlCourse._id,
    title: `Positional Encodings & Full Transformer Architecture`,
    description: `Explore sinusoidal and rotary positional encodings (RoPE), LayerNorm, feed-forward sublayers, and causal masking.`,
    order: 2,
    activities: [],
  });

  const dlL8_Video = await ActivityModel.create({
    lessonId: dlL8._id,
    type: 'VIDEO',
    title: `Video: Transformers, explained visually | Positional Encodings & Encoders`,
    order: 1,
    resourceRef: getRes('Adam Optimizer and Adaptive Learning Rates in Tamil')?._id,
    content: `# Key Takeaways:
- Self-attention is permutation-invariant; positional encodings inject token sequence order.
- Pre-LayerNorm and residual connections stabilize deep 96+ layer transformer training.
- Autoregressive causal masking prevents tokens from attending to future positions during generation.`,
  });

  const dlL8_Notes = await ActivityModel.create({
    lessonId: dlL8._id,
    type: 'NOTES',
    title: `Codexa Notes: Positional Encodings & Full Transformer Architecture`,
    order: 2,
    content: `# Positional Encodings & Full Transformer Architecture

Explore sinusoidal and rotary positional encodings (RoPE), LayerNorm, feed-forward sublayers, and causal masking.

Because self-attention processes all tokens in parallel, explicit positional signals must be injected.

---

### 1. Sinusoidal Positional Encoding
For position $pos$ and dimension $i$:
$$PE_{(pos, 2i)} = \\sin\\left(rac{pos}{10000^{2i/d_{	ext{model}}}}
ight)$$
$$PE_{(pos, 2i+1)} = \\cos\\left(rac{pos}{10000^{2i/d_{	ext{model}}}}
ight)$$

### 2. Modern Rotary Position Embeddings (RoPE)
Encodes relative position by rotating Query and Key vectors in the complex plane:
$$\\mathbf{q}_m = \\mathbf{R}_{\\Theta, m}^d \\mathbf{W}_q \\mathbf{x}_m, \\quad \\mathbf{k}_n = \\mathbf{R}_{\\Theta, n}^d \\mathbf{W}_k \\mathbf{x}_n$$
$$\\mathbf{q}_m^T \\mathbf{k}_n = (\\mathbf{R}_{\\Theta, m}^d \\mathbf{W}_q \\mathbf{x}_m)^T (\\mathbf{R}_{\\Theta, n}^d \\mathbf{W}_k \\mathbf{x}_n) = \\mathbf{x}_m^T \\mathbf{W}_q^T \\mathbf{R}_{\\Theta, n-m}^d \\mathbf{W}_k \\mathbf{x}_n$$

## Why Positional Encodings & Full Transformer Architecture Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
import math

def get_sin_pos_encoding(pos, i, d_model):
    denom = 10000.0 ** ((2 * i) / d_model)
    return round(math.sin(pos / denom), 4)
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Calculate denom = 10000.0 ** ((2 * i) / d_model)

> ⚠️ **Common Mistake**: Causal masking sets attention scores for future token positions (j > i) to -infinity, ensuring predictions at position i depend strictly on past tokens (<= i).

## Real-World Production Scenario

In production engineering, **Positional Encodings & Full Transformer Architecture** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Positional Encodings & Full Transformer Architecture. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('PyTorch Tutorials: Deep Learning')?._id,
  });

  const dlL8_Challenge = await ChallengeModel.create({
    title: `Generate Sinusoidal Positional Encoding`,
    description: `Write a Python function \`get_sin_pos_encoding(pos, i, d_model)\` that returns \`round(math.sin(pos / (10000.0 ** ((2 * i) / d_model))), 4)\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `import math

def get_sin_pos_encoding(pos, i, d_model):
    # Return float sinusoidal value
    pass
`,
    solutionCode: `import math

def get_sin_pos_encoding(pos, i, d_model):
    denom = 10000.0 ** ((2 * i) / d_model)
    return round(math.sin(pos / denom), 4)`,
    hints: ["Calculate denom = 10000.0 ** ((2 * i) / d_model)", "Return round(math.sin(pos / denom), 4)"],
    skills: [{"skillId": "transformers", "weight": 1.0}],
    testCases: [{"input": "get_sin_pos_encoding(0, 0, 512)", "expectedOutput": "0.0", "description": "Pos 0 sin encoding is 0.0", "hidden": false}],
  });

  const dlL8_Practice = await ActivityModel.create({
    lessonId: dlL8._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Generate Sinusoidal Positional Encoding`,
    order: 3,
    challengeRef: dlL8_Challenge._id,
    content: `# Code Practice: Generate Sinusoidal Positional Encoding\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  dlL8_Challenge.activityId = dlL8_Practice._id;
  await dlL8_Challenge.save();

  const dlL8_Quiz = await AssessmentModel.create({
    title: `Assessment: Transformer Encoders & RoPE`,
    description: `Assess positional embeddings, causal masks, and feedforward blocks.`,
    passingScore: 70,
    skills: [{"skillId": "transformers", "weight": 1.0}],
    questions: [
    {
        "question": "Why does an autoregressive Transformer decoder apply a lower-triangular causal attention mask during training?",
        "options": [
            "To compress the model weights by 50%",
            "To prevent tokens from attending to subsequent future tokens, preserving the autoregressive next-token prediction objective",
            "To convert text embeddings into speech audio",
            "To skip training on punctuation marks"
        ],
        "explanation": "Causal masking sets attention scores for future token positions (j > i) to -infinity, ensuring predictions at position i depend strictly on past tokens (<= i).",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const dlL8_Assessment = await ActivityModel.create({
    lessonId: dlL8._id,
    type: 'QUIZ',
    title: `Assessment: Transformer Encoders & RoPE`,
    order: 4,
    assessmentRef: dlL8_Quiz._id,
  });
  dlL8_Quiz.activityId = dlL8_Assessment._id;
  await dlL8_Quiz.save();

  dlL8.activities = [
    dlL8_Video._id,
    dlL8_Notes._id,
    dlL8_Practice._id,
    dlL8_Assessment._id,
  ] as any;
  await dlL8.save();

  dlMod4.lessons = [dlL7._id, dlL8._id] as any;
  await dlMod4.save();

  dlCourse.modules = [dlMod1._id, dlMod2._id, dlMod3._id, dlMod4._id] as any;
  await dlCourse.save();

  // =========================================================================
  // 3. LARGE LANGUAGE MODEL & GENERATIVE AI ENGINEERING (4 MODULES, 8 LESSONS)
  // =========================================================================
  const llmCourse = await CourseModel.create({
    slug: 'llm-development',
    title: 'Large Language Model & Generative AI Engineering',
    description: 'Master enterprise LLM application development, Tokenization, Prompt Engineering (CoT, ReAct), Production RAG with Vector DBs, LoRA/QLoRA Fine-Tuning, and Autonomous Multi-Agent Systems.',
    domain: 'AI & Machine Learning',
    level: 'ADVANCED',
    status: 'PUBLISHED',
    estimatedHours: 45,
    skillsCovered: ['llm-development', 'rag-architecture', 'fine-tuning', 'ai-agents'],
    prerequisites: ['Python proficiency', 'Deep learning & Transformer foundations'],
    modules: [],
  });

  const llmMod1 = await ModuleModel.create({
    courseId: llmCourse._id,
    title: `Module 1: Generative AI Foundations & Prompt Engineering`,
    description: `LLM tokenization (BPE), sampling parameters (temperature, top_p, top_k), Chain-of-Thought, and structured JSON output schema enforcement.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: LLM Tokenization, Embeddings & Generation Hyperparameters ---
  const llmL1 = await LessonModel.create({
    moduleId: llmMod1._id,
    courseId: llmCourse._id,
    title: `LLM Tokenization, Embeddings & Generation Hyperparameters`,
    description: `Understand Byte-Pair Encoding (BPE), vocabulary vectors, temperature, top-k, and nucleus (top-p) sampling.`,
    order: 1,
    activities: [],
  });

  const llmL1_Video = await ActivityModel.create({
    lessonId: llmL1._id,
    type: 'VIDEO',
    title: `Video: How Large Language Models Work (LLM Tokenization & Sampling)`,
    order: 1,
    resourceRef: getRes('State of GPT and Large Language Model Foundations')?._id,
    content: `# Key Takeaways:
- LLMs operate on token IDs produced by subword tokenizers (like tiktoken / BPE).
- Temperature controls sampling entropy: lower = deterministic, higher = creative.
- Top-p (nucleus) sampling truncates candidate tokens to the cumulative probability mass p.`,
  });

  const llmL1_Notes = await ActivityModel.create({
    lessonId: llmL1._id,
    type: 'NOTES',
    title: `Codexa Notes: LLM Tokenization, Embeddings & Generation Hyperparameters`,
    order: 2,
    content: `# LLM Tokenization, Embeddings & Generation Hyperparameters

Understand Byte-Pair Encoding (BPE), vocabulary vectors, temperature, top-k, and nucleus (top-p) sampling.

Large Language Models generate text autoregressively by predicting probability distributions over token vocabularies.

---

### 1. Byte-Pair Encoding (BPE)
Subword tokenization compresses frequent byte sequences into unique token IDs, eliminating out-of-vocabulary errors while maximizing information density.

### 2. Sampling Parameters
Given output logits $z_i$:
1. **Temperature ($T$)**: Scaled logits $z_i' = z_i / T$. Lower $T 	o 0$ approaches greedy argmax selection.
2. **Top-K**: Considers only the top $K$ most probable tokens.
3. **Top-P (Nucleus Sampling)**: Selects smallest set of tokens whose cumulative probability $\\ge P$ (e.g. $P = 0.9$).

\`\`\`python
# Structured LLM API Payload:
payload = {
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Explain vector embeddings"}],
    "temperature": 0.2,
    "top_p": 0.95,
    "response_format": {"type": "json_object"}
}
\`\`\`

## Why LLM Tokenization, Embeddings & Generation Hyperparameters Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Accumulate prob in a sum

> ⚠️ **Common Mistake**: Setting temperature to 0 forces greedy decoding (argmax), ensuring the highest-probability token is selected at each step for reproducible responses.

## Real-World Production Scenario

In production engineering, **LLM Tokenization, Embeddings & Generation Hyperparameters** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of LLM Tokenization, Embeddings & Generation Hyperparameters. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('LangChain & OpenAI Guides')?._id,
  });

  const llmL1_Challenge = await ChallengeModel.create({
    title: `Filter Nucleus (Top-P) Token Distribution`,
    description: `Write a Python function \`filter_top_p(tokens_probs, p)\` where \`tokens_probs\` is a list of tuples \`[('token', prob), ...]\` sorted by prob descending. Return the list of tokens whose cumulative probability reaches or exceeds \`p\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def filter_top_p(tokens_probs, p):
    # Return list of selected tokens
    pass
`,
    solutionCode: `def filter_top_p(tokens_probs, p):
    selected = []
    cum_prob = 0.0
    for token, prob in tokens_probs:
        selected.append(token)
        cum_prob += prob
        if cum_prob >= p:
            break
    return selected`,
    hints: ["Accumulate prob in a sum", "Append token and break once cum_prob >= p"],
    skills: [{"skillId": "llm-development", "weight": 1.0}],
    testCases: [{"input": "filter_top_p([('A', 0.5), ('B', 0.3), ('C', 0.2)], 0.7)", "expectedOutput": "['A', 'B']", "description": "Selects tokens matching top-p threshold", "hidden": false}],
  });

  const llmL1_Practice = await ActivityModel.create({
    lessonId: llmL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Filter Nucleus (Top-P) Token Distribution`,
    order: 3,
    challengeRef: llmL1_Challenge._id,
    content: `# Code Practice: Filter Nucleus (Top-P) Token Distribution\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  llmL1_Challenge.activityId = llmL1_Practice._id;
  await llmL1_Challenge.save();

  const llmL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Tokenization & Sampling`,
    description: `Test understanding of sampling temperature and BPE tokens.`,
    passingScore: 70,
    skills: [{"skillId": "llm-development", "weight": 1.0}],
    questions: [
    {
        "question": "What is the practical impact of setting LLM sampling Temperature to 0.0?",
        "options": [
            "The model stops generating text completely",
            "The model performs greedy decoding, always picking the token with the highest logit for fully deterministic outputs",
            "The context window is reduced to zero",
            "The model hallucinates random words"
        ],
        "explanation": "Setting temperature to 0 forces greedy decoding (argmax), ensuring the highest-probability token is selected at each step for reproducible responses.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const llmL1_Assessment = await ActivityModel.create({
    lessonId: llmL1._id,
    type: 'QUIZ',
    title: `Assessment: Tokenization & Sampling`,
    order: 4,
    assessmentRef: llmL1_Quiz._id,
  });
  llmL1_Quiz.activityId = llmL1_Assessment._id;
  await llmL1_Quiz.save();

  llmL1.activities = [
    llmL1_Video._id,
    llmL1_Notes._id,
    llmL1_Practice._id,
    llmL1_Assessment._id,
  ] as any;
  await llmL1.save();

  // --- Lesson 2: Advanced Prompt Engineering: Few-Shot, CoT & ReAct ---
  const llmL2 = await LessonModel.create({
    moduleId: llmMod1._id,
    courseId: llmCourse._id,
    title: `Advanced Prompt Engineering: Few-Shot, CoT & ReAct`,
    description: `Master Chain-of-Thought (CoT), In-Context Learning, Tree-of-Thoughts, ReAct reasoning loops, and prompt injection defense.`,
    order: 2,
    activities: [],
  });

  const llmL2_Video = await ActivityModel.create({
    lessonId: llmL2._id,
    type: 'VIDEO',
    title: `Video: Advanced Prompt Engineering (Chain of Thought, ReAct, Few-Shot)`,
    order: 1,
    resourceRef: getRes('Prompt Engineering and In-Context Reasoning for LLMs')?._id,
    content: `# Key Takeaways:
- Chain-of-Thought (CoT) prompts force LLMs to allocate compute tokens to intermediate reasoning steps.
- In-Context Few-Shot examples establish formatting schemas and few-shot task adaptation.
- The ReAct (Reason + Act) loop alternates between reasoning traces and tool actions.`,
  });

  const llmL2_Notes = await ActivityModel.create({
    lessonId: llmL2._id,
    type: 'NOTES',
    title: `Codexa Notes: Advanced Prompt Engineering: Few-Shot, CoT & ReAct`,
    order: 2,
    content: `# Advanced Prompt Engineering: Few-Shot, CoT & ReAct

Master Chain-of-Thought (CoT), In-Context Learning, Tree-of-Thoughts, ReAct reasoning loops, and prompt injection defense.

Prompt engineering steers probabilistic language models into precise reasoning regimes without weight updates.

---

### 1. Chain-of-Thought (CoT) Prompting
By instructing the model to think step-by-step, the model generates intermediate tokens that condition subsequent reasoning steps:
\`\`\`text
System: You are an analytical assistant. Think step-by-step before producing your final answer.
Format:
<thinking>
[Intermediate calculation and step-by-step deduction]
</thinking>
<answer>
[Final concise response]
</answer>
\`\`\`

### 2. The ReAct Pattern (Reasoning + Acting)
Iterative loop coordinating thoughts with external tool invocations:
\`\`\`text
Thought: I need to query the database for user ID 42's subscription status.
Action: db_query({"user_id": 42})
Observation: {"status": "active", "plan": "enterprise"}
Thought: The user is an enterprise member. I can now answer their question.
Final Answer: You currently have an active Enterprise subscription.
\`\`\`

## Why Advanced Prompt Engineering: Few-Shot, CoT & ReAct Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Format string with Thought: and Action: lines

> ⚠️ **Common Mistake**: Autoregressive transformers compute a fixed amount of FLOPs per token. Generating reasoning steps explicitly allows the network to process complex logic sequentially across multiple token generations.

## Real-World Production Scenario

In production engineering, **Advanced Prompt Engineering: Few-Shot, CoT & ReAct** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Advanced Prompt Engineering: Few-Shot, CoT & ReAct. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('LangChain & OpenAI Guides')?._id,
  });

  const llmL2_Challenge = await ChallengeModel.create({
    title: `Format Structured ReAct Prompt Step`,
    description: `Write a Python function \`build_react_prompt(thought, action_name, action_args)\` that formats and returns \`f'Thought: {thought}\\nAction: {action_name}({action_args})'\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def build_react_prompt(thought, action_name, action_args):
    # Return formatted string
    pass
`,
    solutionCode: `def build_react_prompt(thought, action_name, action_args):
    return f'Thought: {thought}\\nAction: {action_name}({action_args})'`,
    hints: ["Format string with Thought: and Action: lines"],
    skills: [{"skillId": "llm-development", "weight": 1.0}],
    testCases: [{"input": "build_react_prompt('Look up order', 'getOrder', 'id=101')", "expectedOutput": "'Thought: Look up order\\nAction: getOrder(id=101)'", "description": "Formats ReAct step", "hidden": false}],
  });

  const llmL2_Practice = await ActivityModel.create({
    lessonId: llmL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Format Structured ReAct Prompt Step`,
    order: 3,
    challengeRef: llmL2_Challenge._id,
    content: `# Code Practice: Format Structured ReAct Prompt Step\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  llmL2_Challenge.activityId = llmL2_Practice._id;
  await llmL2_Challenge.save();

  const llmL2_Quiz = await AssessmentModel.create({
    title: `Assessment: Prompt Architecture`,
    description: `Test Chain-of-Thought and ReAct workflow concepts.`,
    passingScore: 70,
    skills: [{"skillId": "llm-development", "weight": 1.0}],
    questions: [
    {
        "question": "Why does Chain-of-Thought (CoT) prompting significantly improve multi-step mathematical and logical reasoning accuracy in LLMs?",
        "options": [
            "It downloads external Python libraries into the model",
            "It forces the autoregressive model to generate intermediate reasoning tokens, providing computational working memory that conditions the final output tokens",
            "It deletes old weights from memory",
            "It speeds up inference throughput"
        ],
        "explanation": "Autoregressive transformers compute a fixed amount of FLOPs per token. Generating reasoning steps explicitly allows the network to process complex logic sequentially across multiple token generations.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const llmL2_Assessment = await ActivityModel.create({
    lessonId: llmL2._id,
    type: 'QUIZ',
    title: `Assessment: Prompt Architecture`,
    order: 4,
    assessmentRef: llmL2_Quiz._id,
  });
  llmL2_Quiz.activityId = llmL2_Assessment._id;
  await llmL2_Quiz.save();

  llmL2.activities = [
    llmL2_Video._id,
    llmL2_Notes._id,
    llmL2_Practice._id,
    llmL2_Assessment._id,
  ] as any;
  await llmL2.save();

  llmMod1.lessons = [llmL1._id, llmL2._id] as any;
  await llmMod1.save();

  const llmMod2 = await ModuleModel.create({
    courseId: llmCourse._id,
    title: `Module 2: Retrieval-Augmented Generation (RAG) Systems`,
    description: `Master semantic vector embeddings, chunking strategies, Vector Databases (Pinecone, Qdrant, Chroma), hybrid search, and semantic re-ranking.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Vector Embeddings, Chunking Strategies & Vector Databases ---
  const llmL3 = await LessonModel.create({
    moduleId: llmMod2._id,
    courseId: llmCourse._id,
    title: `Vector Embeddings, Chunking Strategies & Vector Databases`,
    description: `Explore cosine similarity, recursive character chunking, token overlaps, and HNSW vector indexing.`,
    order: 1,
    activities: [],
  });

  const llmL3_Video = await ActivityModel.create({
    lessonId: llmL3._id,
    type: 'VIDEO',
    title: `Video: Retrieval-Augmented Generation (RAG) Architecture & Vector DBs`,
    order: 1,
    resourceRef: getRes('Embeddings and Vector Search Architecture')?._id,
    content: `# Key Takeaways:
- Dense embeddings represent semantic meaning as high-dimensional unit vectors.
- Recursive chunking with overlap preserves context across document boundaries.
- Vector indexes (HNSW, IVF-PQ) enable approximate nearest neighbor (ANN) search in sub-milliseconds.`,
  });

  const llmL3_Notes = await ActivityModel.create({
    lessonId: llmL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Vector Embeddings, Chunking Strategies & Vector Databases`,
    order: 2,
    content: `# Vector Embeddings, Chunking Strategies & Vector Databases

Explore cosine similarity, recursive character chunking, token overlaps, and HNSW vector indexing.

Retrieval-Augmented Generation grounds LLM responses with proprietary, up-to-date document context.

---

### 1. Document Ingestion Pipeline
\`\`\`text
Raw Docs ──► Text Chunker (512 tokens / 50 overlap) ──► Embedding Model ──► Vector DB (HNSW Index)
\`\`\`

### 2. Cosine Similarity Formula
For query embedding $\\mathbf{q}$ and document chunk embedding $\\mathbf{d}$:
$$	ext{Sim}(\\mathbf{q}, \\mathbf{d}) = rac{\\mathbf{q} \\cdot \\mathbf{d}}{\\|\\mathbf{q}\\| \\|\\mathbf{d}\\|} = rac{\\sum_{i=1}^D q_i d_i}{\\sqrt{\\sum_{i=1}^D q_i^2} \\sqrt{\\sum_{i=1}^D d_i^2}}$$

### 3. Hierarchical Navigable Small World (HNSW)
Graph-based index structure providing $O(\\log N)$ approximate nearest neighbor search across millions of vectors.

## Why Vector Embeddings, Chunking Strategies & Vector Databases Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Dot product: sum(a * b)

> ⚠️ **Common Mistake**: Chunking without overlap can split sentences or concepts across boundaries, destroying semantic coherence. Overlap ensures contiguous context is preserved in at least one chunk.

## Real-World Production Scenario

In production engineering, **Vector Embeddings, Chunking Strategies & Vector Databases** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Vector Embeddings, Chunking Strategies & Vector Databases. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('LangChain & OpenAI Guides')?._id,
  });

  const llmL3_Challenge = await ChallengeModel.create({
    title: `Compute Cosine Similarity Between Vector Embeddings`,
    description: `Write a Python function \`cosine_similarity(v1, v2)\` that calculates the dot product divided by the product of Euclidean norms, rounded to 4 decimals.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `import math

def cosine_similarity(v1, v2):
    # Return float similarity between -1.0 and 1.0
    pass
`,
    solutionCode: `import math

def cosine_similarity(v1, v2):
    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = sum(a * a for a in v1) ** 0.5
    norm2 = sum(b * b for b in v2) ** 0.5
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return round(dot / (norm1 * norm2), 4)`,
    hints: ["Dot product: sum(a * b)", "Norms: sum(x^2)^0.5", "Return round(dot / (n1 * n2), 4)"],
    skills: [{"skillId": "rag-architecture", "weight": 1.0}],
    testCases: [{"input": "cosine_similarity([1.0, 0.0], [1.0, 0.0])", "expectedOutput": "1.0", "description": "Identical vectors yield 1.0 similarity", "hidden": false}],
  });

  const llmL3_Practice = await ActivityModel.create({
    lessonId: llmL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Compute Cosine Similarity Between Vector Embeddings`,
    order: 3,
    challengeRef: llmL3_Challenge._id,
    content: `# Code Practice: Compute Cosine Similarity Between Vector Embeddings\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  llmL3_Challenge.activityId = llmL3_Practice._id;
  await llmL3_Challenge.save();

  const llmL3_Quiz = await AssessmentModel.create({
    title: `Assessment: Vector DBs & Similarity`,
    description: `Assess vector similarity, embeddings, and indexing graphs.`,
    passingScore: 70,
    skills: [{"skillId": "rag-architecture", "weight": 1.0}],
    questions: [
    {
        "question": "Why is sliding window token overlap (e.g. 50 tokens) included when chunking large text documents for RAG?",
        "options": [
            "To double the size of the vector database",
            "To prevent critical semantic context from being severed at hard sentence/chunk boundaries",
            "To bypass token rate limits",
            "To encrypt text chunks"
        ],
        "explanation": "Chunking without overlap can split sentences or concepts across boundaries, destroying semantic coherence. Overlap ensures contiguous context is preserved in at least one chunk.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const llmL3_Assessment = await ActivityModel.create({
    lessonId: llmL3._id,
    type: 'QUIZ',
    title: `Assessment: Vector DBs & Similarity`,
    order: 4,
    assessmentRef: llmL3_Quiz._id,
  });
  llmL3_Quiz.activityId = llmL3_Assessment._id;
  await llmL3_Quiz.save();

  llmL3.activities = [
    llmL3_Video._id,
    llmL3_Notes._id,
    llmL3_Practice._id,
    llmL3_Assessment._id,
  ] as any;
  await llmL3.save();

  // --- Lesson 2: Hybrid Search (BM25 + Dense) & Cross-Encoder Re-Ranking ---
  const llmL4 = await LessonModel.create({
    moduleId: llmMod2._id,
    courseId: llmCourse._id,
    title: `Hybrid Search (BM25 + Dense) & Cross-Encoder Re-Ranking`,
    description: `Combine sparse keyword search (BM25) with dense semantic search (Reciprocal Rank Fusion) and Cohere/bge cross-encoders.`,
    order: 2,
    activities: [],
  });

  const llmL4_Video = await ActivityModel.create({
    lessonId: llmL4._id,
    type: 'VIDEO',
    title: `Video: Advanced RAG: Hybrid Search, RRF & Re-ranking`,
    order: 1,
    resourceRef: getRes('Retrieval-Augmented Generation RAG Architecture')?._id,
    content: `# Key Takeaways:
- Dense retrieval misses exact keyword matches (IDs, product codes, specialized acronyms).
- Hybrid search merges BM25 keyword matching with dense vector similarity via RRF.
- Cross-encoder re-rankers evaluate query-document pairs jointly to filter out false positives.`,
  });

  const llmL4_Notes = await ActivityModel.create({
    lessonId: llmL4._id,
    type: 'NOTES',
    title: `Codexa Notes: Hybrid Search (BM25 + Dense) & Cross-Encoder Re-Ranking`,
    order: 2,
    content: `# Hybrid Search (BM25 + Dense) & Cross-Encoder Re-Ranking

Combine sparse keyword search (BM25) with dense semantic search (Reciprocal Rank Fusion) and Cohere/bge cross-encoders.

Production RAG systems combine multi-stage retrieval pipelines to maximize retrieval precision.

---

### 1. Reciprocal Rank Fusion (RRF)
Merges ranking lists from Sparse (BM25) and Dense (Vector) search:
$$RRF(d) = \\sum_{m \\in M} rac{1}{k + r_m(d)}$$
where $k pprox 60$ and $r_m(d)$ is document $d$'s rank in model $m$.

### 2. The Bi-Encoder vs Cross-Encoder Paradigm
- **Bi-Encoder (Fast)**: Encodes Query and Documents independently into fixed vectors. Computes cosine similarity in $\\mu s$. Used for top-100 candidate retrieval.
- **Cross-Encoder (Accurate)**: Passes \`[Query, Document]\` concatenated into full self-attention layers. Computes deep cross-attention relevance score. Used to re-rank top-100 down to top-5.

## Why Hybrid Search (BM25 + Dense) & Cross-Encoder Re-Ranking Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
def rrf_score(rank_sparse, rank_dense, k=60):
    score = (1.0 / (k + rank_sparse)) + (1.0 / (k + rank_dense))
    return round(score, 5)
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Compute (1.0 / (k + r1)) + (1.0 / (k + r2))

> ⚠️ **Common Mistake**: Cross-encoders compute full cross-attention across concatenated token pairs, making them highly accurate but computationally expensive, making them ideal only for small candidate pools (re-ranking).

## Real-World Production Scenario

In production engineering, **Hybrid Search (BM25 + Dense) & Cross-Encoder Re-Ranking** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Hybrid Search (BM25 + Dense) & Cross-Encoder Re-Ranking. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('LangChain & OpenAI Guides')?._id,
  });

  const llmL4_Challenge = await ChallengeModel.create({
    title: `Calculate Reciprocal Rank Fusion (RRF) Score`,
    description: `Write a Python function \`rrf_score(rank_sparse, rank_dense, k=60)\` that calculates \`(1.0 / (k + rank_sparse)) + (1.0 / (k + rank_dense))\` rounded to 5 decimals.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def rrf_score(rank_sparse, rank_dense, k=60):
    # Return float RRF score
    pass
`,
    solutionCode: `def rrf_score(rank_sparse, rank_dense, k=60):
    score = (1.0 / (k + rank_sparse)) + (1.0 / (k + rank_dense))
    return round(score, 5)`,
    hints: ["Compute (1.0 / (k + r1)) + (1.0 / (k + r2))"],
    skills: [{"skillId": "rag-architecture", "weight": 1.0}],
    testCases: [{"input": "rrf_score(1, 1, 60)", "expectedOutput": "0.03279", "description": "Computes RRF score for top-ranked item", "hidden": false}],
  });

  const llmL4_Practice = await ActivityModel.create({
    lessonId: llmL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Calculate Reciprocal Rank Fusion (RRF) Score`,
    order: 3,
    challengeRef: llmL4_Challenge._id,
    content: `# Code Practice: Calculate Reciprocal Rank Fusion (RRF) Score\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  llmL4_Challenge.activityId = llmL4_Practice._id;
  await llmL4_Challenge.save();

  const llmL4_Quiz = await AssessmentModel.create({
    title: `Assessment: Hybrid Search & Re-ranking`,
    description: `Test hybrid retrieval algorithms and cross-encoder mechanics.`,
    passingScore: 70,
    skills: [{"skillId": "rag-architecture", "weight": 1.0}],
    questions: [
    {
        "question": "Why is a Cross-Encoder used as a second-stage re-ranker rather than as the primary search engine across a 1,000,000 document database?",
        "options": [
            "Cross-encoders cannot output numbers",
            "Cross-encoders require passing every (query, doc) pair through full transformer self-attention, which is computationally prohibitive for millions of documents but feasible for top-50 candidates",
            "Cross-encoders are less accurate than cosine similarity",
            "Vector databases cannot store cross-encoders"
        ],
        "explanation": "Cross-encoders compute full cross-attention across concatenated token pairs, making them highly accurate but computationally expensive, making them ideal only for small candidate pools (re-ranking).",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const llmL4_Assessment = await ActivityModel.create({
    lessonId: llmL4._id,
    type: 'QUIZ',
    title: `Assessment: Hybrid Search & Re-ranking`,
    order: 4,
    assessmentRef: llmL4_Quiz._id,
  });
  llmL4_Quiz.activityId = llmL4_Assessment._id;
  await llmL4_Quiz.save();

  llmL4.activities = [
    llmL4_Video._id,
    llmL4_Notes._id,
    llmL4_Practice._id,
    llmL4_Assessment._id,
  ] as any;
  await llmL4.save();

  llmMod2.lessons = [llmL3._id, llmL4._id] as any;
  await llmMod2.save();

  const llmMod3 = await ModuleModel.create({
    courseId: llmCourse._id,
    title: `Module 3: Fine-Tuning & Parameter-Efficient Techniques (PEFT)`,
    description: `Master Supervised Fine-Tuning (SFT), Low-Rank Adaptation (LoRA), QLoRA 4-bit quantization, and DPO alignment.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: Supervised Fine-Tuning (SFT) & Instruction Datasets ---
  const llmL5 = await LessonModel.create({
    moduleId: llmMod3._id,
    courseId: llmCourse._id,
    title: `Supervised Fine-Tuning (SFT) & Instruction Datasets`,
    description: `Prepare instruction-tuning datasets (Alpaca/ShareGPT format), loss masking on prompts, and learning rate schedules.`,
    order: 1,
    activities: [],
  });

  const llmL5_Video = await ActivityModel.create({
    lessonId: llmL5._id,
    type: 'VIDEO',
    title: `Video: How to Fine-Tune LLMs (SFT & Instruction Tuning)`,
    order: 1,
    resourceRef: getRes('Fine-Tuning LLMs with LoRA and Parameter Efficient Adapters')?._id,
    content: `# Key Takeaways:
- Pre-training builds world knowledge; SFT aligns models into instruction-following chat assistants.
- Instruction formats (ShareGPT/ChatML) structure multi-turn conversational roles.
- Loss masking computes cross-entropy gradients ONLY on assistant response tokens.`,
  });

  const llmL5_Notes = await ActivityModel.create({
    lessonId: llmL5._id,
    type: 'NOTES',
    title: `Codexa Notes: Supervised Fine-Tuning (SFT) & Instruction Datasets`,
    order: 2,
    content: `# Supervised Fine-Tuning (SFT) & Instruction Datasets

Prepare instruction-tuning datasets (Alpaca/ShareGPT format), loss masking on prompts, and learning rate schedules.

SFT adapts base pretrained LLMs into helpful, aligned conversational assistants.

---

### 1. ChatML / Instruction Format
\`\`\`json
[
  {"role": "system", "content": "You are a code refactoring expert."},
  {"role": "user", "content": "Refactor this function to be pure."},
  {"role": "assistant", "content": "Here is the refactored pure function..."}
]
\`\`\`

### 2. Response Token Loss Masking
During backpropagation, loss is computed strictly over target assistant tokens:
$$\\mathcal{L}_{SFT} = -\\sum_{t \\in 	ext{AssistantTokens}} \\log P(x_t \\mid x_{<t})$$
User prompt tokens are masked with label index \`-100\` (ignored by cross-entropy loss).

## Why Supervised Fine-Tuning (SFT) & Instruction Datasets Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Create list of [-100] * prompt_len

> ⚠️ **Common Mistake**: We want the model to learn conditional response generation given a prompt, not memorize or predict the user's input prompt tokens.

## Real-World Production Scenario

In production engineering, **Supervised Fine-Tuning (SFT) & Instruction Datasets** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Supervised Fine-Tuning (SFT) & Instruction Datasets. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('LangChain & OpenAI Guides')?._id,
  });

  const llmL5_Challenge = await ChallengeModel.create({
    title: `Mask Prompt Tokens for SFT Training`,
    description: `Write a Python function \`mask_prompt_labels(prompt_len, total_len, token_ids)\` that returns a list of label IDs where the first \`prompt_len\` elements are \`-100\` and the remaining elements match \`token_ids[prompt_len:]\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def mask_prompt_labels(prompt_len, total_len, token_ids):
    # Return list of labels with -100 masking
    pass
`,
    solutionCode: `def mask_prompt_labels(prompt_len, total_len, token_ids):
    labels = [-100] * prompt_len
    labels.extend(token_ids[prompt_len:total_len])
    return labels`,
    hints: ["Create list of [-100] * prompt_len", "Extend with token_ids from prompt_len to total_len"],
    skills: [{"skillId": "fine-tuning", "weight": 1.0}],
    testCases: [{"input": "mask_prompt_labels(2, 4, [10, 20, 30, 40])", "expectedOutput": "[-100, -100, 30, 40]", "description": "Masks prompt tokens with -100", "hidden": false}],
  });

  const llmL5_Practice = await ActivityModel.create({
    lessonId: llmL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Mask Prompt Tokens for SFT Training`,
    order: 3,
    challengeRef: llmL5_Challenge._id,
    content: `# Code Practice: Mask Prompt Tokens for SFT Training\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  llmL5_Challenge.activityId = llmL5_Practice._id;
  await llmL5_Challenge.save();

  const llmL5_Quiz = await AssessmentModel.create({
    title: `Assessment: SFT & Dataset Curation`,
    description: `Test loss masking and instruction-following dataset mechanics.`,
    passingScore: 70,
    skills: [{"skillId": "fine-tuning", "weight": 1.0}],
    questions: [
    {
        "question": "Why are user prompt tokens masked with label ID -100 during Supervised Fine-Tuning?",
        "options": [
            "To delete the user query from memory",
            "To prevent the model from spending gradient capacity learning to predict the user prompt, focusing learning strictly on generating high-quality assistant responses",
            "To encrypt the training dataset",
            "PyTorch throws an error without -100"
        ],
        "explanation": "We want the model to learn conditional response generation given a prompt, not memorize or predict the user's input prompt tokens.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const llmL5_Assessment = await ActivityModel.create({
    lessonId: llmL5._id,
    type: 'QUIZ',
    title: `Assessment: SFT & Dataset Curation`,
    order: 4,
    assessmentRef: llmL5_Quiz._id,
  });
  llmL5_Quiz.activityId = llmL5_Assessment._id;
  await llmL5_Quiz.save();

  llmL5.activities = [
    llmL5_Video._id,
    llmL5_Notes._id,
    llmL5_Practice._id,
    llmL5_Assessment._id,
  ] as any;
  await llmL5.save();

  // --- Lesson 2: LoRA, QLoRA & Parameter-Efficient Fine-Tuning (PEFT) ---
  const llmL6 = await LessonModel.create({
    moduleId: llmMod3._id,
    courseId: llmCourse._id,
    title: `LoRA, QLoRA & Parameter-Efficient Fine-Tuning (PEFT)`,
    description: `Master low-rank weight decomposition W + (B x A), rank r, scaling factor alpha, NormalFloat4 (NF4) quantization, and double quantization.`,
    order: 2,
    activities: [],
  });

  const llmL6_Video = await ActivityModel.create({
    lessonId: llmL6._id,
    type: 'VIDEO',
    title: `Video: LoRA & QLoRA Explained Visually`,
    order: 1,
    resourceRef: getRes('Fine-Tuning LLMs with LoRA and Parameter Efficient Adapters')?._id,
    content: `# Key Takeaways:
- Full fine-tuning requires updating all 70B+ model parameters, demanding massive VRAM.
- LoRA freezes base weights and injects low-rank trainable adapter matrices: Delta W = B * A.
- QLoRA quantizes base weights to 4-bit NormalFloat (NF4), fine-tuning a 70B model on a single 24GB GPU.`,
  });

  const llmL6_Notes = await ActivityModel.create({
    lessonId: llmL6._id,
    type: 'NOTES',
    title: `Codexa Notes: LoRA, QLoRA & Parameter-Efficient Fine-Tuning (PEFT)`,
    order: 2,
    content: `# LoRA, QLoRA & Parameter-Efficient Fine-Tuning (PEFT)

Master low-rank weight decomposition W + (B x A), rank r, scaling factor alpha, NormalFloat4 (NF4) quantization, and double quantization.

LoRA enables fine-tuning enterprise models with < 1% of trainable parameters.

---

### 1. LoRA Mathematical Decomposition
For frozen weight matrix $W_0 \\in \\mathbb{R}^{d 	imes k}$, inject trainable low-rank matrices $B \\in \\mathbb{R}^{d 	imes r}$ and $A \\in \\mathbb{R}^{r 	imes k}$ where rank $r \\ll \\min(d, k)$:
$$h = W_0 x + \\Delta W x = W_0 x + rac{lpha}{r} B A x$$
- $A$ is initialized with Gaussian noise; $B$ is initialized to zero (so $\\Delta W = 0$ at training start).

### 2. QLoRA (Quantized LoRA) Innovations
1. **NF4 (NormalFloat4)**: Information-theoretically optimal 4-bit quantile quantization for normally distributed weights.
2. **Double Quantization**: Quantizes quantization constants, saving 0.37 bits per parameter.
3. **Paged Optimizers**: Prevents CUDA out-of-memory spikes during gradient checkpointing.

## Why LoRA, QLoRA & Parameter-Efficient Fine-Tuning (PEFT) Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
def lora_param_count(d_in, d_out, rank):
    return (rank * d_in) + (rank * d_out)
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Matrix A has rank * d_in parameters

> ⚠️ **Common Mistake**: Initializing B to zero guarantees that delta W = 0 initially, meaning model outputs match the original pretrained model exactly before gradient updates begin.

## Real-World Production Scenario

In production engineering, **LoRA, QLoRA & Parameter-Efficient Fine-Tuning (PEFT)** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of LoRA, QLoRA & Parameter-Efficient Fine-Tuning (PEFT). In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('LangChain & OpenAI Guides')?._id,
  });

  const llmL6_Challenge = await ChallengeModel.create({
    title: `Calculate LoRA Trainable Parameter Reduction`,
    description: `Write a Python function \`lora_param_count(d_in, d_out, rank)\` that calculates the total trainable parameters in matrices $A$ and $B$: \`rank * d_in + rank * d_out\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def lora_param_count(d_in, d_out, rank):
    # Return integer parameter count
    pass
`,
    solutionCode: `def lora_param_count(d_in, d_out, rank):
    return (rank * d_in) + (rank * d_out)`,
    hints: ["Matrix A has rank * d_in parameters", "Matrix B has rank * d_out parameters"],
    skills: [{"skillId": "fine-tuning", "weight": 1.0}],
    testCases: [{"input": "lora_param_count(4096, 4096, 16)", "expectedOutput": "131072", "description": "Calculates LoRA adapter parameter count (vs 16.7M full matrix)", "hidden": false}],
  });

  const llmL6_Practice = await ActivityModel.create({
    lessonId: llmL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Calculate LoRA Trainable Parameter Reduction`,
    order: 3,
    challengeRef: llmL6_Challenge._id,
    content: `# Code Practice: Calculate LoRA Trainable Parameter Reduction\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  llmL6_Challenge.activityId = llmL6_Practice._id;
  await llmL6_Challenge.save();

  const llmL6_Quiz = await AssessmentModel.create({
    title: `Assessment: LoRA & PEFT Mechanics`,
    description: `Test low-rank decomposition theory and QLoRA memory optimizations.`,
    passingScore: 70,
    skills: [{"skillId": "fine-tuning", "weight": 1.0}],
    questions: [
    {
        "question": "Why is matrix B in LoRA initialized to all zeros at the start of fine-tuning?",
        "options": [
            "To prevent division by zero",
            "To ensure that Delta W = B * A is exactly zero at step 0, preserving the exact original behavior of the pretrained model",
            "To disable gradient updates on B",
            "Because negative weights are not permitted"
        ],
        "explanation": "Initializing B to zero guarantees that delta W = 0 initially, meaning model outputs match the original pretrained model exactly before gradient updates begin.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const llmL6_Assessment = await ActivityModel.create({
    lessonId: llmL6._id,
    type: 'QUIZ',
    title: `Assessment: LoRA & PEFT Mechanics`,
    order: 4,
    assessmentRef: llmL6_Quiz._id,
  });
  llmL6_Quiz.activityId = llmL6_Assessment._id;
  await llmL6_Quiz.save();

  llmL6.activities = [
    llmL6_Video._id,
    llmL6_Notes._id,
    llmL6_Practice._id,
    llmL6_Assessment._id,
  ] as any;
  await llmL6.save();

  llmMod3.lessons = [llmL5._id, llmL6._id] as any;
  await llmMod3.save();

  const llmMod4 = await ModuleModel.create({
    courseId: llmCourse._id,
    title: `Module 4: Autonomous Agents & Production LLM Deployment`,
    description: `Master tool calling (Function Calling), LangGraph multi-agent systems, structured output validation (Pydantic), and Guardrails.`,
    order: 4,
    lessons: [],
  });

  // --- Lesson 1: Function Calling, Tool Use & Structured JSON Schemas ---
  const llmL7 = await LessonModel.create({
    moduleId: llmMod4._id,
    courseId: llmCourse._id,
    title: `Function Calling, Tool Use & Structured JSON Schemas`,
    description: `Define OpenAPI/JSON schemas for LLM tool calling, parse arguments, handle tool execution responses, and error recovery.`,
    order: 1,
    activities: [],
  });

  const llmL7_Video = await ActivityModel.create({
    lessonId: llmL7._id,
    type: 'VIDEO',
    title: `Video: Function Calling & Tool Use with LLMs`,
    order: 1,
    resourceRef: getRes('Autonomous AI Agents and Tool Calling with LangChain')?._id,
    content: `# Key Takeaways:
- Function calling allows LLMs to interact with external APIs, databases, and code execution sandboxes.
- Modern frontier models natively emit structured JSON tool call payloads.
- Validate tool arguments using strict schema validators (like Zod or Pydantic) before execution.`,
  });

  const llmL7_Notes = await ActivityModel.create({
    lessonId: llmL7._id,
    type: 'NOTES',
    title: `Codexa Notes: Function Calling, Tool Use & Structured JSON Schemas`,
    order: 2,
    content: `# Function Calling, Tool Use & Structured JSON Schemas

Define OpenAPI/JSON schemas for LLM tool calling, parse arguments, handle tool execution responses, and error recovery.

Function calling bridges LLMs with deterministic software tools, database queries, and external APIs.

---

### 1. Tool Declaration Schema
\`\`\`json
{
  "type": "function",
  "function": {
    "name": "fetch_weather",
    "description": "Get current weather conditions for a city",
    "parameters": {
      "type": "object",
      "properties": {
        "city": {"type": "string", "description": "City name e.g. London"},
        "units": {"type": "string", "enum": ["celsius", "fahrenheit"]}
      },
      "required": ["city"]
    }
  }
}
\`\`\`

### 2. Tool Execution Workflow Loop
1. User provides prompt.
2. Model emits \`tool_calls\` containing function name and arguments.
3. Client executes the function locally in sandbox.
4. Client returns result in message role \`tool\`.
5. Model synthesizes final response incorporating tool results.

## Why Function Calling, Tool Use & Structured JSON Schemas Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Parse with json.loads() in try-except

> ⚠️ **Common Mistake**: The LLM outputs structured JSON specifying what function to invoke and with what arguments. The client application is responsible for executing the function in its environment and returning results.

## Real-World Production Scenario

In production engineering, **Function Calling, Tool Use & Structured JSON Schemas** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Function Calling, Tool Use & Structured JSON Schemas. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('LangChain & OpenAI Guides')?._id,
  });

  const llmL7_Challenge = await ChallengeModel.create({
    title: `Parse and Validate Tool Call Arguments`,
    description: `Write a Python function \`validate_tool_call(args_json_str, required_fields)\` that parses JSON and returns True if all \`required_fields\` are present, otherwise False.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `import json

def validate_tool_call(args_json_str, required_fields):
    # Return boolean
    pass
`,
    solutionCode: `import json

def validate_tool_call(args_json_str, required_fields):
    try:
        data = json.loads(args_json_str)
        return all(field in data for field in required_fields)
    except Exception:
        return False`,
    hints: ["Parse with json.loads() in try-except", "Check all(f in data for f in required_fields)"],
    skills: [{"skillId": "ai-agents", "weight": 1.0}],
    testCases: [{"input": "validate_tool_call('{\"city\": \"Tokyo\"}', ['city'])", "expectedOutput": "True", "description": "Validates required JSON fields", "hidden": false}],
  });

  const llmL7_Practice = await ActivityModel.create({
    lessonId: llmL7._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Parse and Validate Tool Call Arguments`,
    order: 3,
    challengeRef: llmL7_Challenge._id,
    content: `# Code Practice: Parse and Validate Tool Call Arguments\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  llmL7_Challenge.activityId = llmL7_Practice._id;
  await llmL7_Challenge.save();

  const llmL7_Quiz = await AssessmentModel.create({
    title: `Assessment: Tool Calling & Schemas`,
    description: `Test JSON schema enforcement and agent tool dispatching.`,
    passingScore: 70,
    skills: [{"skillId": "ai-agents", "weight": 1.0}],
    questions: [
    {
        "question": "When an LLM returns a function call object in an API response, what actually executes the underlying Python/JavaScript code?",
        "options": [
            "The remote model server executes the code inside OpenAI/Anthropic servers automatically",
            "The client application parses the tool call, executes the code locally in its own environment/sandbox, and returns the output to the LLM",
            "The client browser executes it via WebAssembly automatically",
            "The database executes it as a stored procedure"
        ],
        "explanation": "The LLM outputs structured JSON specifying what function to invoke and with what arguments. The client application is responsible for executing the function in its environment and returning results.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const llmL7_Assessment = await ActivityModel.create({
    lessonId: llmL7._id,
    type: 'QUIZ',
    title: `Assessment: Tool Calling & Schemas`,
    order: 4,
    assessmentRef: llmL7_Quiz._id,
  });
  llmL7_Quiz.activityId = llmL7_Assessment._id;
  await llmL7_Quiz.save();

  llmL7.activities = [
    llmL7_Video._id,
    llmL7_Notes._id,
    llmL7_Practice._id,
    llmL7_Assessment._id,
  ] as any;
  await llmL7.save();

  // --- Lesson 2: Multi-Agent Systems, LangGraph & Production Guardrails ---
  const llmL8 = await LessonModel.create({
    moduleId: llmMod4._id,
    courseId: llmCourse._id,
    title: `Multi-Agent Systems, LangGraph & Production Guardrails`,
    description: `Build multi-agent state machines, planner-executor loops, hallucination detection, and semantic output guardrails.`,
    order: 2,
    activities: [],
  });

  const llmL8_Video = await ActivityModel.create({
    lessonId: llmL8._id,
    type: 'VIDEO',
    title: `Video: Building Autonomous Multi-Agent Workflows (LangGraph)`,
    order: 1,
    resourceRef: getRes('Autonomous AI Agents and Tool Calling with LangChain')?._id,
    content: `# Key Takeaways:
- Multi-agent systems assign specialized system prompts and tools to distinct agent personas.
- State graph frameworks (LangGraph) model cyclical agent loops with human-in-the-loop checkpoints.
- Guardrails filter PII, prevent prompt injection, and verify factual grounding against context.`,
  });

  const llmL8_Notes = await ActivityModel.create({
    lessonId: llmL8._id,
    type: 'NOTES',
    title: `Codexa Notes: Multi-Agent Systems, LangGraph & Production Guardrails`,
    order: 2,
    content: `# Multi-Agent Systems, LangGraph & Production Guardrails

Build multi-agent state machines, planner-executor loops, hallucination detection, and semantic output guardrails.

Enterprise AI applications coordinate specialized autonomous agents across structured state graphs.

---

### 1. Multi-Agent Collaboration Patterns
- **Supervisor / Orchestrator**: Routes user tasks to specialized subagents (Researcher, Coder, Reviewer).
- **Sequential Pipeline**: Output of Agent A becomes input to Agent B.
- **Hierarchical Swarm**: Planner agent delegates subtasks to parallel execution workers.

\`\`\`text
User Request ──► Supervisor Agent
                      ├──► Research Subagent (Web / Vector Search)
                      ├──► Coding Subagent (Sandbox Execution)
                      └──► Security Reviewer (Vulnerability & Logic Check)
\`\`\`

### 2. Production Guardrails
- **Input Guardrails**: Prompt injection scanning, toxicity filters, PII redaction.
- **Output Guardrails**: Faithfulness check against retrieved RAG chunks, hallucination confidence scoring, JSON schema validation.

## Why Multi-Agent Systems, LangGraph & Production Guardrails Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check has_errors first

> ⚠️ **Common Mistake**: Modular subagents with distinct responsibilities reduce prompt confusion, prevent context bloat, improve tool calling accuracy, and allow structured human-in-the-loop validation.

## Real-World Production Scenario

In production engineering, **Multi-Agent Systems, LangGraph & Production Guardrails** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Multi-Agent Systems, LangGraph & Production Guardrails. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('LangChain & OpenAI Guides')?._id,
  });

  const llmL8_Challenge = await ChallengeModel.create({
    title: `Implement Agent Router State Transition`,
    description: `Write a Python function \`route_next_agent(current_state)\` where \`current_state\` is a dictionary. If \`current_state['has_errors']\` is True, return \`'debugger'\`; if \`current_state['is_complete']\` is True, return \`'finalizer'\`; otherwise return \`'coder'\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def route_next_agent(current_state):
    # Return next agent name string
    pass
`,
    solutionCode: `def route_next_agent(current_state):
    if current_state.get('has_errors'):
        return 'debugger'
    if current_state.get('is_complete'):
        return 'finalizer'
    return 'coder'`,
    hints: ["Check has_errors first", "Check is_complete second", "Default to coder"],
    skills: [{"skillId": "ai-agents", "weight": 1.0}],
    testCases: [{"input": "route_next_agent({'has_errors': True, 'is_complete': False})", "expectedOutput": "'debugger'", "description": "Routes to debugger on errors", "hidden": false}],
  });

  const llmL8_Practice = await ActivityModel.create({
    lessonId: llmL8._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Implement Agent Router State Transition`,
    order: 3,
    challengeRef: llmL8_Challenge._id,
    content: `# Code Practice: Implement Agent Router State Transition\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  llmL8_Challenge.activityId = llmL8_Practice._id;
  await llmL8_Challenge.save();

  const llmL8_Quiz = await AssessmentModel.create({
    title: `Assessment: Multi-Agent Systems & Guardrails`,
    description: `Assess state graphs, supervisor routing, and production guardrails.`,
    passingScore: 70,
    skills: [{"skillId": "ai-agents", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary benefit of decomposing a complex monolithic prompt into a Multi-Agent system with specialized subagents?",
        "options": [
            "It reduces API token consumption to zero",
            "It isolates specialized context, simplifies system instructions, allows fine-grained tool assignment, and enables deterministic state validation between workflow steps",
            "It makes all model responses 100% deterministic without temperature settings",
            "It eliminates the need for vector databases"
        ],
        "explanation": "Modular subagents with distinct responsibilities reduce prompt confusion, prevent context bloat, improve tool calling accuracy, and allow structured human-in-the-loop validation.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const llmL8_Assessment = await ActivityModel.create({
    lessonId: llmL8._id,
    type: 'QUIZ',
    title: `Assessment: Multi-Agent Systems & Guardrails`,
    order: 4,
    assessmentRef: llmL8_Quiz._id,
  });
  llmL8_Quiz.activityId = llmL8_Assessment._id;
  await llmL8_Quiz.save();

  llmL8.activities = [
    llmL8_Video._id,
    llmL8_Notes._id,
    llmL8_Practice._id,
    llmL8_Assessment._id,
  ] as any;
  await llmL8.save();

  llmMod4.lessons = [llmL7._id, llmL8._id] as any;
  await llmMod4.save();

  llmCourse.modules = [llmMod1._id, llmMod2._id, llmMod3._id, llmMod4._id] as any;
  await llmCourse.save();

  return [mlCourse, dlCourse, llmCourse];
}

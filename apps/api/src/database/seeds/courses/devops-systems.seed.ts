import { CourseModel } from '../../models/Course';
import { ModuleModel } from '../../models/Module';
import { LessonModel } from '../../models/Lesson';
import { ActivityModel } from '../../models/Activity';
import { AssessmentModel } from '../../models/Assessment';
import { ChallengeModel } from '../../models/Challenge';

export async function seedDevopsSystemsCourses(resourceMap: Map<string, any>) {
  const getRes = (titlePrefix: string) => {
    for (const [title, r] of resourceMap.entries()) {
      if (title.toLowerCase().includes(titlePrefix.toLowerCase())) return r;
    }
    return undefined;
  };

  // =========================================================================
  // 1. LINUX SYSTEMS & SHELL SCRIPTING (4 MODULES, 8 LESSONS)
  // =========================================================================
  const linuxCourse = await CourseModel.create({
    slug: 'linux-fundamentals',
    title: 'Linux Systems & Shell Automation Engineering',
    description: 'Master the Linux filesystem hierarchy, user permissions, process signals, systemd services, stream processing (grep/sed/awk), and production bash automation.',
    domain: 'DevOps / Cloud / Systems',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    estimatedHours: 35,
    skillsCovered: ['linux-fundamentals', 'bash-scripting', 'process-management', 'system-administration'],
    prerequisites: ['Basic computer literacy'],
    modules: [],
  });

  const linuxMod1 = await ModuleModel.create({
    courseId: linuxCourse._id,
    title: `Module 1: Filesystem Hierarchy & Permissions`,
    description: `Understand the Linux Kernel, Filesystem Hierarchy Standard (FHS), inode architecture, and octal chmod/chown permissions.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: Filesystem Hierarchy Standard (FHS) & File Operations ---
  const linuxL1 = await LessonModel.create({
    moduleId: linuxMod1._id,
    courseId: linuxCourse._id,
    title: `Filesystem Hierarchy Standard (FHS) & File Operations`,
    description: `Explore /etc, /var, /usr, /dev, hard vs symbolic links, and basic file navigation.`,
    order: 1,
    activities: [],
  });

  const linuxL1_Video = await ActivityModel.create({
    lessonId: linuxL1._id,
    type: 'VIDEO',
    title: `Video: Linux Filesystem Hierarchy & Essential Commands`,
    order: 1,
    resourceRef: getRes('What is Linux Kernel and User Space in Tamil')?._id,
    content: `# Key Takeaways:
- Everything in Linux is a file or a process.
- /etc holds configuration, /var holds variable data (logs/db), /dev exposes device files.
- Hard links point directly to inodes; symbolic links point to filenames.`,
  });

  const linuxL1_Notes = await ActivityModel.create({
    lessonId: linuxL1._id,
    type: 'NOTES',
    title: `Codexa Notes: Filesystem Hierarchy Standard (FHS) & File Operations`,
    order: 2,
    content: `# Filesystem Hierarchy Standard (FHS) & File Operations

Explore /etc, /var, /usr, /dev, hard vs symbolic links, and basic file navigation.

Linux organizes the entire operating system under a single unified root directory (\`/\`).

---

### Core Directories
- \`/etc\`: Host-specific system-wide configuration files.
- \`/var\`: Variable data that grows over time (logs in \`/var/log\`, mail, spool).
- \`/usr\`: User binaries, documentation, and libraries (\`/usr/bin\`, \`/usr/lib\`).
- \`/home\`: User personal home directories.
- \`/dev\`: Special device node files representing hardware and virtual devices.
- \`/proc\` & \`/sys\`: Virtual pseudo-filesystems exposing kernel and process state in RAM.

### Links: Hard vs Symbolic (Soft)
\`\`\`bash
# Create symbolic link (points to path)
ln -s /var/log/nginx/access.log ~/current_access.log

# Create hard link (shares same inode number)
ln source_file.txt hardlink_file.txt
\`\`\`

## Why Filesystem Hierarchy Standard (FHS) & File Operations Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Strip leading/trailing slashes

> ⚠️ **Common Mistake**: /etc is the standard location reserved for all host-specific system and application configuration files.

## Real-World Production Scenario

In production engineering, **Filesystem Hierarchy Standard (FHS) & File Operations** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Filesystem Hierarchy Standard (FHS) & File Operations. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Linux Documentation Project')?._id,
  });

  const linuxL1_Challenge = await ChallengeModel.create({
    title: `Parse File Absolute Paths`,
    description: `Write a Python function \`normalize_linux_path(path_segments)\` that takes a list of string directory names and returns a clean absolute path starting with \`/\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def normalize_linux_path(path_segments):
    # Return normalized path string
    pass
`,
    solutionCode: `def normalize_linux_path(path_segments):
    cleaned = [seg.strip('/') for seg in path_segments if seg and seg.strip('/')]
    return '/' + '/'.join(cleaned)`,
    hints: ["Strip leading/trailing slashes", "Join with '/' and prepend '/'"],
    skills: [{"skillId": "linux-fundamentals", "weight": 1.0}],
    testCases: [{"input": "normalize_linux_path(['var', 'log', 'nginx'])", "expectedOutput": "'/var/log/nginx'", "description": "Constructs absolute Linux path", "hidden": false}],
  });

  const linuxL1_Practice = await ActivityModel.create({
    lessonId: linuxL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Parse File Absolute Paths`,
    order: 3,
    challengeRef: linuxL1_Challenge._id,
    content: `# Code Practice: Parse File Absolute Paths\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  linuxL1_Challenge.activityId = linuxL1_Practice._id;
  await linuxL1_Challenge.save();

  const linuxL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Linux Filesystem`,
    description: `Test your knowledge of the Filesystem Hierarchy Standard.`,
    passingScore: 70,
    skills: [{"skillId": "linux-fundamentals", "weight": 1.0}],
    questions: [
    {
        "question": "In the Linux Filesystem Hierarchy Standard (FHS), which directory contains system-wide configuration files?",
        "options": [
            "/bin",
            "/etc",
            "/var",
            "/tmp"
        ],
        "explanation": "/etc is the standard location reserved for all host-specific system and application configuration files.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const linuxL1_Assessment = await ActivityModel.create({
    lessonId: linuxL1._id,
    type: 'QUIZ',
    title: `Assessment: Linux Filesystem`,
    order: 4,
    assessmentRef: linuxL1_Quiz._id,
  });
  linuxL1_Quiz.activityId = linuxL1_Assessment._id;
  await linuxL1_Quiz.save();

  linuxL1.activities = [
    linuxL1_Video._id,
    linuxL1_Notes._id,
    linuxL1_Practice._id,
    linuxL1_Assessment._id,
  ] as any;
  await linuxL1.save();

  // --- Lesson 2: Linux Permissions, Ownership & Octal chmod/chown ---
  const linuxL2 = await LessonModel.create({
    moduleId: linuxMod1._id,
    courseId: linuxCourse._id,
    title: `Linux Permissions, Ownership & Octal chmod/chown`,
    description: `Master user/group/others permission bits, octal calculation (r=4, w=2, x=1), SUID/SGID, and chown.`,
    order: 2,
    activities: [],
  });

  const linuxL2_Video = await ActivityModel.create({
    lessonId: linuxL2._id,
    type: 'VIDEO',
    title: `Video: Linux Permissions Explained (chmod, chown, octal math)`,
    order: 1,
    resourceRef: getRes('Linux File Editing with Echo, Nano and Vim in Tamil')?._id,
    content: `# Key Takeaways:
- Permissions are split into User (u), Group (g), and Others (o).
- Read=4, Write=2, Execute=1.
- SUID and SGID allow binaries to run with file owner/group privileges.`,
  });

  const linuxL2_Notes = await ActivityModel.create({
    lessonId: linuxL2._id,
    type: 'NOTES',
    title: `Codexa Notes: Linux Permissions, Ownership & Octal chmod/chown`,
    order: 2,
    content: `# Linux Permissions, Ownership & Octal chmod/chown

Master user/group/others permission bits, octal calculation (r=4, w=2, x=1), SUID/SGID, and chown.

Linux enforces a multi-user discretionary access control model.

---

### Octal Permission Representation
- **Read ($r$)** = 4
- **Write ($w$)** = 2
- **Execute ($x$)** = 1

\`\`\`text
- rwx r-x r--  =>  (4+2+1)(4+0+1)(4+0+0)  =>  754
  User Group Others
\`\`\`

### Changing Permissions and Ownership
\`\`\`bash
# Grant Owner read/write/execute, Group read/execute, Others none
chmod 750 deploy_script.sh

# Change owner to www-data and group to www-data
chown www-data:www-data /var/www/html -R
\`\`\`

## Why Linux Permissions, Ownership & Octal chmod/chown Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Parse 3-char chunks

> ⚠️ **Common Mistake**: 6 = 4+2 (read+write for owner); 4 = read-only for group; 4 = read-only for others.

## Real-World Production Scenario

In production engineering, **Linux Permissions, Ownership & Octal chmod/chown** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Linux Permissions, Ownership & Octal chmod/chown. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Linux Documentation Project')?._id,
  });

  const linuxL2_Challenge = await ChallengeModel.create({
    title: `Calculate Octal Mode from Permission String`,
    description: `Write a Python function \`calc_octal_perm(perm_str)\` that takes a 9-character string like \`'rwxr-xr--'\` and returns the integer octal representation \`754\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def calc_octal_perm(perm_str):
    # Return integer octal number (e.g. 754)
    pass
`,
    solutionCode: `def calc_octal_perm(perm_str):
    def triplet_to_oct(triplet):
        val = 0
        if triplet[0] == 'r': val += 4
        if triplet[1] == 'w': val += 2
        if triplet[2] == 'x': val += 1
        return val
    u = triplet_to_oct(perm_str[0:3])
    g = triplet_to_oct(perm_str[3:6])
    o = triplet_to_oct(perm_str[6:9])
    return u * 100 + g * 10 + o`,
    hints: ["Parse 3-char chunks", "r=4, w=2, x=1"],
    skills: [{"skillId": "linux-fundamentals", "weight": 1.0}],
    testCases: [{"input": "calc_octal_perm('rwxr-xr--')", "expectedOutput": "754", "description": "Calculates 754 from rwxr-xr--", "hidden": false}],
  });

  const linuxL2_Practice = await ActivityModel.create({
    lessonId: linuxL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Calculate Octal Mode from Permission String`,
    order: 3,
    challengeRef: linuxL2_Challenge._id,
    content: `# Code Practice: Calculate Octal Mode from Permission String\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  linuxL2_Challenge.activityId = linuxL2_Practice._id;
  await linuxL2_Challenge.save();

  const linuxL2_Quiz = await AssessmentModel.create({
    title: `Assessment: Octal Permissions`,
    description: `Test permission calculations and security policies.`,
    passingScore: 70,
    skills: [{"skillId": "linux-fundamentals", "weight": 1.0}],
    questions: [
    {
        "question": "What permission does octal mode 644 grant on a file?",
        "options": [
            "Owner: read/write; Group: read; Others: read",
            "Owner: read/write/execute; Group: read; Others: execute",
            "Owner: read; Group: write; Others: execute",
            "Full access to everyone"
        ],
        "explanation": "6 = 4+2 (read+write for owner); 4 = read-only for group; 4 = read-only for others.",
        "correctOption": 0,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const linuxL2_Assessment = await ActivityModel.create({
    lessonId: linuxL2._id,
    type: 'QUIZ',
    title: `Assessment: Octal Permissions`,
    order: 4,
    assessmentRef: linuxL2_Quiz._id,
  });
  linuxL2_Quiz.activityId = linuxL2_Assessment._id;
  await linuxL2_Quiz.save();

  linuxL2.activities = [
    linuxL2_Video._id,
    linuxL2_Notes._id,
    linuxL2_Practice._id,
    linuxL2_Assessment._id,
  ] as any;
  await linuxL2.save();

  linuxMod1.lessons = [linuxL1._id, linuxL2._id] as any;
  await linuxMod1.save();

  const linuxMod2 = await ModuleModel.create({
    courseId: linuxCourse._id,
    title: `Module 2: Process Management, Signals & Systemd`,
    description: `Master process lifecycle (fork/exec), signals (SIGTERM, SIGKILL), background jobs, systemd unit files, and journalctl.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Linux Processes, Signals & Background Job Control ---
  const linuxL3 = await LessonModel.create({
    moduleId: linuxMod2._id,
    courseId: linuxCourse._id,
    title: `Linux Processes, Signals & Background Job Control`,
    description: `Understand PID, PPID, ps, top/htop, kill signals (15 SIGTERM, 9 SIGKILL), and bg/fg jobs.`,
    order: 1,
    activities: [],
  });

  const linuxL3_Video = await ActivityModel.create({
    lessonId: linuxL3._id,
    type: 'VIDEO',
    title: `Video: Linux Process Management & Signals Tutorial`,
    order: 1,
    resourceRef: getRes('Linux Shell Explained for Beginners in Tamil')?._id,
    content: `# Key Takeaways:
- Every process has a PID and Parent PID (PPID) originating from PID 1 (systemd).
- SIGTERM (15) requests graceful shutdown; SIGKILL (9) terminates immediately at kernel level.
- Background jobs run with trailing & or via nohup / disown.`,
  });

  const linuxL3_Notes = await ActivityModel.create({
    lessonId: linuxL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Linux Processes, Signals & Background Job Control`,
    order: 2,
    content: `# Linux Processes, Signals & Background Job Control

Understand PID, PPID, ps, top/htop, kill signals (15 SIGTERM, 9 SIGKILL), and bg/fg jobs.

Processes represent executing programs with isolated memory address spaces.

---

### Core Process Commands
- \`ps aux | grep node\`: List running processes.
- \`top\` / \`htop\`: Interactive real-time process viewer.
- \`kill -15 <PID>\`: Send **SIGTERM** (graceful shutdown allowing cleanup).
- \`kill -9 <PID>\`: Send **SIGKILL** (un-catchable immediate kernel termination).
- \`kill -HUP <PID>\`: Send **SIGHUP** (reload configuration).

\`\`\`bash
# Run command immune to hangups in background
nohup python3 server.py > server.log 2>&1 &
\`\`\`

## Why Linux Processes, Signals & Background Job Control Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Filter using list comprehension: [pid for pid, cmd in process_list if target_name in cmd]

> ⚠️ **Common Mistake**: SIGTERM gives the application time to execute cleanup handlers. SIGKILL forcibly aborts the process immediately at the kernel level, risking corrupted data files.

## Real-World Production Scenario

In production engineering, **Linux Processes, Signals & Background Job Control** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Linux Processes, Signals & Background Job Control. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Linux Documentation Project')?._id,
  });

  const linuxL3_Challenge = await ChallengeModel.create({
    title: `Parse Process Command Line Arguments`,
    description: `Write a Python function \`filter_pids_by_name(process_list, target_name)\` where \`process_list\` is a list of tuples \`[(101, 'nginx'), (102, 'node server.js')]\`. Return a list of integer PIDs matching \`target_name\` substring.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def filter_pids_by_name(process_list, target_name):
    # Return list of matching PIDs
    pass
`,
    solutionCode: `def filter_pids_by_name(process_list, target_name):
    return [pid for pid, cmd in process_list if target_name in cmd]`,
    hints: ["Filter using list comprehension: [pid for pid, cmd in process_list if target_name in cmd]"],
    skills: [{"skillId": "process-management", "weight": 1.0}],
    testCases: [{"input": "filter_pids_by_name([(101, 'nginx: master'), (102, 'node app.js')], 'node')", "expectedOutput": "[102]", "description": "Filters matching PIDs", "hidden": false}],
  });

  const linuxL3_Practice = await ActivityModel.create({
    lessonId: linuxL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Parse Process Command Line Arguments`,
    order: 3,
    challengeRef: linuxL3_Challenge._id,
    content: `# Code Practice: Parse Process Command Line Arguments\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  linuxL3_Challenge.activityId = linuxL3_Practice._id;
  await linuxL3_Challenge.save();

  const linuxL3_Quiz = await AssessmentModel.create({
    title: `Assessment: Signals & Processes`,
    description: `Test process signal mechanics and graceful shutdown.`,
    passingScore: 70,
    skills: [{"skillId": "process-management", "weight": 1.0}],
    questions: [
    {
        "question": "Why should SIGTERM (15) always be attempted before sending SIGKILL (9) to a running service?",
        "options": [
            "SIGKILL does not work on root processes",
            "SIGTERM allows the process to intercept the signal, close database connections, finish active requests, and flush disk buffers cleanly",
            "SIGKILL is deprecated in Linux",
            "SIGTERM requires rebooting the system"
        ],
        "explanation": "SIGTERM gives the application time to execute cleanup handlers. SIGKILL forcibly aborts the process immediately at the kernel level, risking corrupted data files.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const linuxL3_Assessment = await ActivityModel.create({
    lessonId: linuxL3._id,
    type: 'QUIZ',
    title: `Assessment: Signals & Processes`,
    order: 4,
    assessmentRef: linuxL3_Quiz._id,
  });
  linuxL3_Quiz.activityId = linuxL3_Assessment._id;
  await linuxL3_Quiz.save();

  linuxL3.activities = [
    linuxL3_Video._id,
    linuxL3_Notes._id,
    linuxL3_Practice._id,
    linuxL3_Assessment._id,
  ] as any;
  await linuxL3.save();

  // --- Lesson 2: Systemd Service Units & Journalctl Logging ---
  const linuxL4 = await LessonModel.create({
    moduleId: linuxMod2._id,
    courseId: linuxCourse._id,
    title: `Systemd Service Units & Journalctl Logging`,
    description: `Author production systemd \`.service\` files, configure restart policies, and query logs with journalctl.`,
    order: 2,
    activities: [],
  });

  const linuxL4_Video = await ActivityModel.create({
    lessonId: linuxL4._id,
    type: 'VIDEO',
    title: `Video: Systemd Service Units & Journalctl Tutorial`,
    order: 1,
    resourceRef: getRes('Top Essential Linux Commands for DevOps in Tamil')?._id,
    content: `# Key Takeaways:
- Systemd is PID 1, managing daemons, targets, and dependencies.
- Service unit files define ExecStart, Restart=always, and User context.
- journalctl queries structured binary system logs across boots.`,
  });

  const linuxL4_Notes = await ActivityModel.create({
    lessonId: linuxL4._id,
    type: 'NOTES',
    title: `Codexa Notes: Systemd Service Units & Journalctl Logging`,
    order: 2,
    content: `# Systemd Service Units & Journalctl Logging

Author production systemd \`.service\` files, configure restart policies, and query logs with journalctl.

Systemd is the standard init system and service manager for Linux.

---

### Authoring a Systemd Service File (\`/etc/systemd/system/codexa-api.service\`)
\`\`\`ini
[Unit]
Description=Codexa Production Backend API
After=network.target mongodb.service

[Service]
Type=simple
User=nodeapp
WorkingDirectory=/opt/codexa/api
ExecStart=/usr/bin/node /opt/codexa/api/dist/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production PORT=5000

[Install]
WantedBy=multi-user.target
\`\`\`

### Management Commands
\`\`\`bash
sudo systemctl daemon-reload
sudo systemctl enable --now codexa-api
sudo journalctl -u codexa-api -f -n 100
\`\`\`

## Why Systemd Service Units & Journalctl Logging Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check presence of '[Unit]', '[Service]', and '[Install]'

> ⚠️ **Common Mistake**: \`systemctl daemon-reload\` rescans unit files in \`/etc/systemd/system\` and rebuilds the dependency tree.

## Real-World Production Scenario

In production engineering, **Systemd Service Units & Journalctl Logging** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Systemd Service Units & Journalctl Logging. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Linux Documentation Project')?._id,
  });

  const linuxL4_Challenge = await ChallengeModel.create({
    title: `Validate Systemd Service Unit Structure`,
    description: `Write a Python function \`validate_service_unit(unit_content)\` that returns True if \`unit_content\` contains all three required section headers: \`[Unit]\`, \`[Service]\`, and \`[Install]\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def validate_service_unit(unit_content):
    # Return boolean
    pass
`,
    solutionCode: `def validate_service_unit(unit_content):
    return '[Unit]' in unit_content and '[Service]' in unit_content and '[Install]' in unit_content`,
    hints: ["Check presence of '[Unit]', '[Service]', and '[Install]'"],
    skills: [{"skillId": "system-administration", "weight": 1.0}],
    testCases: [{"input": "validate_service_unit('[Unit]\\nDesc=A\\n[Service]\\nExecStart=/bin/app\\n[Install]\\nWantedBy=multi-user.target')", "expectedOutput": "True", "description": "Validates systemd unit structure", "hidden": false}],
  });

  const linuxL4_Practice = await ActivityModel.create({
    lessonId: linuxL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Validate Systemd Service Unit Structure`,
    order: 3,
    challengeRef: linuxL4_Challenge._id,
    content: `# Code Practice: Validate Systemd Service Unit Structure\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  linuxL4_Challenge.activityId = linuxL4_Practice._id;
  await linuxL4_Challenge.save();

  const linuxL4_Quiz = await AssessmentModel.create({
    title: `Assessment: Systemd Daemons`,
    description: `Test service unit syntax and daemon management.`,
    passingScore: 70,
    skills: [{"skillId": "system-administration", "weight": 1.0}],
    questions: [
    {
        "question": "Which command must be executed after creating or editing a systemd unit file for systemd to recognize the changes?",
        "options": [
            "systemctl restart all",
            "systemctl daemon-reload",
            "systemctl sync",
            "reboot"
        ],
        "explanation": "`systemctl daemon-reload` rescans unit files in `/etc/systemd/system` and rebuilds the dependency tree.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const linuxL4_Assessment = await ActivityModel.create({
    lessonId: linuxL4._id,
    type: 'QUIZ',
    title: `Assessment: Systemd Daemons`,
    order: 4,
    assessmentRef: linuxL4_Quiz._id,
  });
  linuxL4_Quiz.activityId = linuxL4_Assessment._id;
  await linuxL4_Quiz.save();

  linuxL4.activities = [
    linuxL4_Video._id,
    linuxL4_Notes._id,
    linuxL4_Practice._id,
    linuxL4_Assessment._id,
  ] as any;
  await linuxL4.save();

  linuxMod2.lessons = [linuxL3._id, linuxL4._id] as any;
  await linuxMod2.save();

  const linuxMod3 = await ModuleModel.create({
    courseId: linuxCourse._id,
    title: `Module 3: Text Processing, Streams & Pipelines`,
    description: `Master stdin/stdout/stderr redirections, pipelines, grep pattern search, sed stream editing, and awk columnar analysis.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: Standard Streams, Redirection & Pipelines ---
  const linuxL5 = await LessonModel.create({
    moduleId: linuxMod3._id,
    courseId: linuxCourse._id,
    title: `Standard Streams, Redirection & Pipelines`,
    description: `Master file descriptors (0 stdin, 1 stdout, 2 stderr), \`2>&1\`, tee, and pipelined filters.`,
    order: 1,
    activities: [],
  });

  const linuxL5_Video = await ActivityModel.create({
    lessonId: linuxL5._id,
    type: 'VIDEO',
    title: `Video: Linux Streams, Redirections & Pipes Explained`,
    order: 1,
    resourceRef: getRes('Bash Shell Scripting for Beginners in Tamil')?._id,
    content: `# Key Takeaways:
- File descriptor 0 is stdin, 1 is stdout, 2 is stderr.
- Use \`>\` to overwrite, \`>>\` to append, and \`2>&1\` to merge stderr into stdout.
- Pipes (\`|\`) stream the stdout of one process into stdin of another.`,
  });

  const linuxL5_Notes = await ActivityModel.create({
    lessonId: linuxL5._id,
    type: 'NOTES',
    title: `Codexa Notes: Standard Streams, Redirection & Pipelines`,
    order: 2,
    content: `# Standard Streams, Redirection & Pipelines

Master file descriptors (0 stdin, 1 stdout, 2 stderr), \`2>&1\`, tee, and pipelined filters.

The Unix philosophy connects simple single-purpose tools via standard byte streams.

---

### File Descriptors & Redirection
- \`0\`: Standard Input (\`stdin\`)
- \`1\`: Standard Output (\`stdout\`)
- \`2\`: Standard Error (\`stderr\`)

\`\`\`bash
# Redirect stdout to file (overwrite)
echo "test" > output.txt

# Append stderr to error log
./deploy.sh 2>> errors.log

# Merge stderr into stdout and write to single file
./build.sh > build.log 2>&1

# Pipe stdout to tee to write to file AND display on terminal simultaneously
make build | tee build.log
\`\`\`

## Why Standard Streams, Redirection & Pipelines Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check merge_stderr boolean

> ⚠️ **Common Mistake**: \`2>&1\` duplicates file descriptor 2 to file descriptor 1, merging standard error with standard output.

## Real-World Production Scenario

In production engineering, **Standard Streams, Redirection & Pipelines** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Standard Streams, Redirection & Pipelines. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Linux Documentation Project')?._id,
  });

  const linuxL5_Challenge = await ChallengeModel.create({
    title: `Format Stream Redirection Command`,
    description: `Write a Python function \`format_redirect_command(cmd, log_file, merge_stderr=True)\` that returns \`f'{cmd} > {log_file} 2>&1'\` if \`merge_stderr\` is True, otherwise \`f'{cmd} > {log_file}'\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def format_redirect_command(cmd, log_file, merge_stderr=True):
    # Return string command
    pass
`,
    solutionCode: `def format_redirect_command(cmd, log_file, merge_stderr=True):
    if merge_stderr:
        return f'{cmd} > {log_file} 2>&1'
    return f'{cmd} > {log_file}'`,
    hints: ["Check merge_stderr boolean", "Append ' 2>&1' when True"],
    skills: [{"skillId": "bash-scripting", "weight": 1.0}],
    testCases: [{"input": "format_redirect_command('npm test', 'test.log', True)", "expectedOutput": "'npm test > test.log 2>&1'", "description": "Formats merged redirection", "hidden": false}],
  });

  const linuxL5_Practice = await ActivityModel.create({
    lessonId: linuxL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Format Stream Redirection Command`,
    order: 3,
    challengeRef: linuxL5_Challenge._id,
    content: `# Code Practice: Format Stream Redirection Command\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  linuxL5_Challenge.activityId = linuxL5_Practice._id;
  await linuxL5_Challenge.save();

  const linuxL5_Quiz = await AssessmentModel.create({
    title: `Assessment: Redirections & Pipes`,
    description: `Test stream manipulation and file descriptor rules.`,
    passingScore: 70,
    skills: [{"skillId": "linux-fundamentals", "weight": 1.0}],
    questions: [
    {
        "question": "What does the construct `2>&1` accomplish in a shell command?",
        "options": [
            "Multiplies stdout by 2",
            "Redirects File Descriptor 2 (stderr) to wherever File Descriptor 1 (stdout) is currently pointing",
            "Runs the command twice in the background",
            "Sets the process exit code to 1"
        ],
        "explanation": "`2>&1` duplicates file descriptor 2 to file descriptor 1, merging standard error with standard output.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const linuxL5_Assessment = await ActivityModel.create({
    lessonId: linuxL5._id,
    type: 'QUIZ',
    title: `Assessment: Redirections & Pipes`,
    order: 4,
    assessmentRef: linuxL5_Quiz._id,
  });
  linuxL5_Quiz.activityId = linuxL5_Assessment._id;
  await linuxL5_Quiz.save();

  linuxL5.activities = [
    linuxL5_Video._id,
    linuxL5_Notes._id,
    linuxL5_Practice._id,
    linuxL5_Assessment._id,
  ] as any;
  await linuxL5.save();

  // --- Lesson 2: Stream Processing with grep, sed, and awk ---
  const linuxL6 = await LessonModel.create({
    moduleId: linuxMod3._id,
    courseId: linuxCourse._id,
    title: `Stream Processing with grep, sed, and awk`,
    description: `Search logs with ripgrep/grep, substitute patterns with sed stream editor, and analyze column data with awk.`,
    order: 2,
    activities: [],
  });

  const linuxL6_Video = await ActivityModel.create({
    lessonId: linuxL6._id,
    type: 'VIDEO',
    title: `Video: grep, sed, and awk Tutorial - Linux Text Processing`,
    order: 1,
    resourceRef: getRes('Bash Shell Scripting for Beginners in Tamil')?._id,
    content: `# Key Takeaways:
- grep filters lines matching regular expressions.
- sed performs fast stream text transformations and regex replacements.
- awk is a full columnar data-processing language for reporting and sums.`,
  });

  const linuxL6_Notes = await ActivityModel.create({
    lessonId: linuxL6._id,
    type: 'NOTES',
    title: `Codexa Notes: Stream Processing with grep, sed, and awk`,
    order: 2,
    content: `# Stream Processing with grep, sed, and awk

Search logs with ripgrep/grep, substitute patterns with sed stream editor, and analyze column data with awk.

Text processing tools allow parsing gigabytes of log data directly in the terminal.

---

### 1. grep / ripgrep
\`\`\`bash
grep -E "(ERROR|FATAL)" /var/log/syslog -i -C 2
\`\`\`

### 2. sed (Stream Editor)
\`\`\`bash
# Substitute 'http://' with 'https://' in file
sed -i 's/http:\\/\\//https:\\/\\//g' config.env
\`\`\`

### 3. awk (Columnar Processing)
\`\`\`bash
# Sum total bandwidth (column 10) in Nginx access logs
awk '{ sum += $10 } END { print "Total GB:", sum / (1024^3) }' /var/log/nginx/access.log
\`\`\`

## Why Stream Processing with grep, sed, and awk Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use regex r'\\s([1-5]\\d\\d)\\s'

> ⚠️ **Common Mistake**: In awk, \`$0\` holds the entire un-split record (line), while \`$1\`, \`$2\`, etc. hold individual delimited fields.

## Real-World Production Scenario

In production engineering, **Stream Processing with grep, sed, and awk** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Stream Processing with grep, sed, and awk. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Linux Documentation Project')?._id,
  });

  const linuxL6_Challenge = await ChallengeModel.create({
    title: `Extract Nginx Status Codes with Python Regex`,
    description: `Write a Python function \`extract_status_codes(log_lines)\` that searches for 3-digit HTTP status codes (e.g. 200, 404, 500) surrounded by spaces in a list of log strings and returns a list of integer status codes.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `import re

def extract_status_codes(log_lines):
    # Return list of integer codes
    pass
`,
    solutionCode: `import re

def extract_status_codes(log_lines):
    codes = []
    pattern = re.compile(r'\\s([1-5]\\d\\d)\\s')
    for line in log_lines:
        match = pattern.search(line)
        if match:
            codes.append(int(match.group(1)))
    return codes`,
    hints: ["Use regex r'\\s([1-5]\\d\\d)\\s'", "Cast match.group(1) to int"],
    skills: [{"skillId": "linux-fundamentals", "weight": 1.0}],
    testCases: [{"input": "extract_status_codes(['GET /api 200 1420', 'POST /login 401 50'])", "expectedOutput": "[200, 401]", "description": "Extracts status codes", "hidden": false}],
  });

  const linuxL6_Practice = await ActivityModel.create({
    lessonId: linuxL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Extract Nginx Status Codes with Python Regex`,
    order: 3,
    challengeRef: linuxL6_Challenge._id,
    content: `# Code Practice: Extract Nginx Status Codes with Python Regex\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  linuxL6_Challenge.activityId = linuxL6_Practice._id;
  await linuxL6_Challenge.save();

  const linuxL6_Quiz = await AssessmentModel.create({
    title: `Assessment: Text Processing`,
    description: `Test knowledge of grep, sed, and awk stream transformations.`,
    passingScore: 70,
    skills: [{"skillId": "linux-fundamentals", "weight": 1.0}],
    questions: [
    {
        "question": "In awk, what does the special variable `$0` represent?",
        "options": [
            "The first column of the input line",
            "The entire current input line",
            "The line number",
            "The process ID"
        ],
        "explanation": "In awk, `$0` holds the entire un-split record (line), while `$1`, `$2`, etc. hold individual delimited fields.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const linuxL6_Assessment = await ActivityModel.create({
    lessonId: linuxL6._id,
    type: 'QUIZ',
    title: `Assessment: Text Processing`,
    order: 4,
    assessmentRef: linuxL6_Quiz._id,
  });
  linuxL6_Quiz.activityId = linuxL6_Assessment._id;
  await linuxL6_Quiz.save();

  linuxL6.activities = [
    linuxL6_Video._id,
    linuxL6_Notes._id,
    linuxL6_Practice._id,
    linuxL6_Assessment._id,
  ] as any;
  await linuxL6.save();

  linuxMod3.lessons = [linuxL5._id, linuxL6._id] as any;
  await linuxMod3.save();

  const linuxMod4 = await ModuleModel.create({
    courseId: linuxCourse._id,
    title: `Module 4: Bash Scripting & Automation`,
    description: `Master bash variables, exit codes ($?), conditional branching, loops, functions, trap signal handlers, and crontab.`,
    order: 4,
    lessons: [],
  });

  // --- Lesson 1: Robust Bash Scripting: Flags, Logic & Error Traps ---
  const linuxL7 = await LessonModel.create({
    moduleId: linuxMod4._id,
    courseId: linuxCourse._id,
    title: `Robust Bash Scripting: Flags, Logic & Error Traps`,
    description: `Learn \`set -euo pipefail\`, exit codes ($?), conditional \`[[ ]]\`, and signal trapping with \`trap\`.`,
    order: 1,
    activities: [],
  });

  const linuxL7_Video = await ActivityModel.create({
    lessonId: linuxL7._id,
    type: 'VIDEO',
    title: `Video: How to Write Production-Grade Bash Scripts`,
    order: 1,
    resourceRef: getRes('Bash Shell Scripting for Beginners in Tamil')?._id,
    content: `# Key Takeaways:
- Always start scripts with \`set -euo pipefail\` for strict fail-fast execution.
- Check exit code \`$?\` (0 = success, non-zero = error).
- Use \`trap 'cleanup' EXIT\` to ensure temporary files are wiped even on failure.`,
  });

  const linuxL7_Notes = await ActivityModel.create({
    lessonId: linuxL7._id,
    type: 'NOTES',
    title: `Codexa Notes: Robust Bash Scripting: Flags, Logic & Error Traps`,
    order: 2,
    content: `# Robust Bash Scripting: Flags, Logic & Error Traps

Learn \`set -euo pipefail\`, exit codes ($?), conditional \`[[ ]]\`, and signal trapping with \`trap\`.

Writing robust automation scripts requires strict error handling and cleanup routines.

---

### The Unofficial Strict Mode
\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\\n\\t'

# -e: Exit immediately if a command exits with a non-zero status
# -u: Treat unset variables as an error
# -o pipefail: Return the exit code of the last failing command in a pipeline
\`\`\`

### Trap Signal Cleanups
\`\`\`bash
TEMP_DIR=$(mktemp -d)
cleanup() {
    echo "Cleaning up temporary files..."
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT INT TERM
\`\`\`

## Why Robust Bash Scripting: Flags, Logic & Error Traps Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Include #!/usr/bin/env bash and set -euo pipefail

> ⚠️ **Common Mistake**: By default, bash returns only the exit code of the last command in a pipeline. \`set -o pipefail\` causes the pipeline to fail if any intermediate command produces an error.

## Real-World Production Scenario

In production engineering, **Robust Bash Scripting: Flags, Logic & Error Traps** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Robust Bash Scripting: Flags, Logic & Error Traps. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Linux Documentation Project')?._id,
  });

  const linuxL7_Challenge = await ChallengeModel.create({
    title: `Generate Strict Bash Script Header`,
    description: `Write a Python function \`generate_bash_header(author, desc)\` that returns a formatted bash script header containing \`#!/usr/bin/env bash\`, \`set -euo pipefail\`, author, and description comments.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def generate_bash_header(author, desc):
    # Return string bash header
    pass
`,
    solutionCode: `def generate_bash_header(author, desc):
    return f'#!/usr/bin/env bash\\n# Author: {author}\\n# Description: {desc}\\nset -euo pipefail\\n'`,
    hints: ["Include #!/usr/bin/env bash and set -euo pipefail"],
    skills: [{"skillId": "bash-scripting", "weight": 1.0}],
    testCases: [{"input": "generate_bash_header('Spix', 'Deploy')", "expectedOutput": "'#!/usr/bin/env bash\\n# Author: Spix\\n# Description: Deploy\\nset -euo pipefail\\n'", "description": "Generates strict bash script template", "hidden": false}],
  });

  const linuxL7_Practice = await ActivityModel.create({
    lessonId: linuxL7._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Generate Strict Bash Script Header`,
    order: 3,
    challengeRef: linuxL7_Challenge._id,
    content: `# Code Practice: Generate Strict Bash Script Header\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  linuxL7_Challenge.activityId = linuxL7_Practice._id;
  await linuxL7_Challenge.save();

  const linuxL7_Quiz = await AssessmentModel.create({
    title: `Assessment: Robust Bash Scripting`,
    description: `Test bash strict mode and exit code semantics.`,
    passingScore: 70,
    skills: [{"skillId": "bash-scripting", "weight": 1.0}],
    questions: [
    {
        "question": "What is the purpose of enabling `set -o pipefail` in a bash script?",
        "options": [
            "It speeds up pipe execution by 50%",
            "It ensures that a pipeline returns a failure status if any command in the chain fails, rather than only reporting the exit code of the final command",
            "It compresses piped stdout streams",
            "It disables stderr"
        ],
        "explanation": "By default, bash returns only the exit code of the last command in a pipeline. `set -o pipefail` causes the pipeline to fail if any intermediate command produces an error.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const linuxL7_Assessment = await ActivityModel.create({
    lessonId: linuxL7._id,
    type: 'QUIZ',
    title: `Assessment: Robust Bash Scripting`,
    order: 4,
    assessmentRef: linuxL7_Quiz._id,
  });
  linuxL7_Quiz.activityId = linuxL7_Assessment._id;
  await linuxL7_Quiz.save();

  linuxL7.activities = [
    linuxL7_Video._id,
    linuxL7_Notes._id,
    linuxL7_Practice._id,
    linuxL7_Assessment._id,
  ] as any;
  await linuxL7.save();

  // --- Lesson 2: Cron Jobs, Scheduling & Production Automation ---
  const linuxL8 = await LessonModel.create({
    moduleId: linuxMod4._id,
    courseId: linuxCourse._id,
    title: `Cron Jobs, Scheduling & Production Automation`,
    description: `Master standard crontab 5-field syntax, environment differences in cron, and systemd timers.`,
    order: 2,
    activities: [],
  });

  const linuxL8_Video = await ActivityModel.create({
    lessonId: linuxL8._id,
    type: 'VIDEO',
    title: `Video: Linux Crontab & Task Scheduling Explained`,
    order: 1,
    resourceRef: getRes('Linux Shell Variables and Environment Export in Tamil')?._id,
    content: `# Key Takeaways:
- Crontab syntax has 5 fields: Minute, Hour, Day-of-month, Month, Day-of-week.
- Cron jobs run in a stripped-down minimal shell environment; always use absolute binary paths.
- Systemd timers provide modern logging and dependency handling over legacy cron.`,
  });

  const linuxL8_Notes = await ActivityModel.create({
    lessonId: linuxL8._id,
    type: 'NOTES',
    title: `Codexa Notes: Cron Jobs, Scheduling & Production Automation`,
    order: 2,
    content: `# Cron Jobs, Scheduling & Production Automation

Master standard crontab 5-field syntax, environment differences in cron, and systemd timers.

Automating recurring tasks in production requires precise scheduling syntax and environmental awareness.

---

### Crontab 5-Field Syntax
\`\`\`text
┌───────────── Minute (0 - 59)
│ ┌───────────── Hour (0 - 23)
│ │ ┌───────────── Day of Month (1 - 31)
│ │ │ ┌───────────── Month (1 - 12)
│ │ │ │ ┌───────────── Day of Week (0 - 6, 0=Sunday)
│ │ │ │ │
* * * * * command_to_execute
\`\`\`

### Examples
\`\`\`text
# Run database backup every night at 02:30 AM
30 2 * * * /usr/local/bin/backup-db.sh >> /var/log/backup.log 2>&1

# Run healthcheck every 15 minutes
*/15 * * * * /usr/bin/curl -s https://api.codexa.dev/health
\`\`\`

## Why Cron Jobs, Scheduling & Production Automation Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Split string by whitespace and check len == 5

> ⚠️ **Common Mistake**: Cron runs in an isolated non-interactive environment with a minimal PATH (often only \`/usr/bin:/bin\`). Commands without absolute paths fail to resolve.

## Real-World Production Scenario

In production engineering, **Cron Jobs, Scheduling & Production Automation** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Cron Jobs, Scheduling & Production Automation. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Linux Documentation Project')?._id,
  });

  const linuxL8_Challenge = await ChallengeModel.create({
    title: `Validate Crontab 5-Field Expression Format`,
    description: `Write a Python function \`is_valid_cron_expression(expr)\` that returns True if \`expr.strip().split()\` contains exactly 5 fields.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def is_valid_cron_expression(expr):
    # Return boolean
    pass
`,
    solutionCode: `def is_valid_cron_expression(expr):
    fields = expr.strip().split()
    return len(fields) == 5`,
    hints: ["Split string by whitespace and check len == 5"],
    skills: [{"skillId": "linux-fundamentals", "weight": 1.0}],
    testCases: [{"input": "is_valid_cron_expression('*/15 * * * *')", "expectedOutput": "True", "description": "Validates 5-field cron schedule", "hidden": false}],
  });

  const linuxL8_Practice = await ActivityModel.create({
    lessonId: linuxL8._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Validate Crontab 5-Field Expression Format`,
    order: 3,
    challengeRef: linuxL8_Challenge._id,
    content: `# Code Practice: Validate Crontab 5-Field Expression Format\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  linuxL8_Challenge.activityId = linuxL8_Practice._id;
  await linuxL8_Challenge.save();

  const linuxL8_Quiz = await AssessmentModel.create({
    title: `Assessment: Cron & Scheduling`,
    description: `Test cron schedule strings and environment pitfalls.`,
    passingScore: 70,
    skills: [{"skillId": "linux-fundamentals", "weight": 1.0}],
    questions: [
    {
        "question": "Why do scripts that run fine interactively often fail when executed as automated cron jobs?",
        "options": [
            "Cron cannot execute bash scripts",
            "Cron executes in a minimal environment with a restricted PATH and missing user environment variables, causing commands with relative paths to fail",
            "Cron disables network access",
            "Cron only runs Python"
        ],
        "explanation": "Cron runs in an isolated non-interactive environment with a minimal PATH (often only `/usr/bin:/bin`). Commands without absolute paths fail to resolve.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const linuxL8_Assessment = await ActivityModel.create({
    lessonId: linuxL8._id,
    type: 'QUIZ',
    title: `Assessment: Cron & Scheduling`,
    order: 4,
    assessmentRef: linuxL8_Quiz._id,
  });
  linuxL8_Quiz.activityId = linuxL8_Assessment._id;
  await linuxL8_Quiz.save();

  linuxL8.activities = [
    linuxL8_Video._id,
    linuxL8_Notes._id,
    linuxL8_Practice._id,
    linuxL8_Assessment._id,
  ] as any;
  await linuxL8.save();

  linuxMod4.lessons = [linuxL7._id, linuxL8._id] as any;
  await linuxMod4.save();

  linuxCourse.modules = [linuxMod1._id, linuxMod2._id, linuxMod3._id, linuxMod4._id] as any;
  await linuxCourse.save();

  // =========================================================================
  // 2. GIT & GITHUB (4 MODULES, 8 LESSONS)
  // =========================================================================
  const gitCourse = await CourseModel.create({
    slug: 'git-and-github',
    title: 'Git Version Control & Professional GitHub Workflows',
    description: 'Master Git internals (DAG, objects, refs), branch strategies, resolving complex merge conflicts, interactive rebasing, git reflog recovery, and GitHub Actions CI pipelines.',
    domain: 'DevOps / Cloud / Systems',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    estimatedHours: 30,
    skillsCovered: ['git-workflow', 'version-control', 'github-actions', 'branching-strategies'],
    prerequisites: ['Basic command line familiarity'],
    modules: [],
  });

  const gitMod1 = await ModuleModel.create({
    courseId: gitCourse._id,
    title: `Module 1: Git Foundations & Plumbing vs Porcelain`,
    description: `Understand Directed Acyclic Graphs (DAG), SHA-1 hashing, Blobs, Trees, Commits, and atomic staging.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: Git Architecture: DAG, Blobs, Trees, and Commits ---
  const gitL1 = await LessonModel.create({
    moduleId: gitMod1._id,
    courseId: gitCourse._id,
    title: `Git Architecture: DAG, Blobs, Trees, and Commits`,
    description: `Explore the .git directory structure, content-addressable storage, and object immutability.`,
    order: 1,
    activities: [],
  });

  const gitL1_Video = await ActivityModel.create({
    lessonId: gitL1._id,
    type: 'VIDEO',
    title: `Video: Git Under the Hood: How Git Actually Works`,
    order: 1,
    resourceRef: getRes('Git & GitHub Introduction for Beginners in Tamil')?._id,
    content: `# Key Takeaways:
- Git is a content-addressable key-value store keyed by SHA-1 hashes.
- Blobs store file data; Trees store folder structures; Commits point to top-level trees.
- Commits form an immutable Directed Acyclic Graph (DAG) pointing to parent commits.`,
  });

  const gitL1_Notes = await ActivityModel.create({
    lessonId: gitL1._id,
    type: 'NOTES',
    title: `Codexa Notes: Git Architecture: DAG, Blobs, Trees, and Commits`,
    order: 2,
    content: `# Git Architecture: DAG, Blobs, Trees, and Commits

Explore the .git directory structure, content-addressable storage, and object immutability.

Git represents project history as an immutable Directed Acyclic Graph (DAG) of cryptographic snapshots.

---

### The 4 Core Object Types
1. **Blob**: Raw binary file contents (no metadata or filename).
2. **Tree**: Directory list associating filenames, permissions, and blob/tree SHA hashes.
3. **Commit**: Points to root Tree, parent commit SHA(s), author, committer, and commit message.
4. **Annotated Tag**: Fixed pointer to a specific commit object with a message and signature.

\`\`\`text
Commit [e4a1b2] ──► Tree [8c3f9a]
                        ├── Blob [1a2b3c] (README.md)
                        └── Tree [4d5e6f] (src/)
                                └── Blob [7a8b9c] (index.ts)
\`\`\`

## Why Git Architecture: DAG, Blobs, Trees, and Commits Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Header is f'blob {len(content)}\\0'

> ⚠️ **Common Mistake**: Trees record directory hierarchy, mapping filenames and file modes to their corresponding blob SHA-1 hashes.

## Real-World Production Scenario

In production engineering, **Git Architecture: DAG, Blobs, Trees, and Commits** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Git Architecture: DAG, Blobs, Trees, and Commits. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Git-SCM: Pro Git Book')?._id,
  });

  const gitL1_Challenge = await ChallengeModel.create({
    title: `Simulate Git Object Hash Generation`,
    description: `Write a Python function \`git_blob_hash(content_str)\` that formats the string as \`f'blob {len(content_str)}\\0{content_str}'\` and returns its SHA-1 hex digest using hashlib.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `import hashlib

def git_blob_hash(content_str):
    # Return SHA-1 hex digest
    pass
`,
    solutionCode: `import hashlib

def git_blob_hash(content_str):
    header = f'blob {len(content_str)}\\0'
    store = header.encode('utf-8') + content_str.encode('utf-8')
    return hashlib.sha1(store).hexdigest()`,
    hints: ["Header is f'blob {len(content)}\\0'", "Hash with hashlib.sha1(bytes).hexdigest()"],
    skills: [{"skillId": "git-workflow", "weight": 1.0}],
    testCases: [{"input": "git_blob_hash('hello world\\n')", "expectedOutput": "'3b18e512dba79e4c8300dd08aeb37f8e728b8dad'", "description": "Computes exact Git blob SHA-1", "hidden": false}],
  });

  const gitL1_Practice = await ActivityModel.create({
    lessonId: gitL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Simulate Git Object Hash Generation`,
    order: 3,
    challengeRef: gitL1_Challenge._id,
    content: `# Code Practice: Simulate Git Object Hash Generation\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  gitL1_Challenge.activityId = gitL1_Practice._id;
  await gitL1_Challenge.save();

  const gitL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Git Object Model`,
    description: `Test knowledge of Blobs, Trees, and DAG references.`,
    passingScore: 70,
    skills: [{"skillId": "git-workflow", "weight": 1.0}],
    questions: [
    {
        "question": "In Git's internal object store, which object type stores filenames and directory folder structures?",
        "options": [
            "Blob",
            "Tree",
            "Tag",
            "Branch pointer"
        ],
        "explanation": "Trees record directory hierarchy, mapping filenames and file modes to their corresponding blob SHA-1 hashes.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const gitL1_Assessment = await ActivityModel.create({
    lessonId: gitL1._id,
    type: 'QUIZ',
    title: `Assessment: Git Object Model`,
    order: 4,
    assessmentRef: gitL1_Quiz._id,
  });
  gitL1_Quiz.activityId = gitL1_Assessment._id;
  await gitL1_Quiz.save();

  gitL1.activities = [
    gitL1_Video._id,
    gitL1_Notes._id,
    gitL1_Practice._id,
    gitL1_Assessment._id,
  ] as any;
  await gitL1.save();

  // --- Lesson 2: The Staging Area, Diffing & Atomic Commits ---
  const gitL2 = await LessonModel.create({
    moduleId: gitMod1._id,
    courseId: gitCourse._id,
    title: `The Staging Area, Diffing & Atomic Commits`,
    description: `Master Working Directory vs Index (Staging) vs HEAD, git diff, patch staging (git add -p), and conventional commit formatting.`,
    order: 2,
    activities: [],
  });

  const gitL2_Video = await ActivityModel.create({
    lessonId: gitL2._id,
    type: 'VIDEO',
    title: `Video: Git Staging Area & Crafting Clean Atomic Commits`,
    order: 1,
    resourceRef: getRes('Master Git Basics in Minutes in Tamil')?._id,
    content: `# Key Takeaways:
- The Index (staging area) allows crafting precise, intentional commit snapshots.
- \`git add -p\` stages individual hunks for atomic logical grouping.
- Conventional Commits (\`feat:\`, \`fix:\`, \`refactor:\`) standardize history.`,
  });

  const gitL2_Notes = await ActivityModel.create({
    lessonId: gitL2._id,
    type: 'NOTES',
    title: `Codexa Notes: The Staging Area, Diffing & Atomic Commits`,
    order: 2,
    content: `# The Staging Area, Diffing & Atomic Commits

Master Working Directory vs Index (Staging) vs HEAD, git diff, patch staging (git add -p), and conventional commit formatting.

Git tracks changes across three distinct areas: Working Directory, Index (Staging Area), and HEAD commit.

---

### The Three Areas
\`\`\`text
Working Directory  ──(git add)──►  Index (Staging)  ──(git commit)──►  HEAD (Repository)
\`\`\`

### Partial Hunk Staging (\`git add -p\`)
Allows staging specific lines of changes without committing unrelated debugging code:
\`\`\`bash
# Interactively review and stage code hunks
git add -p
# [y] stage hunk, [n] do not stage, [s] split into smaller hunks, [e] manually edit
\`\`\`

### Conventional Commit Message Format
\`\`\`text
feat(auth): add JWT token refresh endpoint
fix(database): prevent connection pool exhaustion on timeouts
refactor(ui): extract reusable Button component
\`\`\`

## Why The Staging Area, Diffing & Atomic Commits Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use regex matching conventional commit prefix followed by colon and message

> ⚠️ **Common Mistake**: Atomic commits contain a single self-contained logical unit of work, allowing easy rollbacks, clean bisects, and clear changelogs.

## Real-World Production Scenario

In production engineering, **The Staging Area, Diffing & Atomic Commits** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of The Staging Area, Diffing & Atomic Commits. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Git-SCM: Pro Git Book')?._id,
  });

  const gitL2_Challenge = await ChallengeModel.create({
    title: `Validate Conventional Commit Message Format`,
    description: `Write a Python function \`is_valid_conventional_commit(msg)\` that returns True if \`msg\` starts with one of: \`feat:\`, \`fix:\`, \`docs:\`, \`style:\`, \`refactor:\`, \`test:\`, \`chore:\`, or their scoped versions like \`feat(scope):\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `import re

def is_valid_conventional_commit(msg):
    # Return boolean
    pass
`,
    solutionCode: `import re

def is_valid_conventional_commit(msg):
    pattern = r'^(feat|fix|docs|style|refactor|test|chore)(\\([a-zA-Z0-9_-]+\\))?:\\s.+$'
    return bool(re.match(pattern, msg.strip()))`,
    hints: ["Use regex matching conventional commit prefix followed by colon and message"],
    skills: [{"skillId": "git-workflow", "weight": 1.0}],
    testCases: [{"input": "is_valid_conventional_commit('feat(auth): support OAuth2')", "expectedOutput": "True", "description": "Validates scoped conventional commit", "hidden": false}],
  });

  const gitL2_Practice = await ActivityModel.create({
    lessonId: gitL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Validate Conventional Commit Message Format`,
    order: 3,
    challengeRef: gitL2_Challenge._id,
    content: `# Code Practice: Validate Conventional Commit Message Format\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  gitL2_Challenge.activityId = gitL2_Practice._id;
  await gitL2_Challenge.save();

  const gitL2_Quiz = await AssessmentModel.create({
    title: `Assessment: Staging & Conventional Commits`,
    description: `Assess index mechanics and commit hygiene.`,
    passingScore: 70,
    skills: [{"skillId": "git-workflow", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary benefit of making small, focused 'atomic' commits?",
        "options": [
            "It reduces repository disk space",
            "Each commit represents a single logical change, making code review, bisect debugging, and cherry-picking simple and risk-free",
            "It bypasses merge conflict checks",
            "It speeds up git clone"
        ],
        "explanation": "Atomic commits contain a single self-contained logical unit of work, allowing easy rollbacks, clean bisects, and clear changelogs.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const gitL2_Assessment = await ActivityModel.create({
    lessonId: gitL2._id,
    type: 'QUIZ',
    title: `Assessment: Staging & Conventional Commits`,
    order: 4,
    assessmentRef: gitL2_Quiz._id,
  });
  gitL2_Quiz.activityId = gitL2_Assessment._id;
  await gitL2_Quiz.save();

  gitL2.activities = [
    gitL2_Video._id,
    gitL2_Notes._id,
    gitL2_Practice._id,
    gitL2_Assessment._id,
  ] as any;
  await gitL2.save();

  gitMod1.lessons = [gitL1._id, gitL2._id] as any;
  await gitMod1.save();

  const gitMod2 = await ModuleModel.create({
    courseId: gitCourse._id,
    title: `Module 2: Branching Strategies & Merge Conflicts`,
    description: `Master branch pointer references, Fast-Forward vs 3-way merges, and resolving complex merge conflicts.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Branch Pointers, Fast-Forward & 3-Way Merge Commits ---
  const gitL3 = await LessonModel.create({
    moduleId: gitMod2._id,
    courseId: gitCourse._id,
    title: `Branch Pointers, Fast-Forward & 3-Way Merge Commits`,
    description: `Understand refs/heads, HEAD detached states, Fast-Forward pointer moves, and merge commit DAG topology.`,
    order: 1,
    activities: [],
  });

  const gitL3_Video = await ActivityModel.create({
    lessonId: gitL3._id,
    type: 'VIDEO',
    title: `Video: Git Branching and Merging Explained Visually`,
    order: 1,
    resourceRef: getRes('Git Branching and Merging Techniques in Tamil')?._id,
    content: `# Key Takeaways:
- Branches in Git are lightweight movable 41-byte pointer files containing a 40-hex SHA-1.
- Fast-forward merges simply advance the branch pointer when no divergent commits exist.
- 3-way merges combine two branch tips with their Common Ancestor commit.`,
  });

  const gitL3_Notes = await ActivityModel.create({
    lessonId: gitL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Branch Pointers, Fast-Forward & 3-Way Merge Commits`,
    order: 2,
    content: `# Branch Pointers, Fast-Forward & 3-Way Merge Commits

Understand refs/heads, HEAD detached states, Fast-Forward pointer moves, and merge commit DAG topology.

Branches in Git are merely lightweight pointer references stored in \`.git/refs/heads/\`.

---

### Fast-Forward Merge vs 3-Way Merge
1. **Fast-Forward Merge**: When target branch HEAD is a direct ancestor of feature branch. Git simply updates the pointer forward without creating a new commit.
2. **3-Way Merge (Merge Commit)**: When history has diverged. Git identifies the **Common Ancestor** (Base), compares changes from both branches, and creates a new merge commit with two parents.

\`\`\`bash
# Force a merge commit even on fast-forwardable branches
git merge feature-auth --no-ff -m "Merge branch 'feature-auth'"
\`\`\`

## Why Branch Pointers, Fast-Forward & 3-Way Merge Commits Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check if main_ancestors[-1] is in feature_ancestors

> ⚠️ **Common Mistake**: Branches in Git are just 41-byte files containing a commit SHA-1 pointer, making branch creation instantaneous and cost-free.

## Real-World Production Scenario

In production engineering, **Branch Pointers, Fast-Forward & 3-Way Merge Commits** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Branch Pointers, Fast-Forward & 3-Way Merge Commits. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Git-SCM: Pro Git Book')?._id,
  });

  const gitL3_Challenge = await ChallengeModel.create({
    title: `Detect Fast-Forward Eligibility`,
    description: `Write a Python function \`can_fast_forward(main_ancestors, feature_ancestors)\` where each is a list of commit SHAs from oldest to newest. Return True if the latest main commit exists anywhere inside \`feature_ancestors\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def can_fast_forward(main_ancestors, feature_ancestors):
    # Return boolean
    pass
`,
    solutionCode: `def can_fast_forward(main_ancestors, feature_ancestors):
    if not main_ancestors:
        return True
    return main_ancestors[-1] in feature_ancestors`,
    hints: ["Check if main_ancestors[-1] is in feature_ancestors"],
    skills: [{"skillId": "branching-strategies", "weight": 1.0}],
    testCases: [{"input": "can_fast_forward(['c1', 'c2'], ['c1', 'c2', 'c3'])", "expectedOutput": "True", "description": "Detects valid fast-forward lineage", "hidden": false}],
  });

  const gitL3_Practice = await ActivityModel.create({
    lessonId: gitL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Detect Fast-Forward Eligibility`,
    order: 3,
    challengeRef: gitL3_Challenge._id,
    content: `# Code Practice: Detect Fast-Forward Eligibility\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  gitL3_Challenge.activityId = gitL3_Practice._id;
  await gitL3_Challenge.save();

  const gitL3_Quiz = await AssessmentModel.create({
    title: `Assessment: Branch Pointers & Merges`,
    description: `Test branch reference topology and 3-way merge behavior.`,
    passingScore: 70,
    skills: [{"skillId": "branching-strategies", "weight": 1.0}],
    questions: [
    {
        "question": "What physically happens in the `.git` directory when you create a new branch using `git branch feature`?",
        "options": [
            "Git copies the entire codebase into a new folder",
            "Git writes a 41-byte text file in `.git/refs/heads/feature` containing the 40-character SHA-1 of the current commit",
            "Git compresses all repository commits into a tarball",
            "Git contacts the remote GitHub server"
        ],
        "explanation": "Branches in Git are just 41-byte files containing a commit SHA-1 pointer, making branch creation instantaneous and cost-free.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const gitL3_Assessment = await ActivityModel.create({
    lessonId: gitL3._id,
    type: 'QUIZ',
    title: `Assessment: Branch Pointers & Merges`,
    order: 4,
    assessmentRef: gitL3_Quiz._id,
  });
  gitL3_Quiz.activityId = gitL3_Assessment._id;
  await gitL3_Quiz.save();

  gitL3.activities = [
    gitL3_Video._id,
    gitL3_Notes._id,
    gitL3_Practice._id,
    gitL3_Assessment._id,
  ] as any;
  await gitL3.save();

  // --- Lesson 2: Resolving Merge Conflicts & Rebasing Mechanics ---
  const gitL4 = await LessonModel.create({
    moduleId: gitMod2._id,
    courseId: gitCourse._id,
    title: `Resolving Merge Conflicts & Rebasing Mechanics`,
    description: `Resolve conflict markers (\`<<<<<<<\`, \`=======\`, \`>>>>>>>\`), compare \`git merge\` vs \`git rebase\`, and avoid rebasing shared history.`,
    order: 2,
    activities: [],
  });

  const gitL4_Video = await ActivityModel.create({
    lessonId: gitL4._id,
    type: 'VIDEO',
    title: `Video: Git Rebase vs Merge (And Resolving Conflicts Like a Pro)`,
    order: 1,
    resourceRef: getRes('Git Branching and Merging Techniques in Tamil')?._id,
    content: `# Key Takeaways:
- Merge conflicts happen when both branches edit the same lines of a file differently.
- \`git rebase\` replays commits onto a new base tip, creating a clean linear history.
- Golden Rule of Rebasing: Never rebase commits that have been pushed to a public shared branch.`,
  });

  const gitL4_Notes = await ActivityModel.create({
    lessonId: gitL4._id,
    type: 'NOTES',
    title: `Codexa Notes: Resolving Merge Conflicts & Rebasing Mechanics`,
    order: 2,
    content: `# Resolving Merge Conflicts & Rebasing Mechanics

Resolve conflict markers (\`<<<<<<<\`, \`=======\`, \`>>>>>>>\`), compare \`git merge\` vs \`git rebase\`, and avoid rebasing shared history.

When Git encounters overlapping edits on the same file lines, it halts and injects conflict markers.

---

### Anatomy of Conflict Markers
\`\`\`text
<<<<<<< HEAD (Current branch e.g. main)
const API_URL = "https://api.codexa.dev/v2";
=======
const API_URL = "https://staging.codexa.dev/v2";
>>>>>>> feature/staging-endpoints (Incoming branch)
\`\`\`

### Git Rebase vs Git Merge
- **Merge**: Non-destructive, preserves exact historical commit timestamps and branch shapes, creates merge commits.
- **Rebase**: Rewrites commit SHAs by reapplying commits one by one on top of the target base, creating a linear history.

\`\`\`bash
# Rebase feature branch on top of latest main
git checkout feature-branch
git rebase main
# Fix conflicts, then:
git add resolved_file.ts
git rebase --continue
\`\`\`

## Why Resolving Merge Conflicts & Rebasing Mechanics Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use regex to replace conflict blocks with the incoming group

> ⚠️ **Common Mistake**: Rebasing generates new commit SHAs. Doing this on shared public branches forces collaborators to deal with broken upstream histories and divergent trees.

## Real-World Production Scenario

In production engineering, **Resolving Merge Conflicts & Rebasing Mechanics** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Resolving Merge Conflicts & Rebasing Mechanics. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Git-SCM: Pro Git Book')?._id,
  });

  const gitL4_Challenge = await ChallengeModel.create({
    title: `Strip Git Merge Conflict Markers`,
    description: `Write a Python function \`resolve_take_incoming(conflict_text)\` that parses conflict blocks and returns the file content keeping only the incoming branch content (between \`=======\` and \`>>>>>>>\`).`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `import re

def resolve_take_incoming(conflict_text):
    # Return resolved text string
    pass
`,
    solutionCode: `import re

def resolve_take_incoming(conflict_text):
    pattern = r'<{7}[^\\n]*\\n.*?={7}\\n(.*?)(>{7}[^\\n]*|$)'
    return re.sub(pattern, r'\\1', conflict_text, flags=re.DOTALL)`,
    hints: ["Use regex to replace conflict blocks with the incoming group"],
    skills: [{"skillId": "git-workflow", "weight": 1.0}],
    testCases: [{"input": "resolve_take_incoming('<<<<<<< HEAD\\nold\\n=======\\nnew\\n>>>>>>> feat')", "expectedOutput": "'new\\n'", "description": "Resolves conflict choosing incoming lines", "hidden": false}],
  });

  const gitL4_Practice = await ActivityModel.create({
    lessonId: gitL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Strip Git Merge Conflict Markers`,
    order: 3,
    challengeRef: gitL4_Challenge._id,
    content: `# Code Practice: Strip Git Merge Conflict Markers\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  gitL4_Challenge.activityId = gitL4_Practice._id;
  await gitL4_Challenge.save();

  const gitL4_Quiz = await AssessmentModel.create({
    title: `Assessment: Conflict Resolution & Rebase`,
    description: `Test conflict resolution steps and rebasing rules.`,
    passingScore: 70,
    skills: [{"skillId": "git-workflow", "weight": 1.0}],
    questions: [
    {
        "question": "What is the 'Golden Rule of Git Rebasing'?",
        "options": [
            "Always rebase before creating a pull request",
            "Never rebase commits that have already been pushed to a shared public branch used by other collaborators",
            "Never use merge commits",
            "Rebase only on weekends"
        ],
        "explanation": "Rebasing generates new commit SHAs. Doing this on shared public branches forces collaborators to deal with broken upstream histories and divergent trees.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const gitL4_Assessment = await ActivityModel.create({
    lessonId: gitL4._id,
    type: 'QUIZ',
    title: `Assessment: Conflict Resolution & Rebase`,
    order: 4,
    assessmentRef: gitL4_Quiz._id,
  });
  gitL4_Quiz.activityId = gitL4_Assessment._id;
  await gitL4_Quiz.save();

  gitL4.activities = [
    gitL4_Video._id,
    gitL4_Notes._id,
    gitL4_Practice._id,
    gitL4_Assessment._id,
  ] as any;
  await gitL4.save();

  gitMod2.lessons = [gitL3._id, gitL4._id] as any;
  await gitMod2.save();

  const gitMod3 = await ModuleModel.create({
    courseId: gitCourse._id,
    title: `Module 3: History Rewriting & Disaster Recovery`,
    description: `Master interactive rebasing (git rebase -i), squash, fixup, cherry-pick, and restoring lost commits via git reflog.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: Interactive Rebasing (Squash, Fixup, Reorder) & Cherry-Pick ---
  const gitL5 = await LessonModel.create({
    moduleId: gitMod3._id,
    courseId: gitCourse._id,
    title: `Interactive Rebasing (Squash, Fixup, Reorder) & Cherry-Pick`,
    description: `Clean up local messy commit histories before PR submission using \`git rebase -i\` and selectively pick commits with \`git cherry-pick\`.`,
    order: 1,
    activities: [],
  });

  const gitL5_Video = await ActivityModel.create({
    lessonId: gitL5._id,
    type: 'VIDEO',
    title: `Video: Git Interactive Rebase & Cherry Pick Tutorial`,
    order: 1,
    resourceRef: getRes('Essential Git Commands and Log in Tamil')?._id,
    content: `# Key Takeaways:
- \`git rebase -i HEAD~N\` opens an interactive todo list to squash, edit, reorder, or drop commits.
- \`squash\` merges a commit into the previous one; \`fixup\` discards the commit message.
- \`git cherry-pick <SHA>\` ports a specific single commit to the current branch.`,
  });

  const gitL5_Notes = await ActivityModel.create({
    lessonId: gitL5._id,
    type: 'NOTES',
    title: `Codexa Notes: Interactive Rebasing (Squash, Fixup, Reorder) & Cherry-Pick`,
    order: 2,
    content: `# Interactive Rebasing (Squash, Fixup, Reorder) & Cherry-Pick

Clean up local messy commit histories before PR submission using \`git rebase -i\` and selectively pick commits with \`git cherry-pick\`.

Interactive rebasing turns messy work-in-progress histories into pristine production-ready pull requests.

---

### Interactive Rebase Commands
\`\`\`text
pick e4a1b2 feat: initial user schema
squash 7c8d9e fix: fix typo in schema validation
fixup 1a2b3c wip: remove console logs
reword 3d4e5f feat: add password hashing
\`\`\`

### Cherry-Picking
Port a hotfix from \`main\` directly into a release branch:
\`\`\`bash
git checkout release-v1.2
git cherry-pick 9f8e7d6
\`\`\`

## Why Interactive Rebasing (Squash, Fixup, Reorder) & Cherry-Pick Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Split non-comment lines by whitespace to get action

> ⚠️ **Common Mistake**: \`fixup\` combines changes into the previous commit while automatically discarding its log message, keeping history clean without manual text editing.

## Real-World Production Scenario

In production engineering, **Interactive Rebasing (Squash, Fixup, Reorder) & Cherry-Pick** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Interactive Rebasing (Squash, Fixup, Reorder) & Cherry-Pick. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Git-SCM: Pro Git Book')?._id,
  });

  const gitL5_Challenge = await ChallengeModel.create({
    title: `Parse Interactive Rebase Commands`,
    description: `Write a Python function \`parse_rebase_todos(todo_lines)\` that takes a list of strings like \`['pick e4a1b2 message', 'squash 7c8d9e typo']\` and returns a dictionary counting occurrences of each action \`{'pick': 1, 'squash': 1}\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def parse_rebase_todos(todo_lines):
    # Return dict of action counts
    pass
`,
    solutionCode: `def parse_rebase_todos(todo_lines):
    counts = {}
    for line in todo_lines:
        if line and not line.startswith('#'):
            action = line.strip().split()[0]
            counts[action] = counts.get(action, 0) + 1
    return counts`,
    hints: ["Split non-comment lines by whitespace to get action"],
    skills: [{"skillId": "git-workflow", "weight": 1.0}],
    testCases: [{"input": "parse_rebase_todos(['pick a1b2c3 msg1', 'squash d4e5f6 msg2'])", "expectedOutput": "{'pick': 1, 'squash': 1}", "description": "Counts interactive rebase actions", "hidden": false}],
  });

  const gitL5_Practice = await ActivityModel.create({
    lessonId: gitL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Parse Interactive Rebase Commands`,
    order: 3,
    challengeRef: gitL5_Challenge._id,
    content: `# Code Practice: Parse Interactive Rebase Commands\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  gitL5_Challenge.activityId = gitL5_Practice._id;
  await gitL5_Challenge.save();

  const gitL5_Quiz = await AssessmentModel.create({
    title: `Assessment: History Rewriting`,
    description: `Test interactive rebase actions and cherry-pick usage.`,
    passingScore: 70,
    skills: [{"skillId": "git-workflow", "weight": 1.0}],
    questions: [
    {
        "question": "What is the difference between the 'squash' and 'fixup' actions in an interactive rebase todo list?",
        "options": [
            "'squash' deletes the commit; 'fixup' keeps it",
            "Both combine the commit into the prior commit, but 'squash' keeps the commit message for editing, while 'fixup' discards the commit message",
            "'fixup' works only on merge commits",
            "They are completely identical aliases"
        ],
        "explanation": "`fixup` combines changes into the previous commit while automatically discarding its log message, keeping history clean without manual text editing.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const gitL5_Assessment = await ActivityModel.create({
    lessonId: gitL5._id,
    type: 'QUIZ',
    title: `Assessment: History Rewriting`,
    order: 4,
    assessmentRef: gitL5_Quiz._id,
  });
  gitL5_Quiz.activityId = gitL5_Assessment._id;
  await gitL5_Quiz.save();

  gitL5.activities = [
    gitL5_Video._id,
    gitL5_Notes._id,
    gitL5_Practice._id,
    gitL5_Assessment._id,
  ] as any;
  await gitL5.save();

  // --- Lesson 2: Git Reflog, Head Recovery & Undoing Mistakes ---
  const gitL6 = await LessonModel.create({
    moduleId: gitMod3._id,
    courseId: gitCourse._id,
    title: `Git Reflog, Head Recovery & Undoing Mistakes`,
    description: `Recover deleted branches, undo accidental hard resets (\`git reset --hard\`), and restore lost commits using \`git reflog\`.`,
    order: 2,
    activities: [],
  });

  const gitL6_Video = await ActivityModel.create({
    lessonId: gitL6._id,
    type: 'VIDEO',
    title: `Video: Git Reflog: Recover Anything You Thought You Lost`,
    order: 1,
    resourceRef: getRes('Essential Git Commands and Log in Tamil')?._id,
    content: `# Key Takeaways:
- Git almost never deletes commit objects immediately; dangling commits stay in storage for 30+ days.
- \`git reflog\` logs every single time HEAD moved locally.
- Restore any state by resetting or branching from \`HEAD@{n}\`.`,
  });

  const gitL6_Notes = await ActivityModel.create({
    lessonId: gitL6._id,
    type: 'NOTES',
    title: `Codexa Notes: Git Reflog, Head Recovery & Undoing Mistakes`,
    order: 2,
    content: `# Git Reflog, Head Recovery & Undoing Mistakes

Recover deleted branches, undo accidental hard resets (\`git reset --hard\`), and restore lost commits using \`git reflog\`.

The Reference Log (Reflog) records every movement of \`HEAD\` on your local machine.

---

### How to Recover from an Accidental \`git reset --hard\`
1. Inspect the reflog:
\`\`\`bash
git reflog
# Output:
# 7c8d9e HEAD@{0}: reset: moving to HEAD~3
# e4a1b2 HEAD@{1}: commit: critical unpushed feature work
# 1a2b3c HEAD@{2}: checkout: moving from main to feature
\`\`\`
2. Restore the lost commit immediately into a safe branch:
\`\`\`bash
git checkout -b recovered-feature HEAD@{1}
\`\`\`

> [!NOTE]
> Dangling commit objects remain intact in \`.git/objects\` until Git's garbage collection (\`git gc\`) runs, typically 30 to 90 days.

## Why Git Reflog, Head Recovery & Undoing Mistakes Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Split by whitespace

> ⚠️ **Common Mistake**: Hard reset moves the HEAD pointer but does not purge unreferenced commit objects from the object database immediately. The reflog tracks pointer locations, allowing instant recovery.

## Real-World Production Scenario

In production engineering, **Git Reflog, Head Recovery & Undoing Mistakes** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Git Reflog, Head Recovery & Undoing Mistakes. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Git-SCM: Pro Git Book')?._id,
  });

  const gitL6_Challenge = await ChallengeModel.create({
    title: `Parse Latest Reflog Action`,
    description: `Write a Python function \`parse_latest_reflog_target(reflog_line)\` that extracts the SHA hash and \`HEAD@{n}\` selector from a line like \`'7c8d9e HEAD@{0}: reset: moving to HEAD~3'\` and returns a tuple \`('7c8d9e', 'HEAD@{0}')\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def parse_latest_reflog_target(reflog_line):
    # Return tuple (sha, selector)
    pass
`,
    solutionCode: `def parse_latest_reflog_target(reflog_line):
    parts = reflog_line.strip().split()
    sha = parts[0]
    selector = parts[1].rstrip(':')
    return (sha, selector)`,
    hints: ["Split by whitespace", "Strip trailing colon from HEAD@{n}"],
    skills: [{"skillId": "git-workflow", "weight": 1.0}],
    testCases: [{"input": "parse_latest_reflog_target('e4a1b2 HEAD@{1}: commit: feature work')", "expectedOutput": "('e4a1b2', 'HEAD@{1}')", "description": "Parses reflog target tuple", "hidden": false}],
  });

  const gitL6_Practice = await ActivityModel.create({
    lessonId: gitL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Parse Latest Reflog Action`,
    order: 3,
    challengeRef: gitL6_Challenge._id,
    content: `# Code Practice: Parse Latest Reflog Action\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  gitL6_Challenge.activityId = gitL6_Practice._id;
  await gitL6_Challenge.save();

  const gitL6_Quiz = await AssessmentModel.create({
    title: `Assessment: Git Reflog Recovery`,
    description: `Test disaster recovery strategies and reflog mechanics.`,
    passingScore: 70,
    skills: [{"skillId": "git-workflow", "weight": 1.0}],
    questions: [
    {
        "question": "Why can commits lost after an accidental `git reset --hard` be recovered using `git reflog`?",
        "options": [
            "GitHub stores backups automatically in the cloud",
            "Git does not delete the commit objects from disk immediately; it only moves the branch pointer, leaving the commit objects reachable via the local reflog history",
            "Reset creates a hidden zip file",
            "Git re-downloads commits from NPM"
        ],
        "explanation": "Hard reset moves the HEAD pointer but does not purge unreferenced commit objects from the object database immediately. The reflog tracks pointer locations, allowing instant recovery.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const gitL6_Assessment = await ActivityModel.create({
    lessonId: gitL6._id,
    type: 'QUIZ',
    title: `Assessment: Git Reflog Recovery`,
    order: 4,
    assessmentRef: gitL6_Quiz._id,
  });
  gitL6_Quiz.activityId = gitL6_Assessment._id;
  await gitL6_Quiz.save();

  gitL6.activities = [
    gitL6_Video._id,
    gitL6_Notes._id,
    gitL6_Practice._id,
    gitL6_Assessment._id,
  ] as any;
  await gitL6.save();

  gitMod3.lessons = [gitL5._id, gitL6._id] as any;
  await gitMod3.save();

  const gitMod4 = await ModuleModel.create({
    courseId: gitCourse._id,
    title: `Module 4: GitHub Workflows, PRs & CI Automation`,
    description: `Master Pull Request reviews, branch protection rules, semantic version tagging, and GitHub Actions CI pipelines.`,
    order: 4,
    lessons: [],
  });

  // --- Lesson 1: Pull Requests, Code Reviews & Branch Protection Rules ---
  const gitL7 = await LessonModel.create({
    moduleId: gitMod4._id,
    courseId: gitCourse._id,
    title: `Pull Requests, Code Reviews & Branch Protection Rules`,
    description: `Structure collaborative PRs, configure required status checks, enforce CODEOWNERS, and squash-and-merge policies.`,
    order: 1,
    activities: [],
  });

  const gitL7_Video = await ActivityModel.create({
    lessonId: gitL7._id,
    type: 'VIDEO',
    title: `Video: GitHub Professional Workflows: PRs, Reviews & Branch Rules`,
    order: 1,
    resourceRef: getRes('Practical Git & GitHub Hands-On Guide in Tamil')?._id,
    content: `# Key Takeaways:
- Branch protection rules prevent direct pushes to main and require passing CI tests.
- CODEOWNERS files automatically request reviews from designated team members.
- Squash and merge creates a single clean commit on main from a multi-commit PR.`,
  });

  const gitL7_Notes = await ActivityModel.create({
    lessonId: gitL7._id,
    type: 'NOTES',
    title: `Codexa Notes: Pull Requests, Code Reviews & Branch Protection Rules`,
    order: 2,
    content: `# Pull Requests, Code Reviews & Branch Protection Rules

Structure collaborative PRs, configure required status checks, enforce CODEOWNERS, and squash-and-merge policies.

Collaborative software engineering relies on automated gates and peer reviews before code enters production.

---

### Branch Protection Best Practices
1. **Require pull request before merging** with $\\ge 1$ approved review.
2. **Dismiss stale pull request approvals** when new commits are pushed.
3. **Require status checks to pass** (Linting, Unit Tests, Security Scans).
4. **Require linear history** (Prevent messy merge bubbles on \`main\`).

### CODEOWNERS Syntax (\`.github/CODEOWNERS\`)
\`\`\`text
# Global default owners
* @core-team

# Backend services
/apps/api/ @backend-team @spix

# Security sensitive configurations
/.github/workflows/ @devops-team @security-lead
\`\`\`

## Why Pull Requests, Code Reviews & Branch Protection Rules Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check specific prefixes first

> ⚠️ **Common Mistake**: If new commits are added after approval, dismissing approvals forces re-review to ensure that newly introduced changes are scrutinized.

## Real-World Production Scenario

In production engineering, **Pull Requests, Code Reviews & Branch Protection Rules** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Pull Requests, Code Reviews & Branch Protection Rules. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Git-SCM: Pro Git Book')?._id,
  });

  const gitL7_Challenge = await ChallengeModel.create({
    title: `Match File to Code Owner`,
    description: `Write a Python function \`find_code_owner(file_path, rules)\` where \`rules\` is a list of tuples \`[('/apps/api/', '@backend-team'), ('*', '@core-team')]\`. Return the matching owner for the most specific path prefix, or fallback to \`'@core-team'\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def find_code_owner(file_path, rules):
    # Return owner string
    pass
`,
    solutionCode: `def find_code_owner(file_path, rules):
    for prefix, owner in rules:
        if prefix != '*' and file_path.startswith(prefix):
            return owner
    for prefix, owner in rules:
        if prefix == '*':
            return owner
    return '@core-team'`,
    hints: ["Check specific prefixes first", "Fallback to '*' rule"],
    skills: [{"skillId": "git-workflow", "weight": 1.0}],
    testCases: [{"input": "find_code_owner('/apps/api/server.ts', [('/apps/api/', '@backend-team'), ('*', '@core-team')])", "expectedOutput": "'@backend-team'", "description": "Matches specific code owner", "hidden": false}],
  });

  const gitL7_Practice = await ActivityModel.create({
    lessonId: gitL7._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Match File to Code Owner`,
    order: 3,
    challengeRef: gitL7_Challenge._id,
    content: `# Code Practice: Match File to Code Owner\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  gitL7_Challenge.activityId = gitL7_Practice._id;
  await gitL7_Challenge.save();

  const gitL7_Quiz = await AssessmentModel.create({
    title: `Assessment: PR Reviews & Protection`,
    description: `Test GitHub review workflows and branch rules.`,
    passingScore: 70,
    skills: [{"skillId": "git-workflow", "weight": 1.0}],
    questions: [
    {
        "question": "Why is 'Dismiss stale pull request approvals when new commits are pushed' a critical branch protection setting?",
        "options": [
            "It forces developers to delete their branches",
            "It prevents an attacker or developer from having malicious or broken code merged after securing an approval on a previously benign commit",
            "It speeds up CI builds",
            "It automatically publishes releases to NPM"
        ],
        "explanation": "If new commits are added after approval, dismissing approvals forces re-review to ensure that newly introduced changes are scrutinized.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const gitL7_Assessment = await ActivityModel.create({
    lessonId: gitL7._id,
    type: 'QUIZ',
    title: `Assessment: PR Reviews & Protection`,
    order: 4,
    assessmentRef: gitL7_Quiz._id,
  });
  gitL7_Quiz.activityId = gitL7_Assessment._id;
  await gitL7_Quiz.save();

  gitL7.activities = [
    gitL7_Video._id,
    gitL7_Notes._id,
    gitL7_Practice._id,
    gitL7_Assessment._id,
  ] as any;
  await gitL7.save();

  // --- Lesson 2: GitHub Actions CI/CD Pipeline Foundations ---
  const gitL8 = await LessonModel.create({
    moduleId: gitMod4._id,
    courseId: gitCourse._id,
    title: `GitHub Actions CI/CD Pipeline Foundations`,
    description: `Author YAML workflow files, triggers (push, pull_request), runner matrices, caching, and secret management.`,
    order: 2,
    activities: [],
  });

  const gitL8_Video = await ActivityModel.create({
    lessonId: gitL8._id,
    type: 'VIDEO',
    title: `Video: GitHub Actions CI/CD Tutorial for Beginners`,
    order: 1,
    resourceRef: getRes('GitHub Basics and Remote Repositories in Tamil')?._id,
    content: `# Key Takeaways:
- GitHub Actions workflows are defined in \`.github/workflows/*.yml\`.
- Workflows contain Jobs made of sequential Steps running on cloud runners.
- Cache dependencies (\`actions/cache\`) to cut CI build times from minutes to seconds.`,
  });

  const gitL8_Notes = await ActivityModel.create({
    lessonId: gitL8._id,
    type: 'NOTES',
    title: `Codexa Notes: GitHub Actions CI/CD Pipeline Foundations`,
    order: 2,
    content: `# GitHub Actions CI/CD Pipeline Foundations

Author YAML workflow files, triggers (push, pull_request), runner matrices, caching, and secret management.

GitHub Actions executes automated testing, building, and deployment pipelines directly within GitHub repositories.

---

### CI Workflow Example (\`.github/workflows/ci.yml\`)
\`\`\`yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Linter & Tests
        run: |
          npm run lint
          npm test
\`\`\`

## Why GitHub Actions CI/CD Pipeline Foundations Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check 'name', 'on', 'jobs' keys in dict

> ⚠️ **Common Mistake**: \`npm ci\` provides deterministic, clean installs directly matching \`package-lock.json\`, preventing subtle dependency drift in automated test runners.

## Real-World Production Scenario

In production engineering, **GitHub Actions CI/CD Pipeline Foundations** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of GitHub Actions CI/CD Pipeline Foundations. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Git-SCM: Pro Git Book')?._id,
  });

  const gitL8_Challenge = await ChallengeModel.create({
    title: `Validate GitHub Actions YAML Structure`,
    description: `Write a Python function \`validate_gh_workflow_dict(workflow)\` that returns True if the dictionary has \`'name'\`, \`'on'\`, and \`'jobs'\` keys.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def validate_gh_workflow_dict(workflow):
    # Return boolean
    pass
`,
    solutionCode: `def validate_gh_workflow_dict(workflow):
    return 'name' in workflow and 'on' in workflow and 'jobs' in workflow`,
    hints: ["Check 'name', 'on', 'jobs' keys in dict"],
    skills: [{"skillId": "github-actions", "weight": 1.0}],
    testCases: [{"input": "validate_gh_workflow_dict({'name': 'CI', 'on': 'push', 'jobs': {}})", "expectedOutput": "True", "description": "Validates workflow top keys", "hidden": false}],
  });

  const gitL8_Practice = await ActivityModel.create({
    lessonId: gitL8._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Validate GitHub Actions YAML Structure`,
    order: 3,
    challengeRef: gitL8_Challenge._id,
    content: `# Code Practice: Validate GitHub Actions YAML Structure\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  gitL8_Challenge.activityId = gitL8_Practice._id;
  await gitL8_Challenge.save();

  const gitL8_Quiz = await AssessmentModel.create({
    title: `Assessment: GitHub Actions CI`,
    description: `Test GitHub Actions syntax and execution triggers.`,
    passingScore: 70,
    skills: [{"skillId": "github-actions", "weight": 1.0}],
    questions: [
    {
        "question": "Why is `npm ci` preferred over `npm install` inside automated CI/CD pipelines?",
        "options": [
            "npm ci is written in C++",
            "npm ci strictly adheres to package-lock.json, deletes existing node_modules, and throws an error if lockfile is out of sync, guaranteeing reproducible builds",
            "npm ci does not require internet access",
            "npm ci skips test dependencies"
        ],
        "explanation": "`npm ci` provides deterministic, clean installs directly matching `package-lock.json`, preventing subtle dependency drift in automated test runners.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const gitL8_Assessment = await ActivityModel.create({
    lessonId: gitL8._id,
    type: 'QUIZ',
    title: `Assessment: GitHub Actions CI`,
    order: 4,
    assessmentRef: gitL8_Quiz._id,
  });
  gitL8_Quiz.activityId = gitL8_Assessment._id;
  await gitL8_Quiz.save();

  gitL8.activities = [
    gitL8_Video._id,
    gitL8_Notes._id,
    gitL8_Practice._id,
    gitL8_Assessment._id,
  ] as any;
  await gitL8.save();

  gitMod4.lessons = [gitL7._id, gitL8._id] as any;
  await gitMod4.save();

  gitCourse.modules = [gitMod1._id, gitMod2._id, gitMod3._id, gitMod4._id] as any;
  await gitCourse.save();

  // =========================================================================
  // 3. DOCKER & CONTAINER ENGINEERING (4 MODULES, 8 LESSONS)
  // =========================================================================
  const dockerCourse = await CourseModel.create({
    slug: 'docker-containers',
    title: 'Docker & Container Systems Engineering',
    description: 'Master Linux containerization internals (namespaces, cgroups), Dockerfile optimization, multi-stage builds, container networking, persistent storage, and multi-container Docker Compose.',
    domain: 'DevOps / Cloud / Systems',
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    estimatedHours: 35,
    skillsCovered: ['docker-containers', 'container-security', 'docker-compose', 'devops-automation'],
    prerequisites: ['Linux fundamentals', 'Command line familiarity'],
    modules: [],
  });

  const dockMod1 = await ModuleModel.create({
    courseId: dockerCourse._id,
    title: `Module 1: Container Foundations & Linux Namespaces`,
    description: `Containers vs Virtual Machines, Linux Namespaces (PID, NET, MNT), Control Groups (cgroups), and Docker daemon architecture.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: Containers vs VMs & Linux Namespaces Mechanics ---
  const dockL1 = await LessonModel.create({
    moduleId: dockMod1._id,
    courseId: dockerCourse._id,
    title: `Containers vs VMs & Linux Namespaces Mechanics`,
    description: `Explore process isolation, shared kernel architecture, cgroups resource limits, and chroot/pivot_root.`,
    order: 1,
    activities: [],
  });

  const dockL1_Video = await ActivityModel.create({
    lessonId: dockL1._id,
    type: 'VIDEO',
    title: `Video: How Docker Works Under the Hood (Namespaces & cgroups)`,
    order: 1,
    resourceRef: getRes('What is a Docker Container vs Virtual Machine in Tamil')?._id,
    content: `# Key Takeaways:
- Containers are isolated Linux processes sharing the host OS kernel.
- Namespaces isolate what a process can SEE (PIDs, Network interfaces, Mount points).
- Cgroups limit how much resources a process can USE (CPU, RAM, Disk I/O).`,
  });

  const dockL1_Notes = await ActivityModel.create({
    lessonId: dockL1._id,
    type: 'NOTES',
    title: `Codexa Notes: Containers vs VMs & Linux Namespaces Mechanics`,
    order: 2,
    content: `# Containers vs VMs & Linux Namespaces Mechanics

Explore process isolation, shared kernel architecture, cgroups resource limits, and chroot/pivot_root.

Containers provide lightweight, portable OS-level virtualization without the hypervisor overhead of Virtual Machines.

---

### Containers vs Virtual Machines
- **Virtual Machines**: Emulate physical hardware; each VM runs a full guest OS kernel on a hypervisor (heavy, GBs in size, minutes to boot).
- **Containers**: Isolated user-space processes running directly on the host Linux kernel (lightweight, MBs in size, milliseconds to boot).

### The Linux Kernel Primitives
1. **Namespaces (Isolation)**:
   - \`pid\`: Isolates process IDs (Container PID 1 maps to a host PID).
   - \`net\`: Virtual network devices, IP routes, port spaces.
   - \`mnt\`: Independent filesystem mount points.
   - \`ipc\`: Inter-process communication channels.
   - \`uts\`: Hostname and domain name isolation.
2. **Control Groups / cgroups (Resource Constraints)**:
   - Enforce hard limits on RAM (e.g. \`memory.max = 512M\`), CPU shares, and block I/O bandwidth.

## Why Containers vs VMs & Linux Namespaces Mechanics Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
def parse_docker_memory(mem_str):
    unit = mem_str[-1].lower()
    val = int(mem_str[:-1])
    if unit == 'k': return val * 1024
    if unit == 'm': return val * 1024 * 1024
    if unit == 'g': return val * 1024 * 1024 * 1024
    return int(mem_str)
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Check last character 'k', 'm', 'g'

> ⚠️ **Common Mistake**: cgroups allocate and constrain hardware resources (CPU cores, RAM limits, I/O rates) preventing a single container from starving the host OS.

## Real-World Production Scenario

In production engineering, **Containers vs VMs & Linux Namespaces Mechanics** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Containers vs VMs & Linux Namespaces Mechanics. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Docker Documentation: Container')?._id,
  });

  const dockL1_Challenge = await ChallengeModel.create({
    title: `Parse Docker Memory Limit String to Bytes`,
    description: `Write a Python function \`parse_docker_memory(mem_str)\` that converts strings like \`'512m'\`, \`'2g'\`, \`'1024k'\` into integer bytes.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def parse_docker_memory(mem_str):
    # Return integer bytes
    pass
`,
    solutionCode: `def parse_docker_memory(mem_str):
    unit = mem_str[-1].lower()
    val = int(mem_str[:-1])
    if unit == 'k': return val * 1024
    if unit == 'm': return val * 1024 * 1024
    if unit == 'g': return val * 1024 * 1024 * 1024
    return int(mem_str)`,
    hints: ["Check last character 'k', 'm', 'g'", "Multiply integer by appropriate factor"],
    skills: [{"skillId": "docker-containers", "weight": 1.0}],
    testCases: [{"input": "parse_docker_memory('512m')", "expectedOutput": "536870912", "description": "Converts 512m to bytes", "hidden": false}],
  });

  const dockL1_Practice = await ActivityModel.create({
    lessonId: dockL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Parse Docker Memory Limit String to Bytes`,
    order: 3,
    challengeRef: dockL1_Challenge._id,
    content: `# Code Practice: Parse Docker Memory Limit String to Bytes\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  dockL1_Challenge.activityId = dockL1_Practice._id;
  await dockL1_Challenge.save();

  const dockL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Container Isolation`,
    description: `Test knowledge of namespaces and cgroups.`,
    passingScore: 70,
    skills: [{"skillId": "docker-containers", "weight": 1.0}],
    questions: [
    {
        "question": "What is the specific role of Linux Control Groups (cgroups) in container runtimes like Docker?",
        "options": [
            "To isolate process IDs and network interfaces",
            "To meter and enforce hard resource limits on CPU, memory, and disk I/O consumption for a process group",
            "To manage SSL certificates",
            "To compile container binaries"
        ],
        "explanation": "cgroups allocate and constrain hardware resources (CPU cores, RAM limits, I/O rates) preventing a single container from starving the host OS.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const dockL1_Assessment = await ActivityModel.create({
    lessonId: dockL1._id,
    type: 'QUIZ',
    title: `Assessment: Container Isolation`,
    order: 4,
    assessmentRef: dockL1_Quiz._id,
  });
  dockL1_Quiz.activityId = dockL1_Assessment._id;
  await dockL1_Quiz.save();

  dockL1.activities = [
    dockL1_Video._id,
    dockL1_Notes._id,
    dockL1_Practice._id,
    dockL1_Assessment._id,
  ] as any;
  await dockL1.save();

  // --- Lesson 2: Docker CLI Essentials & Container Lifecycle ---
  const dockL2 = await LessonModel.create({
    moduleId: dockMod1._id,
    courseId: dockerCourse._id,
    title: `Docker CLI Essentials & Container Lifecycle`,
    description: `Master docker run, exec, logs, ps, stop, rm, image management, and port mapping.`,
    order: 2,
    activities: [],
  });

  const dockL2_Video = await ActivityModel.create({
    lessonId: dockL2._id,
    type: 'VIDEO',
    title: `Video: Docker CLI Fundamentals & Container Lifecycle`,
    order: 1,
    resourceRef: getRes('Docker Basic Commands and Lifecycle in Tamil')?._id,
    content: `# Key Takeaways:
- \`docker run -d -p 8080:80 --name web nginx\` launches a detached background container.
- \`docker exec -it <container> sh\` opens an interactive shell inside a running container.
- Ephemeral containers destroy un-mounted data when deleted via \`docker rm\`.`,
  });

  const dockL2_Notes = await ActivityModel.create({
    lessonId: dockL2._id,
    type: 'NOTES',
    title: `Codexa Notes: Docker CLI Essentials & Container Lifecycle`,
    order: 2,
    content: `# Docker CLI Essentials & Container Lifecycle

Master docker run, exec, logs, ps, stop, rm, image management, and port mapping.

Mastering command-line operations enables rapid debugging and local deployment.

---

### Essential Container Commands
\`\`\`bash
# Run container in background with port forwarding and environment variables
docker run -d \\
  --name codexa-redis \\
  -p 6379:6379 \\
  -v redis-data:/data \\
  --restart unless-stopped \\
  redis:7-alpine

# View logs with live stream
docker logs -f --tail 100 codexa-redis

# Execute interactive bash shell inside container
docker exec -it codexa-redis redis-cli ping

# Inspect detailed container JSON configuration
docker inspect codexa-redis
\`\`\`

## Why Docker CLI Essentials & Container Lifecycle Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Format string with -d, --name, and -p flags

> ⚠️ **Common Mistake**: The \`-p <host_port>:<container_port>\` syntax maps host port 8080 to internal container port 3000.

## Real-World Production Scenario

In production engineering, **Docker CLI Essentials & Container Lifecycle** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Docker CLI Essentials & Container Lifecycle. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Docker Documentation: Container')?._id,
  });

  const dockL2_Challenge = await ChallengeModel.create({
    title: `Format Docker Run Command`,
    description: `Write a Python function \`format_docker_run(image, name, port_host, port_container)\` that returns \`f'docker run -d --name {name} -p {port_host}:{port_container} {image}'\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def format_docker_run(image, name, port_host, port_container):
    # Return string command
    pass
`,
    solutionCode: `def format_docker_run(image, name, port_host, port_container):
    return f'docker run -d --name {name} -p {port_host}:{port_container} {image}'`,
    hints: ["Format string with -d, --name, and -p flags"],
    skills: [{"skillId": "docker-containers", "weight": 1.0}],
    testCases: [{"input": "format_docker_run('nginx:alpine', 'my-web', 8080, 80)", "expectedOutput": "'docker run -d --name my-web -p 8080:80 nginx:alpine'", "description": "Formats docker run invocation", "hidden": false}],
  });

  const dockL2_Practice = await ActivityModel.create({
    lessonId: dockL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Format Docker Run Command`,
    order: 3,
    challengeRef: dockL2_Challenge._id,
    content: `# Code Practice: Format Docker Run Command\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  dockL2_Challenge.activityId = dockL2_Practice._id;
  await dockL2_Challenge.save();

  const dockL2_Quiz = await AssessmentModel.create({
    title: `Assessment: Docker CLI & Flags`,
    description: `Test port mappings and execution flags.`,
    passingScore: 70,
    skills: [{"skillId": "docker-containers", "weight": 1.0}],
    questions: [
    {
        "question": "In the command `docker run -p 8080:3000 my-app`, which port is exposed on the host machine?",
        "options": [
            "Port 3000",
            "Port 8080",
            "Both ports simultaneously",
            "Port 80"
        ],
        "explanation": "The `-p <host_port>:<container_port>` syntax maps host port 8080 to internal container port 3000.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const dockL2_Assessment = await ActivityModel.create({
    lessonId: dockL2._id,
    type: 'QUIZ',
    title: `Assessment: Docker CLI & Flags`,
    order: 4,
    assessmentRef: dockL2_Quiz._id,
  });
  dockL2_Quiz.activityId = dockL2_Assessment._id;
  await dockL2_Quiz.save();

  dockL2.activities = [
    dockL2_Video._id,
    dockL2_Notes._id,
    dockL2_Practice._id,
    dockL2_Assessment._id,
  ] as any;
  await dockL2.save();

  dockMod1.lessons = [dockL1._id, dockL2._id] as any;
  await dockMod1.save();

  const dockMod2 = await ModuleModel.create({
    courseId: dockerCourse._id,
    title: `Module 2: Dockerfile Crafting & Multi-Stage Builds`,
    description: `Master layer caching, .dockerignore, minimal base images (Alpine/Distroless), and Multi-Stage production builds.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Dockerfile Instructions, Layer Caching & .dockerignore ---
  const dockL3 = await LessonModel.create({
    moduleId: dockMod2._id,
    courseId: dockerCourse._id,
    title: `Dockerfile Instructions, Layer Caching & .dockerignore`,
    description: `Explore FROM, RUN, COPY, WORKDIR, CMD vs ENTRYPOINT, and optimizing build cache invalidation.`,
    order: 1,
    activities: [],
  });

  const dockL3_Video = await ActivityModel.create({
    lessonId: dockL3._id,
    type: 'VIDEO',
    title: `Video: How to Write Dockerfiles Like a Pro (Layer Caching & Best Practices)`,
    order: 1,
    resourceRef: getRes('Dockerfile Creation and Best Practices in Tamil')?._id,
    content: `# Key Takeaways:
- Each Dockerfile instruction (RUN, COPY, ADD) creates an immutable filesystem layer.
- Order instructions from least frequently changed to most frequently changed to maximize cache hits.
- Copy package.json and install dependencies before copying application source code.`,
  });

  const dockL3_Notes = await ActivityModel.create({
    lessonId: dockL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Dockerfile Instructions, Layer Caching & .dockerignore`,
    order: 2,
    content: `# Dockerfile Instructions, Layer Caching & .dockerignore

Explore FROM, RUN, COPY, WORKDIR, CMD vs ENTRYPOINT, and optimizing build cache invalidation.

Docker images are composed of stacked read-only layers. Efficient caching speeds up CI builds dramatically.

---

### Layer Caching Optimization Pattern
\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app

# 1. Copy package files first to leverage cached node_modules layer
COPY package*.json ./
RUN npm ci --only=production

# 2. Copy source code last (changes frequently)
COPY src/ ./src/

EXPOSE 3000
CMD ["node", "src/server.js"]
\`\`\`

### The \`.dockerignore\` File
Always exclude \`node_modules\`, \`.git\`, \`.env\`, and local build artifacts:
\`\`\`text
node_modules
.git
.env*
dist
npm-debug.log
\`\`\`

## Why Dockerfile Instructions, Layer Caching & .dockerignore Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Find index of package copy and source copy

> ⚠️ **Common Mistake**: Placing package installation before source code copying ensures Docker reuses the cached node_modules layer whenever only application code changes.

## Real-World Production Scenario

In production engineering, **Dockerfile Instructions, Layer Caching & .dockerignore** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Dockerfile Instructions, Layer Caching & .dockerignore. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Docker Documentation: Container')?._id,
  });

  const dockL3_Challenge = await ChallengeModel.create({
    title: `Check Dockerfile Layer Cache Order`,
    description: `Write a Python function \`is_cache_optimized(instructions)\` where \`instructions\` is a list of strings. Return True if the \`COPY package\` instruction appears BEFORE the \`COPY . .\` instruction in the list.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def is_cache_optimized(instructions):
    # Return boolean
    pass
`,
    solutionCode: `def is_cache_optimized(instructions):
    pkg_idx = -1
    src_idx = -1
    for idx, inst in enumerate(instructions):
        if 'COPY package' in inst: pkg_idx = idx
        if 'COPY . .' in inst or 'COPY src' in inst: src_idx = idx
    if pkg_idx != -1 and src_idx != -1:
        return pkg_idx < src_idx
    return False`,
    hints: ["Find index of package copy and source copy", "Return pkg_idx < src_idx"],
    skills: [{"skillId": "docker-containers", "weight": 1.0}],
    testCases: [{"input": "is_cache_optimized(['FROM node:20', 'COPY package.json .', 'RUN npm ci', 'COPY src .'])", "expectedOutput": "True", "description": "Verifies optimal cache ordering", "hidden": false}],
  });

  const dockL3_Practice = await ActivityModel.create({
    lessonId: dockL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Check Dockerfile Layer Cache Order`,
    order: 3,
    challengeRef: dockL3_Challenge._id,
    content: `# Code Practice: Check Dockerfile Layer Cache Order\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  dockL3_Challenge.activityId = dockL3_Practice._id;
  await dockL3_Challenge.save();

  const dockL3_Quiz = await AssessmentModel.create({
    title: `Assessment: Dockerfile Caching`,
    description: `Test cache invalidation rules and layer construction.`,
    passingScore: 70,
    skills: [{"skillId": "docker-containers", "weight": 1.0}],
    questions: [
    {
        "question": "Why should `COPY package.json .` and `npm install` be executed BEFORE copying the rest of application source files in a Dockerfile?",
        "options": [
            "To prevent npm from throwing permission errors",
            "Because if source code changes, Docker will reuse the cached dependency layer, avoiding slow redundant package downloads",
            "To reduce the final image size",
            "Because package.json must be in the root directory"
        ],
        "explanation": "Placing package installation before source code copying ensures Docker reuses the cached node_modules layer whenever only application code changes.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const dockL3_Assessment = await ActivityModel.create({
    lessonId: dockL3._id,
    type: 'QUIZ',
    title: `Assessment: Dockerfile Caching`,
    order: 4,
    assessmentRef: dockL3_Quiz._id,
  });
  dockL3_Quiz.activityId = dockL3_Assessment._id;
  await dockL3_Quiz.save();

  dockL3.activities = [
    dockL3_Video._id,
    dockL3_Notes._id,
    dockL3_Practice._id,
    dockL3_Assessment._id,
  ] as any;
  await dockL3.save();

  // --- Lesson 2: Multi-Stage Builds & Minimal Distroless Containers ---
  const dockL4 = await LessonModel.create({
    moduleId: dockMod2._id,
    courseId: dockerCourse._id,
    title: `Multi-Stage Builds & Minimal Distroless Containers`,
    description: `Separate build toolchains from runtime artifacts, shrink image size from 1.5GB to 50MB, and enhance container security.`,
    order: 2,
    activities: [],
  });

  const dockL4_Video = await ActivityModel.create({
    lessonId: dockL4._id,
    type: 'VIDEO',
    title: `Video: Docker Multi-Stage Builds & Production Security`,
    order: 1,
    resourceRef: getRes('Docker Hands-On Guide from Dockerfile to Hub in Tamil')?._id,
    content: `# Key Takeaways:
- Multi-stage builds use multiple \`FROM\` lines, copying only compiled binaries to the final stage.
- Strips build toolchains (compilers, npm devDependencies, git) from the production image.
- Distroless images contain only the application and runtime dependencies with zero shell binaries.`,
  });

  const dockL4_Notes = await ActivityModel.create({
    lessonId: dockL4._id,
    type: 'NOTES',
    title: `Codexa Notes: Multi-Stage Builds & Minimal Distroless Containers`,
    order: 2,
    content: `# Multi-Stage Builds & Minimal Distroless Containers

Separate build toolchains from runtime artifacts, shrink image size from 1.5GB to 50MB, and enhance container security.

Multi-stage builds produce ultra-lean, secure container images by discarding compilation SDKs.

---

### Production Multi-Stage TypeScript Dockerfile
\`\`\`dockerfile
# Stage 1: Build & Compile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src/ ./src/
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Run as non-root user for container security
USER node

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`

## Why Multi-Stage Builds & Minimal Distroless Containers Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Count lines starting with 'FROM ' case-insensitively

> ⚠️ **Common Mistake**: Multi-stage builds leave heavyweight build tools (compilers, git, dev packages) behind, creating tiny production images with a minimal attack surface.

## Real-World Production Scenario

In production engineering, **Multi-Stage Builds & Minimal Distroless Containers** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Multi-Stage Builds & Minimal Distroless Containers. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Docker Documentation: Container')?._id,
  });

  const dockL4_Challenge = await ChallengeModel.create({
    title: `Count Multi-Stage FROM Directives`,
    description: `Write a Python function \`count_build_stages(dockerfile_content)\` that counts how many \`FROM\` instructions appear in the Dockerfile string.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def count_build_stages(dockerfile_content):
    # Return integer count
    pass
`,
    solutionCode: `def count_build_stages(dockerfile_content):
    return sum(1 for line in dockerfile_content.split('\\n') if line.strip().upper().startswith('FROM '))`,
    hints: ["Count lines starting with 'FROM ' case-insensitively"],
    skills: [{"skillId": "docker-containers", "weight": 1.0}],
    testCases: [{"input": "count_build_stages('FROM node:20 AS build\\nRUN npm run build\\nFROM node:20-alpine\\nCOPY --from=build /app/dist ./dist')", "expectedOutput": "2", "description": "Counts 2 build stages", "hidden": false}],
  });

  const dockL4_Practice = await ActivityModel.create({
    lessonId: dockL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Count Multi-Stage FROM Directives`,
    order: 3,
    challengeRef: dockL4_Challenge._id,
    content: `# Code Practice: Count Multi-Stage FROM Directives\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  dockL4_Challenge.activityId = dockL4_Practice._id;
  await dockL4_Challenge.save();

  const dockL4_Quiz = await AssessmentModel.create({
    title: `Assessment: Multi-Stage Builds`,
    description: `Test multi-stage mechanics and security benefits.`,
    passingScore: 70,
    skills: [{"skillId": "docker-containers", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary security and performance benefit of using Multi-Stage Docker builds?",
        "options": [
            "It automatically encrypts container memory",
            "It isolates compilers and dev dependencies in early stages, resulting in dramatically smaller production images with significantly fewer CVE security vulnerabilities",
            "It removes the need for container networking",
            "It allows running Windows containers on Linux"
        ],
        "explanation": "Multi-stage builds leave heavyweight build tools (compilers, git, dev packages) behind, creating tiny production images with a minimal attack surface.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const dockL4_Assessment = await ActivityModel.create({
    lessonId: dockL4._id,
    type: 'QUIZ',
    title: `Assessment: Multi-Stage Builds`,
    order: 4,
    assessmentRef: dockL4_Quiz._id,
  });
  dockL4_Quiz.activityId = dockL4_Assessment._id;
  await dockL4_Quiz.save();

  dockL4.activities = [
    dockL4_Video._id,
    dockL4_Notes._id,
    dockL4_Practice._id,
    dockL4_Assessment._id,
  ] as any;
  await dockL4.save();

  dockMod2.lessons = [dockL3._id, dockL4._id] as any;
  await dockMod2.save();

  const dockMod3 = await ModuleModel.create({
    courseId: dockerCourse._id,
    title: `Module 3: Container Networking & Storage Persistence`,
    description: `Master user-defined Bridge networks, DNS resolution, Named Volumes, Bind Mounts, and permissions.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: Container Networking: Bridge, Host & Embedded DNS ---
  const dockL5 = await LessonModel.create({
    moduleId: dockMod3._id,
    courseId: dockerCourse._id,
    title: `Container Networking: Bridge, Host & Embedded DNS`,
    description: `Explore Docker bridge networks, container-to-container communication via service names, and network isolation.`,
    order: 1,
    activities: [],
  });

  const dockL5_Video = await ActivityModel.create({
    lessonId: dockL5._id,
    type: 'VIDEO',
    title: `Video: Docker Networking Explained (Bridge, Host, DNS)`,
    order: 1,
    resourceRef: getRes('Docker Port Mapping and Networking in Tamil')?._id,
    content: `# Key Takeaways:
- Custom user-defined bridge networks provide automatic internal DNS resolution by container name.
- Default bridge network does NOT support container name DNS.
- Isolate sensitive databases on backend internal networks.`,
  });

  const dockL5_Notes = await ActivityModel.create({
    lessonId: dockL5._id,
    type: 'NOTES',
    title: `Codexa Notes: Container Networking: Bridge, Host & Embedded DNS`,
    order: 2,
    content: `# Container Networking: Bridge, Host & Embedded DNS

Explore Docker bridge networks, container-to-container communication via service names, and network isolation.

Docker assigns isolated network namespaces to containers and connects them via virtual bridge switches.

---

### Network Drivers
- **bridge**: Default network driver (isolated software bridge on host).
- **host**: Removes network isolation, sharing the host's networking stack directly.
- **none**: Completely disables networking for isolated batch computation.

### User-Defined Bridge & Embedded DNS
\`\`\`bash
# Create custom bridge network
docker network create codexa-net

# Containers attached to 'codexa-net' communicate using container names as hostnames
docker run -d --name db --network codexa-net mongo:7
docker run -d --name api --network codexa-net -e MONGO_URI="mongodb://db:27017/app" my-api
\`\`\`

## Why Container Networking: Bridge, Host & Embedded DNS Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Format string with --driver and net_name

> ⚠️ **Common Mistake**: User-defined bridge networks provide automatic service discovery (DNS resolution by container name), which is disabled on the default bridge network.

## Real-World Production Scenario

In production engineering, **Container Networking: Bridge, Host & Embedded DNS** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Container Networking: Bridge, Host & Embedded DNS. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Docker Documentation: Container')?._id,
  });

  const dockL5_Challenge = await ChallengeModel.create({
    title: `Format Network Creation Command`,
    description: `Write a Python function \`format_network_create(net_name, driver='bridge')\` that returns \`f'docker network create --driver {driver} {net_name}'\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def format_network_create(net_name, driver='bridge'):
    # Return string command
    pass
`,
    solutionCode: `def format_network_create(net_name, driver='bridge'):
    return f'docker network create --driver {driver} {net_name}'`,
    hints: ["Format string with --driver and net_name"],
    skills: [{"skillId": "docker-containers", "weight": 1.0}],
    testCases: [{"input": "format_network_create('app-net')", "expectedOutput": "'docker network create --driver bridge app-net'", "description": "Formats network creation command", "hidden": false}],
  });

  const dockL5_Practice = await ActivityModel.create({
    lessonId: dockL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Format Network Creation Command`,
    order: 3,
    challengeRef: dockL5_Challenge._id,
    content: `# Code Practice: Format Network Creation Command\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  dockL5_Challenge.activityId = dockL5_Practice._id;
  await dockL5_Challenge.save();

  const dockL5_Quiz = await AssessmentModel.create({
    title: `Assessment: Docker Networking`,
    description: `Test bridge networking and internal DNS.`,
    passingScore: 70,
    skills: [{"skillId": "docker-containers", "weight": 1.0}],
    questions: [
    {
        "question": "Why should you use a user-defined bridge network instead of the default bridge network for multi-container applications?",
        "options": [
            "User-defined networks run at 10Gbps automatically",
            "User-defined bridge networks provide automatic internal DNS resolution by container name and superior network isolation",
            "Default bridge networks cannot connect to the internet",
            "Default bridge networks require Kubernetes"
        ],
        "explanation": "User-defined bridge networks provide automatic service discovery (DNS resolution by container name), which is disabled on the default bridge network.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const dockL5_Assessment = await ActivityModel.create({
    lessonId: dockL5._id,
    type: 'QUIZ',
    title: `Assessment: Docker Networking`,
    order: 4,
    assessmentRef: dockL5_Quiz._id,
  });
  dockL5_Quiz.activityId = dockL5_Assessment._id;
  await dockL5_Quiz.save();

  dockL5.activities = [
    dockL5_Video._id,
    dockL5_Notes._id,
    dockL5_Practice._id,
    dockL5_Assessment._id,
  ] as any;
  await dockL5.save();

  // --- Lesson 2: Storage Persistence: Named Volumes vs Bind Mounts ---
  const dockL6 = await LessonModel.create({
    moduleId: dockMod3._id,
    courseId: dockerCourse._id,
    title: `Storage Persistence: Named Volumes vs Bind Mounts`,
    description: `Master data persistence outside container lifecycles, database volume backups, and development bind mounts.`,
    order: 2,
    activities: [],
  });

  const dockL6_Video = await ActivityModel.create({
    lessonId: dockL6._id,
    type: 'VIDEO',
    title: `Video: Docker Volumes vs Bind Mounts Explained`,
    order: 1,
    resourceRef: getRes('Docker Volumes and Data Persistence in Tamil')?._id,
    content: `# Key Takeaways:
- Container writeable layers are ephemeral; destroying a container destroys its internal storage.
- Named Volumes are managed by Docker in \`/var/lib/docker/volumes\` (best for databases).
- Bind Mounts map a specific host directory into the container (best for local dev live-reload).`,
  });

  const dockL6_Notes = await ActivityModel.create({
    lessonId: dockL6._id,
    type: 'NOTES',
    title: `Codexa Notes: Storage Persistence: Named Volumes vs Bind Mounts`,
    order: 2,
    content: `# Storage Persistence: Named Volumes vs Bind Mounts

Master data persistence outside container lifecycles, database volume backups, and development bind mounts.

Persistent data must reside outside the ephemeral container writeable union filesystem.

---

### Storage Options Compared
1. **Named Volumes (\`-v volume_name:/path\`)**: Managed entirely by Docker daemon in host storage (\`/var/lib/docker/volumes\`). High performance, isolated from host OS modifications, easy to backup.
2. **Bind Mounts (\`-v /host/path:/container/path\`)**: Directly maps an arbitrary host directory into the container. Ideal for mapping local source code for live-reloading during development.
3. **tmpfs Mounts**: Stored in host RAM only, never written to disk (for sensitive keys/temp data).

\`\`\`bash
# Named volume for database persistence:
docker run -d --name pg-db -v pgdata:/var/lib/postgresql/data postgres:16
\`\`\`

## Why Storage Persistence: Named Volumes vs Bind Mounts Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check if host part starts with '/' or '.'

> ⚠️ **Common Mistake**: Named volumes decouple data from host filesystem path quirks and permission issues while providing optimal storage driver performance.

## Real-World Production Scenario

In production engineering, **Storage Persistence: Named Volumes vs Bind Mounts** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Storage Persistence: Named Volumes vs Bind Mounts. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Docker Documentation: Container')?._id,
  });

  const dockL6_Challenge = await ChallengeModel.create({
    title: `Differentiate Volume Type`,
    description: `Write a Python function \`detect_volume_type(mount_str)\` where \`mount_str\` is a mount definition like \`'my_vol:/data'\` or \`'/var/log:/app/log'\`. Return \`'bind'\` if host source starts with \`'/'\` or \`'.'\`; otherwise return \`'named'\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def detect_volume_type(mount_str):
    # Return 'bind' or 'named'
    pass
`,
    solutionCode: `def detect_volume_type(mount_str):
    host_part = mount_str.split(':')[0]
    if host_part.startswith('/') or host_part.startswith('.'):
        return 'bind'
    return 'named'`,
    hints: ["Check if host part starts with '/' or '.'"],
    skills: [{"skillId": "docker-containers", "weight": 1.0}],
    testCases: [{"input": "detect_volume_type('db_data:/var/lib/mysql')", "expectedOutput": "'named'", "description": "Identifies named volume", "hidden": false}],
  });

  const dockL6_Practice = await ActivityModel.create({
    lessonId: dockL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Differentiate Volume Type`,
    order: 3,
    challengeRef: dockL6_Challenge._id,
    content: `# Code Practice: Differentiate Volume Type\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  dockL6_Challenge.activityId = dockL6_Practice._id;
  await dockL6_Challenge.save();

  const dockL6_Quiz = await AssessmentModel.create({
    title: `Assessment: Volumes & Mounts`,
    description: `Test data persistence rules and volume lifecycle.`,
    passingScore: 70,
    skills: [{"skillId": "docker-containers", "weight": 1.0}],
    questions: [
    {
        "question": "Why are Named Volumes strongly recommended over Bind Mounts for production database containers?",
        "options": [
            "Named volumes encrypt data by default",
            "Named volumes are completely managed by Docker, avoid host permission conflicts, and offer consistent I/O performance across host platforms",
            "Named volumes do not consume disk space",
            "Bind mounts cannot store more than 1GB"
        ],
        "explanation": "Named volumes decouple data from host filesystem path quirks and permission issues while providing optimal storage driver performance.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const dockL6_Assessment = await ActivityModel.create({
    lessonId: dockL6._id,
    type: 'QUIZ',
    title: `Assessment: Volumes & Mounts`,
    order: 4,
    assessmentRef: dockL6_Quiz._id,
  });
  dockL6_Quiz.activityId = dockL6_Assessment._id;
  await dockL6_Quiz.save();

  dockL6.activities = [
    dockL6_Video._id,
    dockL6_Notes._id,
    dockL6_Practice._id,
    dockL6_Assessment._id,
  ] as any;
  await dockL6.save();

  dockMod3.lessons = [dockL5._id, dockL6._id] as any;
  await dockMod3.save();

  const dockMod4 = await ModuleModel.create({
    courseId: dockerCourse._id,
    title: `Module 4: Multi-Container Orchestration with Docker Compose`,
    description: `Master docker-compose.yml specifications, service dependencies (depends_on with healthchecks), environment files, and container hardening.`,
    order: 4,
    lessons: [],
  });

  // --- Lesson 1: Docker Compose Services, Networks & Healthchecks ---
  const dockL7 = await LessonModel.create({
    moduleId: dockMod4._id,
    courseId: dockerCourse._id,
    title: `Docker Compose Services, Networks & Healthchecks`,
    description: `Author declarative multi-service compose files connecting API, Database, Redis cache, and reverse proxies.`,
    order: 1,
    activities: [],
  });

  const dockL7_Video = await ActivityModel.create({
    lessonId: dockL7._id,
    type: 'VIDEO',
    title: `Video: Docker Compose Tutorial - Complete Multi-Container Guide`,
    order: 1,
    resourceRef: getRes('Docker Bind Mounts vs Named Volumes in Tamil')?._id,
    content: `# Key Takeaways:
- Docker Compose defines and runs multi-container applications from a single YAML file.
- Compose creates a shared user-defined network automatically.
- Use \`healthcheck\` and \`depends_on: condition: service_healthy\` to prevent race conditions.`,
  });

  const dockL7_Notes = await ActivityModel.create({
    lessonId: dockL7._id,
    type: 'NOTES',
    title: `Codexa Notes: Docker Compose Services, Networks & Healthchecks`,
    order: 2,
    content: `# Docker Compose Services, Networks & Healthchecks

Author declarative multi-service compose files connecting API, Database, Redis cache, and reverse proxies.

Docker Compose coordinates multi-container stacks with declarative configuration.

---

### Production \`docker-compose.yml\`
\`\`\`yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://db:27017/codexa
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app-tier

  db:
    image: mongo:7
    volumes:
      - mongo_data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-tier

volumes:
  mongo_data:

networks:
  app-tier:
\`\`\`

## Why Docker Compose Services, Networks & Healthchecks Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Extract keys from compose_dict['services']

> ⚠️ **Common Mistake**: Container startup != ready to serve traffic. \`depends_on\` with \`condition: service_healthy\` ensures the database passes its healthcheck before starting dependent services.

## Real-World Production Scenario

In production engineering, **Docker Compose Services, Networks & Healthchecks** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Docker Compose Services, Networks & Healthchecks. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Docker Documentation: Container')?._id,
  });

  const dockL7_Challenge = await ChallengeModel.create({
    title: `Validate Docker Compose Services`,
    description: `Write a Python function \`get_compose_service_names(compose_dict)\` that returns a sorted list of service names defined under the \`'services'\` key in a parsed Docker Compose dictionary.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def get_compose_service_names(compose_dict):
    # Return sorted list of service names
    pass
`,
    solutionCode: `def get_compose_service_names(compose_dict):
    services = compose_dict.get('services', {})
    return sorted(list(services.keys()))`,
    hints: ["Extract keys from compose_dict['services']", "Sort list"],
    skills: [{"skillId": "docker-compose", "weight": 1.0}],
    testCases: [{"input": "get_compose_service_names({'services': {'web': {}, 'db': {}}})", "expectedOutput": "['db', 'web']", "description": "Extracts sorted service names", "hidden": false}],
  });

  const dockL7_Practice = await ActivityModel.create({
    lessonId: dockL7._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Validate Docker Compose Services`,
    order: 3,
    challengeRef: dockL7_Challenge._id,
    content: `# Code Practice: Validate Docker Compose Services\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  dockL7_Challenge.activityId = dockL7_Practice._id;
  await dockL7_Challenge.save();

  const dockL7_Quiz = await AssessmentModel.create({
    title: `Assessment: Docker Compose`,
    description: `Test service dependencies and healthcheck syntax.`,
    passingScore: 70,
    skills: [{"skillId": "docker-compose", "weight": 1.0}],
    questions: [
    {
        "question": "Why is basic `depends_on: ['db']` alone often insufficient to ensure that a web API can connect to a database on startup?",
        "options": [
            "depends_on only works in Kubernetes",
            "depends_on only waits for the database container to start running, NOT for the database server software inside the container to complete initialization and accept socket connections",
            "depends_on deletes the database container on reboot",
            "It requires a paid Docker subscription"
        ],
        "explanation": "Container startup != ready to serve traffic. `depends_on` with `condition: service_healthy` ensures the database passes its healthcheck before starting dependent services.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const dockL7_Assessment = await ActivityModel.create({
    lessonId: dockL7._id,
    type: 'QUIZ',
    title: `Assessment: Docker Compose`,
    order: 4,
    assessmentRef: dockL7_Quiz._id,
  });
  dockL7_Quiz.activityId = dockL7_Assessment._id;
  await dockL7_Quiz.save();

  dockL7.activities = [
    dockL7_Video._id,
    dockL7_Notes._id,
    dockL7_Practice._id,
    dockL7_Assessment._id,
  ] as any;
  await dockL7.save();

  // --- Lesson 2: Container Security Hardening & Non-Root Execution ---
  const dockL8 = await LessonModel.create({
    moduleId: dockMod4._id,
    courseId: dockerCourse._id,
    title: `Container Security Hardening & Non-Root Execution`,
    description: `Eliminate root container privileges, drop Linux capabilities (\`cap-drop=ALL\`), make filesystems read-only, and scan vulnerabilities with Trivy.`,
    order: 2,
    activities: [],
  });

  const dockL8_Video = await ActivityModel.create({
    lessonId: dockL8._id,
    type: 'VIDEO',
    title: `Video: Container Security: Hardening Docker for Production`,
    order: 1,
    resourceRef: getRes('Docker Tutorial for Beginners in Tamil')?._id,
    content: `# Key Takeaways:
- Never run containers as root (UID 0); always declare a non-root \`USER\`.
- Drop unnecessary Linux capabilities (\`--cap-drop=ALL\`).
- Mount root filesystems as read-only (\`--read-only\`) to block runtime malware writes.`,
  });

  const dockL8_Notes = await ActivityModel.create({
    lessonId: dockL8._id,
    type: 'NOTES',
    title: `Codexa Notes: Container Security Hardening & Non-Root Execution`,
    order: 2,
    content: `# Container Security Hardening & Non-Root Execution

Eliminate root container privileges, drop Linux capabilities (\`cap-drop=ALL\`), make filesystems read-only, and scan vulnerabilities with Trivy.

Hardening containers minimizes privilege escalation risks in multi-tenant environments.

---

### Core Hardening Strategies
1. **Non-Root Execution**:
   \`\`\`dockerfile
   RUN addgroup -S appgroup && adduser -S appuser -G appgroup
   USER appuser
   \`\`\`
2. **Dropping Capabilities**:
   \`\`\`bash
   docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE my-app
   \`\`\`
3. **Read-Only Root Filesystem**:
   \`\`\`bash
   docker run --read-only --tmpfs /tmp my-app
   \`\`\`
4. **Vulnerability Scanning**:
   \`\`\`bash
   trivy image my-app:latest --severity HIGH,CRITICAL
   \`\`\`

## Why Container Security Hardening & Non-Root Execution Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check lines starting with 'USER '

> ⚠️ **Common Mistake**: Container root is the same UID 0 as host root. Any vulnerability allowing container escape grants full administrative control over the underlying host machine.

## Real-World Production Scenario

In production engineering, **Container Security Hardening & Non-Root Execution** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Container Security Hardening & Non-Root Execution. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Docker Documentation: Container')?._id,
  });

  const dockL8_Challenge = await ChallengeModel.create({
    title: `Verify Non-Root User Declaration in Dockerfile`,
    description: `Write a Python function \`has_non_root_user(dockerfile_lines)\` that returns True if any line contains \`USER \` followed by a non-root username (not \`root\` or \`0\`).`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def has_non_root_user(dockerfile_lines):
    # Return boolean
    pass
`,
    solutionCode: `def has_non_root_user(dockerfile_lines):
    for line in dockerfile_lines:
        trimmed = line.strip()
        if trimmed.startswith('USER '):
            user = trimmed.split()[1].lower()
            if user not in ['root', '0']:
                return True
    return False`,
    hints: ["Check lines starting with 'USER '", "Ensure user is not 'root' or '0'"],
    skills: [{"skillId": "container-security", "weight": 1.0}],
    testCases: [{"input": "has_non_root_user(['FROM node:20-alpine', 'USER node', 'CMD [\"node\"]'])", "expectedOutput": "True", "description": "Detects non-root USER directive", "hidden": false}],
  });

  const dockL8_Practice = await ActivityModel.create({
    lessonId: dockL8._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Verify Non-Root User Declaration in Dockerfile`,
    order: 3,
    challengeRef: dockL8_Challenge._id,
    content: `# Code Practice: Verify Non-Root User Declaration in Dockerfile\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  dockL8_Challenge.activityId = dockL8_Practice._id;
  await dockL8_Challenge.save();

  const dockL8_Quiz = await AssessmentModel.create({
    title: `Assessment: Container Security`,
    description: `Test security best practices and privilege minimization.`,
    passingScore: 70,
    skills: [{"skillId": "container-security", "weight": 1.0}],
    questions: [
    {
        "question": "Why is running container processes as the default 'root' user dangerous in production?",
        "options": [
            "Root processes consume twice as much RAM",
            "If an attacker breaches the application via a remote code execution exploit, they gain root privileges inside the container, increasing the risk of container escape to the host kernel",
            "Root containers cannot connect to databases",
            "Docker throws an error when deploying root containers"
        ],
        "explanation": "Container root is the same UID 0 as host root. Any vulnerability allowing container escape grants full administrative control over the underlying host machine.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const dockL8_Assessment = await ActivityModel.create({
    lessonId: dockL8._id,
    type: 'QUIZ',
    title: `Assessment: Container Security`,
    order: 4,
    assessmentRef: dockL8_Quiz._id,
  });
  dockL8_Quiz.activityId = dockL8_Assessment._id;
  await dockL8_Quiz.save();

  dockL8.activities = [
    dockL8_Video._id,
    dockL8_Notes._id,
    dockL8_Practice._id,
    dockL8_Assessment._id,
  ] as any;
  await dockL8.save();

  dockMod4.lessons = [dockL7._id, dockL8._id] as any;
  await dockMod4.save();

  dockerCourse.modules = [dockMod1._id, dockMod2._id, dockMod3._id, dockMod4._id] as any;
  await dockerCourse.save();

  // =========================================================================
  // 4. KUBERNETES PRODUCTION ORCHESTRATION (4 MODULES, 8 LESSONS)
  // =========================================================================
  const k8sCourse = await CourseModel.create({
    slug: 'kubernetes-orchestration',
    title: 'Kubernetes Production Cluster Orchestration',
    description: 'Master Kubernetes architecture (Control Plane, Worker nodes), Pod lifecycle, declarative Deployments, rolling updates, Services, Ingress controllers, and Helm chart package management.',
    domain: 'DevOps / Cloud / Systems',
    level: 'ADVANCED',
    status: 'PUBLISHED',
    estimatedHours: 40,
    skillsCovered: ['kubernetes', 'cloud-native', 'helm-charts', 'container-orchestration'],
    prerequisites: ['Docker & container engineering', 'Linux networking basics'],
    modules: [],
  });

  const k8sMod1 = await ModuleModel.create({
    courseId: k8sCourse._id,
    title: `Module 1: Cluster Architecture & Control Plane`,
    description: `Master API Server, etcd distributed consensus, kube-scheduler, kube-controller-manager, kubelet, and Pod anatomy.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: Kubernetes Control Plane & Worker Node Components ---
  const k8sL1 = await LessonModel.create({
    moduleId: k8sMod1._id,
    courseId: k8sCourse._id,
    title: `Kubernetes Control Plane & Worker Node Components`,
    description: `Explore kube-apiserver, etcd key-value store, kube-scheduler, kubelet agent, and kube-proxy.`,
    order: 1,
    activities: [],
  });

  const k8sL1_Video = await ActivityModel.create({
    lessonId: k8sL1._id,
    type: 'VIDEO',
    title: `Video: Kubernetes Architecture Explained Simply`,
    order: 1,
    resourceRef: getRes('Kubernetes Architecture and Control Plane in Tamil')?._id,
    content: `# Key Takeaways:
- Control Plane manages desired state; Worker Nodes execute container workloads.
- etcd stores the single source of truth cluster state via Raft consensus.
- Kubelet reports node health and instructs container runtimes (CRI) to spawn Pods.`,
  });

  const k8sL1_Notes = await ActivityModel.create({
    lessonId: k8sL1._id,
    type: 'NOTES',
    title: `Codexa Notes: Kubernetes Control Plane & Worker Node Components`,
    order: 2,
    content: `# Kubernetes Control Plane & Worker Node Components

Explore kube-apiserver, etcd key-value store, kube-scheduler, kubelet agent, and kube-proxy.

Kubernetes is a declarative container orchestration platform maintaining desired cluster state.

---

### Control Plane Components
1. **kube-apiserver**: Front door for all cluster REST operations (validates and configures API objects).
2. **etcd**: Consistent, highly-available key-value store holding complete cluster state.
3. **kube-scheduler**: Assigns unscheduled Pods to optimal worker nodes based on resource affinity.
4. **kube-controller-manager**: Runs reconciliation loops (NodeController, DeploymentController).

### Worker Node Components
1. **kubelet**: Agent running on each node, ensuring containers described in PodSpecs are running and healthy.
2. **kube-proxy**: Manages network routing rules (iptables/IPVS) on nodes for Service IPs.
3. **Container Runtime (CRI)**: Software executing containers (e.g. containerd, CRI-O).

## Why Kubernetes Control Plane & Worker Node Components Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
def get_k8s_component_plane(component_name):
    cp = ['kube-apiserver', 'etcd', 'kube-scheduler', 'kube-controller-manager']
    return 'control-plane' if component_name in cp else 'worker-node'
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Check if component_name is in control plane list

> ⚠️ **Common Mistake**: Only the \`kube-apiserver\` interfaces with \`etcd\`. All other components (scheduler, controllers, kubelet) query and mutate state strictly through the API server.

## Real-World Production Scenario

In production engineering, **Kubernetes Control Plane & Worker Node Components** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Kubernetes Control Plane & Worker Node Components. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Kubernetes Documentation: Pods')?._id,
  });

  const k8sL1_Challenge = await ChallengeModel.create({
    title: `Classify Kubernetes Component Plane`,
    description: `Write a Python function \`get_k8s_component_plane(component_name)\` that returns \`'control-plane'\` for \`'kube-apiserver'\`, \`'etcd'\`, \`'kube-scheduler'\`, \`'kube-controller-manager'\`; and \`'worker-node'\` for \`'kubelet'\`, \`'kube-proxy'\`, \`'containerd'\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def get_k8s_component_plane(component_name):
    # Return 'control-plane' or 'worker-node'
    pass
`,
    solutionCode: `def get_k8s_component_plane(component_name):
    cp = ['kube-apiserver', 'etcd', 'kube-scheduler', 'kube-controller-manager']
    return 'control-plane' if component_name in cp else 'worker-node'`,
    hints: ["Check if component_name is in control plane list"],
    skills: [{"skillId": "kubernetes", "weight": 1.0}],
    testCases: [{"input": "get_k8s_component_plane('kube-apiserver')", "expectedOutput": "'control-plane'", "description": "Identifies control plane component", "hidden": false}],
  });

  const k8sL1_Practice = await ActivityModel.create({
    lessonId: k8sL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Classify Kubernetes Component Plane`,
    order: 3,
    challengeRef: k8sL1_Challenge._id,
    content: `# Code Practice: Classify Kubernetes Component Plane\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  k8sL1_Challenge.activityId = k8sL1_Practice._id;
  await k8sL1_Challenge.save();

  const k8sL1_Quiz = await AssessmentModel.create({
    title: `Assessment: Kubernetes Architecture`,
    description: `Test knowledge of control plane components and etcd consensus.`,
    passingScore: 70,
    skills: [{"skillId": "kubernetes", "weight": 1.0}],
    questions: [
    {
        "question": "Which Kubernetes component is the ONLY component that communicates directly with the etcd storage database?",
        "options": [
            "kube-scheduler",
            "kube-apiserver",
            "kubelet",
            "kube-proxy"
        ],
        "explanation": "Only the `kube-apiserver` interfaces with `etcd`. All other components (scheduler, controllers, kubelet) query and mutate state strictly through the API server.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const k8sL1_Assessment = await ActivityModel.create({
    lessonId: k8sL1._id,
    type: 'QUIZ',
    title: `Assessment: Kubernetes Architecture`,
    order: 4,
    assessmentRef: k8sL1_Quiz._id,
  });
  k8sL1_Quiz.activityId = k8sL1_Assessment._id;
  await k8sL1_Quiz.save();

  k8sL1.activities = [
    k8sL1_Video._id,
    k8sL1_Notes._id,
    k8sL1_Practice._id,
    k8sL1_Assessment._id,
  ] as any;
  await k8sL1.save();

  // --- Lesson 2: Pod Anatomy, Multi-Container Patterns & Lifecycle ---
  const k8sL2 = await LessonModel.create({
    moduleId: k8sMod1._id,
    courseId: k8sCourse._id,
    title: `Pod Anatomy, Multi-Container Patterns & Lifecycle`,
    description: `Explore Pod manifests, Sidecar/Init container patterns, shared loopback/volumes, and liveness/readiness probes.`,
    order: 2,
    activities: [],
  });

  const k8sL2_Video = await ActivityModel.create({
    lessonId: k8sL2._id,
    type: 'VIDEO',
    title: `Video: Kubernetes Pods Explained (Multi-Container Patterns & Probes)`,
    order: 1,
    resourceRef: getRes('Kubernetes Pods and Containers Explained in Tamil')?._id,
    content: `# Key Takeaways:
- A Pod is the smallest deployable atomic compute unit in Kubernetes.
- Containers in the same Pod share the same Network namespace (localhost) and storage volumes.
- Liveness probes restart unhealthy containers; Readiness probes control traffic routing.`,
  });

  const k8sL2_Notes = await ActivityModel.create({
    lessonId: k8sL2._id,
    type: 'NOTES',
    title: `Codexa Notes: Pod Anatomy, Multi-Container Patterns & Lifecycle`,
    order: 2,
    content: `# Pod Anatomy, Multi-Container Patterns & Lifecycle

Explore Pod manifests, Sidecar/Init container patterns, shared loopback/volumes, and liveness/readiness probes.

Pods wrap one or more tightly coupled containers sharing network and storage contexts.

---

### Multi-Container Design Patterns
- **Sidecar**: Extends main container functionality (e.g. log shipper, proxy).
- **Init Container**: Runs to completion before main application containers start (e.g. database migration, fetching secrets).

### Declarative Pod Manifest with Probes
\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: api-pod
  labels:
    app: backend
spec:
  containers:
    - name: api
      image: codexa/api:v1.0
      ports:
        - containerPort: 5000
      livenessProbe:
        httpGet:
          path: /health
          port: 5000
        initialDelaySeconds: 15
        periodSeconds: 10
      readinessProbe:
        httpGet:
          path: /ready
          port: 5000
        initialDelaySeconds: 5
        periodSeconds: 5
\`\`\`

## Why Pod Anatomy, Multi-Container Patterns & Lifecycle Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check 'httpGet' in probe_dict and isinstance(initialDelaySeconds, int)

> ⚠️ **Common Mistake**: Readiness probe failures isolate the Pod from Service endpoints to prevent failed user requests. Unlike Liveness probes, Readiness probes do NOT kill the container.

## Real-World Production Scenario

In production engineering, **Pod Anatomy, Multi-Container Patterns & Lifecycle** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Pod Anatomy, Multi-Container Patterns & Lifecycle. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Kubernetes Documentation: Pods')?._id,
  });

  const k8sL2_Challenge = await ChallengeModel.create({
    title: `Validate Probe Configuration Object`,
    description: `Write a Python function \`validate_probe(probe_dict)\` that returns True if \`probe_dict\` has \`'httpGet'\` and integer \`'initialDelaySeconds'\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def validate_probe(probe_dict):
    # Return boolean
    pass
`,
    solutionCode: `def validate_probe(probe_dict):
    return 'httpGet' in probe_dict and isinstance(probe_dict.get('initialDelaySeconds'), int)`,
    hints: ["Check 'httpGet' in probe_dict and isinstance(initialDelaySeconds, int)"],
    skills: [{"skillId": "kubernetes", "weight": 1.0}],
    testCases: [{"input": "validate_probe({'httpGet': {'path': '/health'}, 'initialDelaySeconds': 10})", "expectedOutput": "True", "description": "Validates probe structure", "hidden": false}],
  });

  const k8sL2_Practice = await ActivityModel.create({
    lessonId: k8sL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Validate Probe Configuration Object`,
    order: 3,
    challengeRef: k8sL2_Challenge._id,
    content: `# Code Practice: Validate Probe Configuration Object\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  k8sL2_Challenge.activityId = k8sL2_Practice._id;
  await k8sL2_Challenge.save();

  const k8sL2_Quiz = await AssessmentModel.create({
    title: `Assessment: Pod Lifecycle & Probes`,
    description: `Test probe behaviors and sidecar networking.`,
    passingScore: 70,
    skills: [{"skillId": "kubernetes", "weight": 1.0}],
    questions: [
    {
        "question": "What occurs when a container's Readiness Probe fails consecutively?",
        "options": [
            "Kubelet kills and restarts the container",
            "The Pod's IP is removed from all matching Kubernetes Service endpoints so it stops receiving client traffic, but the container remains running",
            "The node reboots",
            "The deployment scales to zero"
        ],
        "explanation": "Readiness probe failures isolate the Pod from Service endpoints to prevent failed user requests. Unlike Liveness probes, Readiness probes do NOT kill the container.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const k8sL2_Assessment = await ActivityModel.create({
    lessonId: k8sL2._id,
    type: 'QUIZ',
    title: `Assessment: Pod Lifecycle & Probes`,
    order: 4,
    assessmentRef: k8sL2_Quiz._id,
  });
  k8sL2_Quiz.activityId = k8sL2_Assessment._id;
  await k8sL2_Quiz.save();

  k8sL2.activities = [
    k8sL2_Video._id,
    k8sL2_Notes._id,
    k8sL2_Practice._id,
    k8sL2_Assessment._id,
  ] as any;
  await k8sL2.save();

  k8sMod1.lessons = [k8sL1._id, k8sL2._id] as any;
  await k8sMod1.save();

  const k8sMod2 = await ModuleModel.create({
    courseId: k8sCourse._id,
    title: `Module 2: Deployments, ReplicaSets & Rolling Updates`,
    description: `Master declarative Deployments, ReplicaSets, zero-downtime rolling updates (maxSurge / maxUnavailable), and instant rollbacks.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Declarative Deployments & Scaling with ReplicaSets ---
  const k8sL3 = await LessonModel.create({
    moduleId: k8sMod2._id,
    courseId: k8sCourse._id,
    title: `Declarative Deployments & Scaling with ReplicaSets`,
    description: `Understand Deployment manifests, label selectors (\`matchLabels\`), and horizontal scaling (\`kubectl scale\`).`,
    order: 1,
    activities: [],
  });

  const k8sL3_Video = await ActivityModel.create({
    lessonId: k8sL3._id,
    type: 'VIDEO',
    title: `Video: Kubernetes Deployments & ReplicaSets Tutorial`,
    order: 1,
    resourceRef: getRes('Kubernetes ReplicaSets and Desired State in Tamil')?._id,
    content: `# Key Takeaways:
- Deployments manage ReplicaSets; ReplicaSets maintain the desired number of Pod replicas.
- Label selectors match Deployments to target Pods.
- Declarative manifests applied via \`kubectl apply -f\` reconcile cluster state automatically.`,
  });

  const k8sL3_Notes = await ActivityModel.create({
    lessonId: k8sL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Declarative Deployments & Scaling with ReplicaSets`,
    order: 2,
    content: `# Declarative Deployments & Scaling with ReplicaSets

Understand Deployment manifests, label selectors (\`matchLabels\`), and horizontal scaling (\`kubectl scale\`).

Deployments provide declarative updates for Pods and ReplicaSets.

---

### Deployment Manifest (\`deployment.yaml\`)
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
  labels:
    app: codexa-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: codexa-api
  template:
    metadata:
      labels:
        app: codexa-api
    spec:
      containers:
        - name: api
          image: codexa/api:v1.2.0
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
\`\`\`

## Why Declarative Deployments & Scaling with ReplicaSets Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use .get('spec', {}).get('replicas', 1)

> ⚠️ **Common Mistake**: Deployments manage ReplicaSets, and ReplicaSets manage the lifecycle and count of individual Pods.

## Real-World Production Scenario

In production engineering, **Declarative Deployments & Scaling with ReplicaSets** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Declarative Deployments & Scaling with ReplicaSets. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Kubernetes Documentation: Pods')?._id,
  });

  const k8sL3_Challenge = await ChallengeModel.create({
    title: `Extract Deployment Replica Count`,
    description: `Write a Python function \`get_deployment_replicas(manifest_dict)\` that safely extracts and returns the integer \`spec.replicas\` (defaulting to 1 if unspecified).`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def get_deployment_replicas(manifest_dict):
    # Return integer replica count
    pass
`,
    solutionCode: `def get_deployment_replicas(manifest_dict):
    return manifest_dict.get('spec', {}).get('replicas', 1)`,
    hints: ["Use .get('spec', {}).get('replicas', 1)"],
    skills: [{"skillId": "kubernetes", "weight": 1.0}],
    testCases: [{"input": "get_deployment_replicas({'spec': {'replicas': 5}})", "expectedOutput": "5", "description": "Extracts 5 replicas", "hidden": false}],
  });

  const k8sL3_Practice = await ActivityModel.create({
    lessonId: k8sL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Extract Deployment Replica Count`,
    order: 3,
    challengeRef: k8sL3_Challenge._id,
    content: `# Code Practice: Extract Deployment Replica Count\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  k8sL3_Challenge.activityId = k8sL3_Practice._id;
  await k8sL3_Challenge.save();

  const k8sL3_Quiz = await AssessmentModel.create({
    title: `Assessment: Deployments & ReplicaSets`,
    description: `Test declarative controller reconciliation loops.`,
    passingScore: 70,
    skills: [{"skillId": "kubernetes", "weight": 1.0}],
    questions: [
    {
        "question": "In Kubernetes architecture, what directly creates and maintains the Pod instances for a Deployment?",
        "options": [
            "The API Server directly",
            "An underlying ReplicaSet created and managed by the Deployment controller",
            "The Kubelet",
            "CoreDNS"
        ],
        "explanation": "Deployments manage ReplicaSets, and ReplicaSets manage the lifecycle and count of individual Pods.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const k8sL3_Assessment = await ActivityModel.create({
    lessonId: k8sL3._id,
    type: 'QUIZ',
    title: `Assessment: Deployments & ReplicaSets`,
    order: 4,
    assessmentRef: k8sL3_Quiz._id,
  });
  k8sL3_Quiz.activityId = k8sL3_Assessment._id;
  await k8sL3_Quiz.save();

  k8sL3.activities = [
    k8sL3_Video._id,
    k8sL3_Notes._id,
    k8sL3_Practice._id,
    k8sL3_Assessment._id,
  ] as any;
  await k8sL3.save();

  // --- Lesson 2: Zero-Downtime Rolling Updates & Instant Rollbacks ---
  const k8sL4 = await LessonModel.create({
    moduleId: k8sMod2._id,
    courseId: k8sCourse._id,
    title: `Zero-Downtime Rolling Updates & Instant Rollbacks`,
    description: `Configure RollingUpdate strategies with maxSurge and maxUnavailable, track rollout history, and perform rollbacks.`,
    order: 2,
    activities: [],
  });

  const k8sL4_Video = await ActivityModel.create({
    lessonId: k8sL4._id,
    type: 'VIDEO',
    title: `Video: Zero-Downtime Deployments & Rollbacks in Kubernetes`,
    order: 1,
    resourceRef: getRes('Kubernetes Deployments and Rolling Updates in Tamil')?._id,
    content: `# Key Takeaways:
- \`RollingUpdate\` progressively replaces old Pods with new Pods without downtime.
- \`maxSurge\` controls how many extra Pods can be created above desired replicas.
- \`maxUnavailable\` limits how many Pods can be down during the rollout.
- \`kubectl rollout undo\` rolls back to previous revision instantly.`,
  });

  const k8sL4_Notes = await ActivityModel.create({
    lessonId: k8sL4._id,
    type: 'NOTES',
    title: `Codexa Notes: Zero-Downtime Rolling Updates & Instant Rollbacks`,
    order: 2,
    content: `# Zero-Downtime Rolling Updates & Instant Rollbacks

Configure RollingUpdate strategies with maxSurge and maxUnavailable, track rollout history, and perform rollbacks.

Deployments enable zero-downtime application releases through progressive Pod replacement.

---

### Rolling Update Strategy Configuration
\`\`\`yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%        # Allow 25% additional pods during rollout
      maxUnavailable: 0     # Ensure 100% capacity available at all times
\`\`\`

### Rollout CLI Operations
\`\`\`bash
# Update container image
kubectl set image deployment/api-deployment api=codexa/api:v2.0.0

# Watch rollout progress in real-time
kubectl rollout status deployment/api-deployment

# View historical revisions
kubectl rollout history deployment/api-deployment

# Rollback to previous working version immediately
kubectl rollout undo deployment/api-deployment
\`\`\`

## Why Zero-Downtime Rolling Updates & Instant Rollbacks Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Compute math.ceil(replicas * (max_surge_pct / 100.0))

> ⚠️ **Common Mistake**: Setting \`maxUnavailable: 0\` ensures Kubernetes never terminates an existing healthy Pod until a new Pod is fully started and ready.

## Real-World Production Scenario

In production engineering, **Zero-Downtime Rolling Updates & Instant Rollbacks** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Zero-Downtime Rolling Updates & Instant Rollbacks. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Kubernetes Documentation: Pods')?._id,
  });

  const k8sL4_Challenge = await ChallengeModel.create({
    title: `Calculate Maximum Allowed Pods During Rollout`,
    description: `Write a Python function \`calc_max_pods(replicas, max_surge_pct)\` that calculates \`replicas + math.ceil(replicas * (max_surge_pct / 100.0))\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `import math

def calc_max_pods(replicas, max_surge_pct):
    # Return integer maximum pods
    pass
`,
    solutionCode: `import math

def calc_max_pods(replicas, max_surge_pct):
    return replicas + math.ceil(replicas * (max_surge_pct / 100.0))`,
    hints: ["Compute math.ceil(replicas * (max_surge_pct / 100.0))", "Add to replicas"],
    skills: [{"skillId": "kubernetes", "weight": 1.0}],
    testCases: [{"input": "calc_max_pods(4, 25)", "expectedOutput": "5", "description": "Calculates 4 + ceil(1) = 5 pods", "hidden": false}],
  });

  const k8sL4_Practice = await ActivityModel.create({
    lessonId: k8sL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Calculate Maximum Allowed Pods During Rollout`,
    order: 3,
    challengeRef: k8sL4_Challenge._id,
    content: `# Code Practice: Calculate Maximum Allowed Pods During Rollout\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  k8sL4_Challenge.activityId = k8sL4_Practice._id;
  await k8sL4_Challenge.save();

  const k8sL4_Quiz = await AssessmentModel.create({
    title: `Assessment: Rolling Updates`,
    description: `Test rolling update parameters and rollback mechanics.`,
    passingScore: 70,
    skills: [{"skillId": "kubernetes", "weight": 1.0}],
    questions: [
    {
        "question": "Which rolling update configuration guarantees that 100% of application service capacity remains available during a deployment rollout?",
        "options": [
            "maxUnavailable: 50%",
            "maxUnavailable: 0 and maxSurge: 25%",
            "strategy: Recreate",
            "replicas: 1"
        ],
        "explanation": "Setting `maxUnavailable: 0` ensures Kubernetes never terminates an existing healthy Pod until a new Pod is fully started and ready.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const k8sL4_Assessment = await ActivityModel.create({
    lessonId: k8sL4._id,
    type: 'QUIZ',
    title: `Assessment: Rolling Updates`,
    order: 4,
    assessmentRef: k8sL4_Quiz._id,
  });
  k8sL4_Quiz.activityId = k8sL4_Assessment._id;
  await k8sL4_Quiz.save();

  k8sL4.activities = [
    k8sL4_Video._id,
    k8sL4_Notes._id,
    k8sL4_Practice._id,
    k8sL4_Assessment._id,
  ] as any;
  await k8sL4.save();

  k8sMod2.lessons = [k8sL3._id, k8sL4._id] as any;
  await k8sMod2.save();

  const k8sMod3 = await ModuleModel.create({
    courseId: k8sCourse._id,
    title: `Module 3: Services, Ingress & Cluster Networking`,
    description: `Master ClusterIP, NodePort, LoadBalancer, CoreDNS service discovery, Ingress Controllers, and TLS termination.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: Kubernetes Services & CoreDNS Discovery ---
  const k8sL5 = await LessonModel.create({
    moduleId: k8sMod3._id,
    courseId: k8sCourse._id,
    title: `Kubernetes Services & CoreDNS Discovery`,
    description: `Explore ClusterIP, NodePort, LoadBalancer types, endpoints, and internal DNS resolution (\`<service>.<namespace>.svc.cluster.local\`).`,
    order: 1,
    activities: [],
  });

  const k8sL5_Video = await ActivityModel.create({
    lessonId: k8sL5._id,
    type: 'VIDEO',
    title: `Video: Kubernetes Services Explained (ClusterIP, NodePort, LoadBalancer)`,
    order: 1,
    resourceRef: getRes('Kubernetes Services and Endpoints Networking in Tamil')?._id,
    content: `# Key Takeaways:
- Pod IPs are ephemeral; Services provide stable IP addresses and DNS names.
- ClusterIP (default) provides internal cluster load balancing.
- CoreDNS resolves services as \`service-name.namespace.svc.cluster.local\`.`,
  });

  const k8sL5_Notes = await ActivityModel.create({
    lessonId: k8sL5._id,
    type: 'NOTES',
    title: `Codexa Notes: Kubernetes Services & CoreDNS Discovery`,
    order: 2,
    content: `# Kubernetes Services & CoreDNS Discovery

Explore ClusterIP, NodePort, LoadBalancer types, endpoints, and internal DNS resolution (\`<service>.<namespace>.svc.cluster.local\`).

Services provide stable virtual IPs and load balancing across dynamic sets of ephemeral Pods.

---

### Service Types
1. **ClusterIP (Default)**: Exposes service on an internal IP reachable only within cluster.
2. **NodePort**: Exposes service on static high port (30000-32767) on every node's IP.
3. **LoadBalancer**: Provisions an external cloud load balancer (AWS NLB, GCP Load Balancer).

### ClusterIP Manifest (\`service.yaml\`)
\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: default
spec:
  type: ClusterIP
  selector:
    app: codexa-api
  ports:
    - port: 80
      targetPort: 5000
\`\`\`
Internal FQDN: \`api-service.default.svc.cluster.local\`

## Why Kubernetes Services & CoreDNS Discovery Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Format string: service.namespace.svc.domain

> ⚠️ **Common Mistake**: ClusterIP assigns an internal-only IP, ensuring the service is accessible only to workloads inside the cluster.

## Real-World Production Scenario

In production engineering, **Kubernetes Services & CoreDNS Discovery** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Kubernetes Services & CoreDNS Discovery. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Kubernetes Documentation: Pods')?._id,
  });

  const k8sL5_Challenge = await ChallengeModel.create({
    title: `Construct Kubernetes Service FQDN`,
    description: `Write a Python function \`build_k8s_fqdn(service_name, namespace='default', cluster_domain='cluster.local')\` that returns \`f'{service_name}.{namespace}.svc.{cluster_domain}'\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def build_k8s_fqdn(service_name, namespace='default', cluster_domain='cluster.local'):
    # Return FQDN string
    pass
`,
    solutionCode: `def build_k8s_fqdn(service_name, namespace='default', cluster_domain='cluster.local'):
    return f'{service_name}.{namespace}.svc.{cluster_domain}'`,
    hints: ["Format string: service.namespace.svc.domain"],
    skills: [{"skillId": "kubernetes", "weight": 1.0}],
    testCases: [{"input": "build_k8s_fqdn('redis-svc', 'prod')", "expectedOutput": "'redis-svc.prod.svc.cluster.local'", "description": "Constructs standard CoreDNS FQDN", "hidden": false}],
  });

  const k8sL5_Practice = await ActivityModel.create({
    lessonId: k8sL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Construct Kubernetes Service FQDN`,
    order: 3,
    challengeRef: k8sL5_Challenge._id,
    content: `# Code Practice: Construct Kubernetes Service FQDN\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  k8sL5_Challenge.activityId = k8sL5_Practice._id;
  await k8sL5_Challenge.save();

  const k8sL5_Quiz = await AssessmentModel.create({
    title: `Assessment: Services & CoreDNS`,
    description: `Test service type selection and DNS addressing.`,
    passingScore: 70,
    skills: [{"skillId": "kubernetes", "weight": 1.0}],
    questions: [
    {
        "question": "Which Kubernetes Service type is best suited for internal database communication that should NEVER be exposed outside the cluster?",
        "options": [
            "NodePort",
            "LoadBalancer",
            "ClusterIP",
            "ExternalName"
        ],
        "explanation": "ClusterIP assigns an internal-only IP, ensuring the service is accessible only to workloads inside the cluster.",
        "correctOption": 2,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const k8sL5_Assessment = await ActivityModel.create({
    lessonId: k8sL5._id,
    type: 'QUIZ',
    title: `Assessment: Services & CoreDNS`,
    order: 4,
    assessmentRef: k8sL5_Quiz._id,
  });
  k8sL5_Quiz.activityId = k8sL5_Assessment._id;
  await k8sL5_Quiz.save();

  k8sL5.activities = [
    k8sL5_Video._id,
    k8sL5_Notes._id,
    k8sL5_Practice._id,
    k8sL5_Assessment._id,
  ] as any;
  await k8sL5.save();

  // --- Lesson 2: Ingress Controllers, Routing Rules & TLS Termination ---
  const k8sL6 = await LessonModel.create({
    moduleId: k8sMod3._id,
    courseId: k8sCourse._id,
    title: `Ingress Controllers, Routing Rules & TLS Termination`,
    description: `Route external HTTP/HTTPS traffic to internal services using Ingress resources, path-based routing, and cert-manager TLS certificates.`,
    order: 2,
    activities: [],
  });

  const k8sL6_Video = await ActivityModel.create({
    lessonId: k8sL6._id,
    type: 'VIDEO',
    title: `Video: Kubernetes Ingress Controller Tutorial (Nginx Ingress & Cert-Manager)`,
    order: 1,
    resourceRef: getRes('Kubernetes Service Types ClusterIP NodePort LoadBalancer in Tamil')?._id,
    content: `# Key Takeaways:
- Ingress acts as an L7 HTTP reverse proxy managing traffic routing into the cluster.
- Eliminates the need to create expensive individual cloud LoadBalancers per service.
- cert-manager automates Let's Encrypt TLS certificate provisioning.`,
  });

  const k8sL6_Notes = await ActivityModel.create({
    lessonId: k8sL6._id,
    type: 'NOTES',
    title: `Codexa Notes: Ingress Controllers, Routing Rules & TLS Termination`,
    order: 2,
    content: `# Ingress Controllers, Routing Rules & TLS Termination

Route external HTTP/HTTPS traffic to internal services using Ingress resources, path-based routing, and cert-manager TLS certificates.

An Ingress manages external access to services, typically HTTP/HTTPS, providing host and path-based routing.

---

### Ingress Manifest (\`ingress.yaml\`)
\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: main-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - api.codexa.dev
      secretName: codexa-tls-cert
  rules:
    - host: api.codexa.dev
      http:
        paths:
          - path: /v1
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
\`\`\`

## Why Ingress Controllers, Routing Rules & TLS Termination Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check if any rule has 'host' in rules

> ⚠️ **Common Mistake**: Ingress acts as a unified L7 reverse proxy, consolidating all routing and TLS termination behind a single external IP / LoadBalancer.

## Real-World Production Scenario

In production engineering, **Ingress Controllers, Routing Rules & TLS Termination** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Ingress Controllers, Routing Rules & TLS Termination. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Kubernetes Documentation: Pods')?._id,
  });

  const k8sL6_Challenge = await ChallengeModel.create({
    title: `Validate Ingress Host Routing Rule`,
    description: `Write a Python function \`validate_ingress_rules(ingress_dict)\` that returns True if \`ingress_dict['spec']['rules']\` contains at least one rule with a valid \`'host'\` string.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def validate_ingress_rules(ingress_dict):
    # Return boolean
    pass
`,
    solutionCode: `def validate_ingress_rules(ingress_dict):
    rules = ingress_dict.get('spec', {}).get('rules', [])
    return any('host' in r for r in rules)`,
    hints: ["Check if any rule has 'host' in rules"],
    skills: [{"skillId": "kubernetes", "weight": 1.0}],
    testCases: [{"input": "validate_ingress_rules({'spec': {'rules': [{'host': 'codexa.dev'}]}})", "expectedOutput": "True", "description": "Validates Ingress host rule", "hidden": false}],
  });

  const k8sL6_Practice = await ActivityModel.create({
    lessonId: k8sL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Validate Ingress Host Routing Rule`,
    order: 3,
    challengeRef: k8sL6_Challenge._id,
    content: `# Code Practice: Validate Ingress Host Routing Rule\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  k8sL6_Challenge.activityId = k8sL6_Practice._id;
  await k8sL6_Challenge.save();

  const k8sL6_Quiz = await AssessmentModel.create({
    title: `Assessment: Ingress Controllers`,
    description: `Test L7 routing rules and TLS secret integration.`,
    passingScore: 70,
    skills: [{"skillId": "kubernetes", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary architectural advantage of using an Ingress Controller over creating separate LoadBalancer services for 20 microservices?",
        "options": [
            "Ingress bypasses TCP handshakes",
            "A single Ingress controller routes traffic across dozens of services via URL paths/domains, saving the substantial cost and quota of 20 distinct cloud LoadBalancers",
            "Ingress removes the need for container images",
            "Ingress runs without worker nodes"
        ],
        "explanation": "Ingress acts as a unified L7 reverse proxy, consolidating all routing and TLS termination behind a single external IP / LoadBalancer.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const k8sL6_Assessment = await ActivityModel.create({
    lessonId: k8sL6._id,
    type: 'QUIZ',
    title: `Assessment: Ingress Controllers`,
    order: 4,
    assessmentRef: k8sL6_Quiz._id,
  });
  k8sL6_Quiz.activityId = k8sL6_Assessment._id;
  await k8sL6_Quiz.save();

  k8sL6.activities = [
    k8sL6_Video._id,
    k8sL6_Notes._id,
    k8sL6_Practice._id,
    k8sL6_Assessment._id,
  ] as any;
  await k8sL6.save();

  k8sMod3.lessons = [k8sL5._id, k8sL6._id] as any;
  await k8sMod3.save();

  const k8sMod4 = await ModuleModel.create({
    courseId: k8sCourse._id,
    title: `Module 4: Configuration Decoupling & Helm Package Management`,
    description: `Master ConfigMaps, Secrets, volume mounts, Helm chart architecture (values.yaml, templates), and release lifecycle management.`,
    order: 4,
    lessons: [],
  });

  // --- Lesson 1: Decoupling Configuration with ConfigMaps & Secrets ---
  const k8sL7 = await LessonModel.create({
    moduleId: k8sMod4._id,
    courseId: k8sCourse._id,
    title: `Decoupling Configuration with ConfigMaps & Secrets`,
    description: `Inject environment variables and configuration files from ConfigMaps and base64/sealed Secrets into Pods.`,
    order: 1,
    activities: [],
  });

  const k8sL7_Video = await ActivityModel.create({
    lessonId: k8sL7._id,
    type: 'VIDEO',
    title: `Video: Kubernetes ConfigMaps and Secrets Tutorial`,
    order: 1,
    resourceRef: getRes('Kubernetes Cluster Node and Pod Hierarchy in Tamil')?._id,
    content: `# Key Takeaways:
- ConfigMaps decouple non-sensitive configuration data from container images.
- Secrets store sensitive credentials (base64 encoded; use KMS encryption at rest).
- Mount ConfigMaps as environment variables or mounted files in \`/etc/config\`.`,
  });

  const k8sL7_Notes = await ActivityModel.create({
    lessonId: k8sL7._id,
    type: 'NOTES',
    title: `Codexa Notes: Decoupling Configuration with ConfigMaps & Secrets`,
    order: 2,
    content: `# Decoupling Configuration with ConfigMaps & Secrets

Inject environment variables and configuration files from ConfigMaps and base64/sealed Secrets into Pods.

Externalizing configuration allows the same immutable container image to run across Dev, Staging, and Production.

---

### 1. ConfigMap Manifest
\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
data:
  APP_ENV: "production"
  LOG_LEVEL: "info"
\`\`\`

### 2. Consuming ConfigMaps in Pods
\`\`\`yaml
spec:
  containers:
    - name: api
      image: codexa/api:v1.0
      envFrom:
        - configMapRef:
            name: api-config
        - secretRef:
            name: api-secrets
\`\`\`

## Why Decoupling Configuration with ConfigMaps & Secrets Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Use base64.b64encode(raw.encode('utf-8')).decode('utf-8')

> ⚠️ **Common Mistake**: Baking config into images breaches security best practices, risks credential exposure in registries, and breaks environment portability.

## Real-World Production Scenario

In production engineering, **Decoupling Configuration with ConfigMaps & Secrets** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Decoupling Configuration with ConfigMaps & Secrets. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Kubernetes Documentation: Pods')?._id,
  });

  const k8sL7_Challenge = await ChallengeModel.create({
    title: `Encode Kubernetes Secret Base64 Value`,
    description: `Write a Python function \`encode_k8s_secret(raw_str)\` that encodes a raw string to its UTF-8 Base64 string representation.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `import base64

def encode_k8s_secret(raw_str):
    # Return base64 string
    pass
`,
    solutionCode: `import base64

def encode_k8s_secret(raw_str):
    return base64.b64encode(raw_str.encode('utf-8')).decode('utf-8')`,
    hints: ["Use base64.b64encode(raw.encode('utf-8')).decode('utf-8')"],
    skills: [{"skillId": "kubernetes", "weight": 1.0}],
    testCases: [{"input": "encode_k8s_secret('supersecretpassword')", "expectedOutput": "'c3VwZXJzZWNyZXRwYXNzd29yZA=='", "description": "Encodes base64 secret", "hidden": false}],
  });

  const k8sL7_Practice = await ActivityModel.create({
    lessonId: k8sL7._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Encode Kubernetes Secret Base64 Value`,
    order: 3,
    challengeRef: k8sL7_Challenge._id,
    content: `# Code Practice: Encode Kubernetes Secret Base64 Value\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  k8sL7_Challenge.activityId = k8sL7_Practice._id;
  await k8sL7_Challenge.save();

  const k8sL7_Quiz = await AssessmentModel.create({
    title: `Assessment: ConfigMaps & Secrets`,
    description: `Test configuration decoupling and secret injection.`,
    passingScore: 70,
    skills: [{"skillId": "kubernetes", "weight": 1.0}],
    questions: [
    {
        "question": "Why is storing configuration parameters and API keys directly inside Docker container images an anti-pattern?",
        "options": [
            "Images become un-bootable",
            "It violates the 12-factor app methodology, leaks secrets in image registries, and requires rebuilding the image to change a simple config parameter",
            "Kubernetes refuses to pull images with strings",
            "Dockerfiles cannot contain text"
        ],
        "explanation": "Baking config into images breaches security best practices, risks credential exposure in registries, and breaks environment portability.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const k8sL7_Assessment = await ActivityModel.create({
    lessonId: k8sL7._id,
    type: 'QUIZ',
    title: `Assessment: ConfigMaps & Secrets`,
    order: 4,
    assessmentRef: k8sL7_Quiz._id,
  });
  k8sL7_Quiz.activityId = k8sL7_Assessment._id;
  await k8sL7_Quiz.save();

  k8sL7.activities = [
    k8sL7_Video._id,
    k8sL7_Notes._id,
    k8sL7_Practice._id,
    k8sL7_Assessment._id,
  ] as any;
  await k8sL7.save();

  // --- Lesson 2: Helm Charts, Templating & Release Lifecycle Management ---
  const k8sL8 = await LessonModel.create({
    moduleId: k8sMod4._id,
    courseId: k8sCourse._id,
    title: `Helm Charts, Templating & Release Lifecycle Management`,
    description: `Author reusable Helm charts with Go templates, customize values.yaml per environment, and manage releases with helm install/upgrade/rollback.`,
    order: 2,
    activities: [],
  });

  const k8sL8_Video = await ActivityModel.create({
    lessonId: k8sL8._id,
    type: 'VIDEO',
    title: `Video: Helm 3 Masterclass - Complete Guide to Kubernetes Package Management`,
    order: 1,
    resourceRef: getRes('Kubernetes Explained in Tamil')?._id,
    content: `# Key Takeaways:
- Helm is the package manager for Kubernetes, packaging manifests into reusable Charts.
- Values.yaml injects environment parameters into Go template manifests.
- \`helm upgrade --install\` idempotently applies or upgrades releases.`,
  });

  const k8sL8_Notes = await ActivityModel.create({
    lessonId: k8sL8._id,
    type: 'NOTES',
    title: `Codexa Notes: Helm Charts, Templating & Release Lifecycle Management`,
    order: 2,
    content: `# Helm Charts, Templating & Release Lifecycle Management

Author reusable Helm charts with Go templates, customize values.yaml per environment, and manage releases with helm install/upgrade/rollback.

Helm templates Kubernetes YAML manifests into parameterized, versioned application packages.

---

### Chart Directory Structure
\`\`\`text
my-chart/
  Chart.yaml          # Metadata (name, version, appVersion)
  values.yaml         # Default configuration values
  templates/          # Go template manifest files
    deployment.yaml
    service.yaml
    ingress.yaml
    _helpers.tpl
\`\`\`

### Template Example (\`templates/deployment.yaml\`)
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-api
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: api
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
\`\`\`

### Helm CLI Commands
\`\`\`bash
# Lint chart templates
helm lint ./my-chart

# Install or upgrade release
helm upgrade --install codexa-prod ./my-chart -f values-prod.yaml

# Rollback release to prior revision
helm rollback codexa-prod 1
\`\`\`

## Why Helm Charts, Templating & Release Lifecycle Management Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Format string with release, chart, and -f values_file

> ⚠️ **Common Mistake**: \`values.yaml\` provides default variable values that template files reference (e.g. \`{{ .Values.replicaCount }}\`), enabling easy overrides per environment.

## Real-World Production Scenario

In production engineering, **Helm Charts, Templating & Release Lifecycle Management** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Helm Charts, Templating & Release Lifecycle Management. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('Kubernetes Documentation: Pods')?._id,
  });

  const k8sL8_Challenge = await ChallengeModel.create({
    title: `Format Helm Upgrade/Install Command`,
    description: `Write a Python function \`format_helm_upgrade(release_name, chart_path, values_file)\` that returns \`f'helm upgrade --install {release_name} {chart_path} -f {values_file}'\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def format_helm_upgrade(release_name, chart_path, values_file):
    # Return string command
    pass
`,
    solutionCode: `def format_helm_upgrade(release_name, chart_path, values_file):
    return f'helm upgrade --install {release_name} {chart_path} -f {values_file}'`,
    hints: ["Format string with release, chart, and -f values_file"],
    skills: [{"skillId": "helm-charts", "weight": 1.0}],
    testCases: [{"input": "format_helm_upgrade('api', './chart', 'values.yaml')", "expectedOutput": "'helm upgrade --install api ./chart -f values.yaml'", "description": "Formats helm upgrade command", "hidden": false}],
  });

  const k8sL8_Practice = await ActivityModel.create({
    lessonId: k8sL8._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Format Helm Upgrade/Install Command`,
    order: 3,
    challengeRef: k8sL8_Challenge._id,
    content: `# Code Practice: Format Helm Upgrade/Install Command\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  k8sL8_Challenge.activityId = k8sL8_Practice._id;
  await k8sL8_Challenge.save();

  const k8sL8_Quiz = await AssessmentModel.create({
    title: `Assessment: Helm Charts`,
    description: `Test Helm templating and release lifecycle operations.`,
    passingScore: 70,
    skills: [{"skillId": "helm-charts", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary role of the `values.yaml` file in a Helm chart?",
        "options": [
            "To compile Go source code",
            "To provide default variable parameters that are injected into Go template manifests during rendering",
            "To store cluster root passwords",
            "To configure the Linux kernel"
        ],
        "explanation": "`values.yaml` provides default variable values that template files reference (e.g. `{{ .Values.replicaCount }}`), enabling easy overrides per environment.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const k8sL8_Assessment = await ActivityModel.create({
    lessonId: k8sL8._id,
    type: 'QUIZ',
    title: `Assessment: Helm Charts`,
    order: 4,
    assessmentRef: k8sL8_Quiz._id,
  });
  k8sL8_Quiz.activityId = k8sL8_Assessment._id;
  await k8sL8_Quiz.save();

  k8sL8.activities = [
    k8sL8_Video._id,
    k8sL8_Notes._id,
    k8sL8_Practice._id,
    k8sL8_Assessment._id,
  ] as any;
  await k8sL8.save();

  k8sMod4.lessons = [k8sL7._id, k8sL8._id] as any;
  await k8sMod4.save();

  k8sCourse.modules = [k8sMod1._id, k8sMod2._id, k8sMod3._id, k8sMod4._id] as any;
  await k8sCourse.save();

  // =========================================================================
  // 5. AWS CLOUD ARCHITECTURE & CORE SERVICES (4 MODULES, 8 LESSONS)
  // =========================================================================
  const awsCourse = await CourseModel.create({
    slug: 'aws-cloud-fundamentals',
    title: 'AWS Cloud Architecture & Core Services Engineering',
    description: 'Master Amazon Web Services (AWS) infrastructure: IAM security policies, EC2 auto-scaling, Serverless Lambda with API Gateway, S3 storage tiers, RDS/DynamoDB databases, and VPC networking.',
    domain: 'DevOps / Cloud / Systems',
    level: 'BEGINNER',
    status: 'PUBLISHED',
    estimatedHours: 35,
    skillsCovered: ['aws-cloud', 'iam-security', 'serverless-architecture', 'cloud-infrastructure'],
    prerequisites: ['Basic networking concepts', 'Command line familiarity'],
    modules: [],
  });

  const awsMod1 = await ModuleModel.create({
    courseId: awsCourse._id,
    title: `Module 1: Cloud Foundations & Identity (IAM)`,
    description: `Understand AWS Global Infrastructure (Regions, AZs, Edge Locations), Shared Responsibility Model, and IAM least-privilege security.`,
    order: 1,
    lessons: [],
  });

  // --- Lesson 1: AWS Global Infrastructure & Shared Responsibility Model ---
  const awsL1 = await LessonModel.create({
    moduleId: awsMod1._id,
    courseId: awsCourse._id,
    title: `AWS Global Infrastructure & Shared Responsibility Model`,
    description: `Explore Regions, Availability Zones (AZs), low-latency Edge Locations, and the customer vs AWS security divide.`,
    order: 1,
    activities: [],
  });

  const awsL1_Video = await ActivityModel.create({
    lessonId: awsL1._id,
    type: 'VIDEO',
    title: `Video: AWS Certified Cloud Practitioner Tutorial - Global Infrastructure & IAM`,
    order: 1,
    resourceRef: getRes('AWS Cloud Computing Fundamentals and IAM')?._id,
    content: `# Key Takeaways:
- Regions contain 3+ isolated Availability Zones (AZs) connected via low-latency fiber.
- Shared Responsibility: AWS secures the cloud (hardware/hypervisor); customer secures IN the cloud (data/IAM/OS).
- Edge locations cache CloudFront CDN content close to global users.`,
  });

  const awsL1_Notes = await ActivityModel.create({
    lessonId: awsL1._id,
    type: 'NOTES',
    title: `Codexa Notes: AWS Global Infrastructure & Shared Responsibility Model`,
    order: 2,
    content: `# AWS Global Infrastructure & Shared Responsibility Model

Explore Regions, Availability Zones (AZs), low-latency Edge Locations, and the customer vs AWS security divide.

AWS operates a global distributed data center infrastructure designed for high availability and disaster recovery.

---

### Global Infrastructure Hierarchy
1. **Region**: Physical geographic area with cluster of data centers (e.g. \`us-east-1\`, \`ap-south-1\`).
2. **Availability Zone (AZ)**: One or more discrete data centers with redundant power and networking located within a Region (e.g. \`us-east-1a\`, \`us-east-1b\`).
3. **Edge Locations**: Global Points of Presence (PoPs) running CloudFront CDN and Route 53 DNS caching.

### The Shared Responsibility Model
- **Security OF the Cloud (AWS)**: Physical data centers, server hardware, virtualization hypervisors, global network cabling.
- **Security IN the Cloud (Customer)**: IAM credentials, encryption, database access rules, OS patching on EC2, firewall (Security Group) configurations.

## Why AWS Global Infrastructure & Shared Responsibility Model Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
import re

def is_valid_aws_region(region_str):
    pattern = r'^[a-z]{2}-[a-z]+-\\d+$'
    return bool(re.match(pattern, region_str))
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Use regex matching [a-z]{2}-[a-z]+-\\d+

> ⚠️ **Common Mistake**: For IaaS services like EC2, the customer is responsible for managing the guest OS, applying OS patches, configuring firewalls, and managing application data.

## Real-World Production Scenario

In production engineering, **AWS Global Infrastructure & Shared Responsibility Model** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of AWS Global Infrastructure & Shared Responsibility Model. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('AWS Architecture Center')?._id,
  });

  const awsL1_Challenge = await ChallengeModel.create({
    title: `Validate AWS Region String Format`,
    description: `Write a Python function \`is_valid_aws_region(region_str)\` that returns True if \`region_str\` matches standard pattern like \`'us-east-1'\`, \`'eu-west-2'\`, \`'ap-south-1'\` (format: 2-char prefix, direction, number).`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `import re

def is_valid_aws_region(region_str):
    # Return boolean
    pass
`,
    solutionCode: `import re

def is_valid_aws_region(region_str):
    pattern = r'^[a-z]{2}-[a-z]+-\\d+$'
    return bool(re.match(pattern, region_str))`,
    hints: ["Use regex matching [a-z]{2}-[a-z]+-\\d+"],
    skills: [{"skillId": "aws-cloud", "weight": 1.0}],
    testCases: [{"input": "is_valid_aws_region('us-east-1')", "expectedOutput": "True", "description": "Validates AWS region format", "hidden": false}],
  });

  const awsL1_Practice = await ActivityModel.create({
    lessonId: awsL1._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Validate AWS Region String Format`,
    order: 3,
    challengeRef: awsL1_Challenge._id,
    content: `# Code Practice: Validate AWS Region String Format\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  awsL1_Challenge.activityId = awsL1_Practice._id;
  await awsL1_Challenge.save();

  const awsL1_Quiz = await AssessmentModel.create({
    title: `Assessment: AWS Global Infrastructure`,
    description: `Test Shared Responsibility and Availability Zone mechanics.`,
    passingScore: 70,
    skills: [{"skillId": "aws-cloud", "weight": 1.0}],
    questions: [
    {
        "question": "Under the AWS Shared Responsibility Model, which of the following is the customer's direct responsibility when using Amazon EC2?",
        "options": [
            "Physical data center security",
            "Operating system security patching and user password configuration on the EC2 virtual machine",
            "Hypervisor hardware replacement",
            "Underlying fiber optic network maintenance"
        ],
        "explanation": "For IaaS services like EC2, the customer is responsible for managing the guest OS, applying OS patches, configuring firewalls, and managing application data.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const awsL1_Assessment = await ActivityModel.create({
    lessonId: awsL1._id,
    type: 'QUIZ',
    title: `Assessment: AWS Global Infrastructure`,
    order: 4,
    assessmentRef: awsL1_Quiz._id,
  });
  awsL1_Quiz.activityId = awsL1_Assessment._id;
  await awsL1_Quiz.save();

  awsL1.activities = [
    awsL1_Video._id,
    awsL1_Notes._id,
    awsL1_Practice._id,
    awsL1_Assessment._id,
  ] as any;
  await awsL1.save();

  // --- Lesson 2: AWS IAM: Users, Groups, Roles & Least Privilege Policies ---
  const awsL2 = await LessonModel.create({
    moduleId: awsMod1._id,
    courseId: awsCourse._id,
    title: `AWS IAM: Users, Groups, Roles & Least Privilege Policies`,
    description: `Master JSON IAM policies (Effect, Action, Resource, Condition), IAM Roles for EC2/Lambda, and multi-factor authentication (MFA).`,
    order: 2,
    activities: [],
  });

  const awsL2_Video = await ActivityModel.create({
    lessonId: awsL2._id,
    type: 'VIDEO',
    title: `Video: AWS IAM Explained: Users, Roles, Policies & Best Practices`,
    order: 1,
    resourceRef: getRes('AWS Cloud Computing Fundamentals and IAM')?._id,
    content: `# Key Takeaways:
- Never use the root account for daily administration; enforce MFA and create IAM users.
- IAM Roles provide temporary STS credentials for applications without hardcoded keys.
- IAM Policies use JSON declarations following the principle of Least Privilege.`,
  });

  const awsL2_Notes = await ActivityModel.create({
    lessonId: awsL2._id,
    type: 'NOTES',
    title: `Codexa Notes: AWS IAM: Users, Groups, Roles & Least Privilege Policies`,
    order: 2,
    content: `# AWS IAM: Users, Groups, Roles & Least Privilege Policies

Master JSON IAM policies (Effect, Action, Resource, Condition), IAM Roles for EC2/Lambda, and multi-factor authentication (MFA).

IAM securely controls authentication and authorization across all AWS cloud resources.

---

### IAM Entities
- **IAM User**: Individual person or service with credentials.
- **IAM Group**: Collection of users sharing identical permission policies.
- **IAM Role**: Identity with temporary credentials assumed by services (EC2, Lambda) or federated users.
- **IAM Policy**: JSON document defining allowed/denied actions.

### IAM Policy Structure
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadOnly",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::codexa-production-assets",
        "arn:aws:s3:::codexa-production-assets/*"
      ]
    }
  ]
}
\`\`\`

## Why AWS IAM: Users, Groups, Roles & Least Privilege Policies Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Return dict with Version and Statement list

> ⚠️ **Common Mistake**: Attaching an IAM role to an EC2 instance provides automatically rotated temporary credentials via the metadata service, eliminating hardcoded long-lived secrets.

## Real-World Production Scenario

In production engineering, **AWS IAM: Users, Groups, Roles & Least Privilege Policies** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of AWS IAM: Users, Groups, Roles & Least Privilege Policies. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('AWS Architecture Center')?._id,
  });

  const awsL2_Challenge = await ChallengeModel.create({
    title: `Build JSON IAM Policy Statement`,
    description: `Write a Python function \`build_iam_policy(effect, actions, resources)\` that returns a valid IAM policy dictionary structure with \`Version: '2012-10-17'\` and a Statement list.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def build_iam_policy(effect, actions, resources):
    # Return dict IAM policy
    pass
`,
    solutionCode: `def build_iam_policy(effect, actions, resources):
    return {
        'Version': '2012-10-17',
        'Statement': [{
            'Effect': effect,
            'Action': actions if isinstance(actions, list) else [actions],
            'Resource': resources if isinstance(resources, list) else [resources]
        }]
    }`,
    hints: ["Return dict with Version and Statement list"],
    skills: [{"skillId": "iam-security", "weight": 1.0}],
    testCases: [{"input": "build_iam_policy('Allow', ['s3:GetObject'], 'arn:aws:s3:::bucket/*')", "expectedOutput": "True", "description": "Constructs valid IAM policy document", "hidden": false}],
  });

  const awsL2_Practice = await ActivityModel.create({
    lessonId: awsL2._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Build JSON IAM Policy Statement`,
    order: 3,
    challengeRef: awsL2_Challenge._id,
    content: `# Code Practice: Build JSON IAM Policy Statement\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  awsL2_Challenge.activityId = awsL2_Practice._id;
  await awsL2_Challenge.save();

  const awsL2_Quiz = await AssessmentModel.create({
    title: `Assessment: IAM Policies & Roles`,
    description: `Test IAM role assumption and least privilege enforcement.`,
    passingScore: 70,
    skills: [{"skillId": "iam-security", "weight": 1.0}],
    questions: [
    {
        "question": "Why should applications running on an EC2 instance use an attached IAM Role rather than hardcoding AWS Access Keys in a configuration file?",
        "options": [
            "IAM roles are faster",
            "IAM Roles automatically generate and rotate short-lived temporary security credentials via STS, eliminating the risk of leaked persistent access keys",
            "EC2 instances cannot read JSON files",
            "Hardcoded access keys incur additional AWS billing costs"
        ],
        "explanation": "Attaching an IAM role to an EC2 instance provides automatically rotated temporary credentials via the metadata service, eliminating hardcoded long-lived secrets.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const awsL2_Assessment = await ActivityModel.create({
    lessonId: awsL2._id,
    type: 'QUIZ',
    title: `Assessment: IAM Policies & Roles`,
    order: 4,
    assessmentRef: awsL2_Quiz._id,
  });
  awsL2_Quiz.activityId = awsL2_Assessment._id;
  await awsL2_Quiz.save();

  awsL2.activities = [
    awsL2_Video._id,
    awsL2_Notes._id,
    awsL2_Practice._id,
    awsL2_Assessment._id,
  ] as any;
  await awsL2.save();

  awsMod1.lessons = [awsL1._id, awsL2._id] as any;
  await awsMod1.save();

  const awsMod2 = await ModuleModel.create({
    courseId: awsCourse._id,
    title: `Module 2: Compute & Serverless Architectures`,
    description: `Master Amazon EC2 instances, Security Groups, Auto Scaling Groups (ASG), and Serverless architectures with AWS Lambda & API Gateway.`,
    order: 2,
    lessons: [],
  });

  // --- Lesson 1: Amazon EC2, Security Groups & Auto Scaling Groups ---
  const awsL3 = await LessonModel.create({
    moduleId: awsMod2._id,
    courseId: awsCourse._id,
    title: `Amazon EC2, Security Groups & Auto Scaling Groups`,
    description: `Explore instance types (T, M, C, R), AMIs, stateful Security Group firewalls, and dynamic Auto Scaling Groups (ASG).`,
    order: 1,
    activities: [],
  });

  const awsL3_Video = await ActivityModel.create({
    lessonId: awsL3._id,
    type: 'VIDEO',
    title: `Video: Amazon EC2, Security Groups & Auto Scaling Masterclass`,
    order: 1,
    resourceRef: getRes('AWS EC2 Virtual Servers and Security Groups')?._id,
    content: `# Key Takeaways:
- EC2 provides resizable virtual compute instances in the cloud.
- Security Groups are stateful virtual firewalls operating at the instance ENI level.
- Auto Scaling Groups (ASG) scale instance count horizontally based on CPU utilization.`,
  });

  const awsL3_Notes = await ActivityModel.create({
    lessonId: awsL3._id,
    type: 'NOTES',
    title: `Codexa Notes: Amazon EC2, Security Groups & Auto Scaling Groups`,
    order: 2,
    content: `# Amazon EC2, Security Groups & Auto Scaling Groups

Explore instance types (T, M, C, R), AMIs, stateful Security Group firewalls, and dynamic Auto Scaling Groups (ASG).

Elastic Compute Cloud (EC2) provides secure, resizable compute capacity.

---

### 1. Instance Types Naming Convention
\`t4g.xlarge\`:
- \`t\`: Instance Family (General purpose burstable).
- \`4\`: Generation (4th gen).
- \`g\`: Processor Architecture (AWS Graviton ARM).
- \`xlarge\`: Size (4 vCPUs, 16 GiB RAM).

### 2. Security Groups vs Network ACLs
- **Security Groups (Instance Level)**: **Stateful** (Return traffic is automatically allowed regardless of inbound rules).
- **Network ACLs (Subnet Level)**: **Stateless** (Must explicitly define both inbound and outbound rules).

### 3. Auto Scaling Groups (ASG)
Maintains target capacity and replaces impaired instances automatically:
\`\`\`bash
# ASG scaling policy based on 60% average CPU utilization
aws autoscaling put-scaling-policy --auto-scaling-group-name api-asg ...
\`\`\`

## Why Amazon EC2, Security Groups & Auto Scaling Groups Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Split string by '.'

> ⚠️ **Common Mistake**: Security groups automatically track connection state: response traffic for an allowed incoming request is permitted back out automatically.

## Real-World Production Scenario

In production engineering, **Amazon EC2, Security Groups & Auto Scaling Groups** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Amazon EC2, Security Groups & Auto Scaling Groups. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('AWS Architecture Center')?._id,
  });

  const awsL3_Challenge = await ChallengeModel.create({
    title: `Parse EC2 Instance Family and Size`,
    description: `Write a Python function \`parse_ec2_type(instance_type)\` that splits a string like \`'m5.large'\` into a dictionary \`{'family': 'm5', 'size': 'large'}\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def parse_ec2_type(instance_type):
    # Return dict
    pass
`,
    solutionCode: `def parse_ec2_type(instance_type):
    parts = instance_type.split('.')
    return {'family': parts[0], 'size': parts[1]}`,
    hints: ["Split string by '.'"],
    skills: [{"skillId": "aws-cloud", "weight": 1.0}],
    testCases: [{"input": "parse_ec2_type('c6g.2xlarge')", "expectedOutput": "{'family': 'c6g', 'size': '2xlarge'}", "description": "Parses EC2 instance components", "hidden": false}],
  });

  const awsL3_Practice = await ActivityModel.create({
    lessonId: awsL3._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Parse EC2 Instance Family and Size`,
    order: 3,
    challengeRef: awsL3_Challenge._id,
    content: `# Code Practice: Parse EC2 Instance Family and Size\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  awsL3_Challenge.activityId = awsL3_Practice._id;
  await awsL3_Challenge.save();

  const awsL3_Quiz = await AssessmentModel.create({
    title: `Assessment: EC2 & Security Groups`,
    description: `Test EC2 instance lifecycle and firewall statefulness.`,
    passingScore: 70,
    skills: [{"skillId": "aws-cloud", "weight": 1.0}],
    questions: [
    {
        "question": "What does it mean that AWS Security Groups are 'Stateful'?",
        "options": [
            "They remember state in a database",
            "If you create an inbound rule allowing traffic on a port, return response traffic is automatically allowed outbound regardless of outbound rules",
            "They only work on Linux instances",
            "They require a persistent disk volume"
        ],
        "explanation": "Security groups automatically track connection state: response traffic for an allowed incoming request is permitted back out automatically.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const awsL3_Assessment = await ActivityModel.create({
    lessonId: awsL3._id,
    type: 'QUIZ',
    title: `Assessment: EC2 & Security Groups`,
    order: 4,
    assessmentRef: awsL3_Quiz._id,
  });
  awsL3_Quiz.activityId = awsL3_Assessment._id;
  await awsL3_Quiz.save();

  awsL3.activities = [
    awsL3_Video._id,
    awsL3_Notes._id,
    awsL3_Practice._id,
    awsL3_Assessment._id,
  ] as any;
  await awsL3.save();

  // --- Lesson 2: Serverless Computing with AWS Lambda & API Gateway ---
  const awsL4 = await LessonModel.create({
    moduleId: awsMod2._id,
    courseId: awsCourse._id,
    title: `Serverless Computing with AWS Lambda & API Gateway`,
    description: `Build event-driven serverless backends, handle cold starts, concurrency limits, and REST/HTTP API Gateway integrations.`,
    order: 2,
    activities: [],
  });

  const awsL4_Video = await ActivityModel.create({
    lessonId: awsL4._id,
    type: 'VIDEO',
    title: `Video: AWS Lambda & Serverless Architecture Tutorial`,
    order: 1,
    resourceRef: getRes('AWS Lambda Serverless Functions and Event Architecture')?._id,
    content: `# Key Takeaways:
- Lambda executes code in response to events with zero server provisioning.
- Pay only for compute time consumed in 1ms increments.
- API Gateway acts as the HTTP entry point, routing requests to Lambda functions.`,
  });

  const awsL4_Notes = await ActivityModel.create({
    lessonId: awsL4._id,
    type: 'NOTES',
    title: `Codexa Notes: Serverless Computing with AWS Lambda & API Gateway`,
    order: 2,
    content: `# Serverless Computing with AWS Lambda & API Gateway

Build event-driven serverless backends, handle cold starts, concurrency limits, and REST/HTTP API Gateway integrations.

Serverless computing allows building applications without managing, patching, or scaling virtual servers.

---

### AWS Lambda Event-Driven Execution Model
\`\`\`text
Client Request ──► Amazon API Gateway ──► AWS Lambda Function ──► Amazon DynamoDB
\`\`\`

### Lambda Handler Syntax (Node.js)
\`\`\`javascript
export const handler = async (event, context) => {
  const body = JSON.parse(event.body || '{}');
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Order processed successfully",
      requestId: context.awsRequestId
    })
  };
};
\`\`\`

### Mitigating Cold Starts
- **Provisioned Concurrency**: Keeps pre-warmed execution environments ready for instant sub-10ms responses.
- **Runtime Choice**: Node.js/Python/Go boot significantly faster than heavy JVM runtimes.

## Why Serverless Computing with AWS Lambda & API Gateway Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Return dict with statusCode, headers, and json.dumps(body_dict)

> ⚠️ **Common Mistake**: A cold start occurs when an invocation triggers the allocation of a new execution container and initialization of runtime code, adding initial latency.

## Real-World Production Scenario

In production engineering, **Serverless Computing with AWS Lambda & API Gateway** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Serverless Computing with AWS Lambda & API Gateway. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('AWS Architecture Center')?._id,
  });

  const awsL4_Challenge = await ChallengeModel.create({
    title: `Format AWS Lambda Proxy Response`,
    description: `Write a Python function \`format_lambda_response(status_code, body_dict)\` that returns a dictionary with \`'statusCode': status_code\`, \`'headers': {'Content-Type': 'application/json'}\`, and \`'body': json.dumps(body_dict)\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `import json

def format_lambda_response(status_code, body_dict):
    # Return Lambda response dict
    pass
`,
    solutionCode: `import json

def format_lambda_response(status_code, body_dict):
    return {
        'statusCode': status_code,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps(body_dict)
    }`,
    hints: ["Return dict with statusCode, headers, and json.dumps(body_dict)"],
    skills: [{"skillId": "serverless-architecture", "weight": 1.0}],
    testCases: [{"input": "format_lambda_response(200, {'ok': True})", "expectedOutput": "True", "description": "Formats API Gateway Lambda proxy response", "hidden": false}],
  });

  const awsL4_Practice = await ActivityModel.create({
    lessonId: awsL4._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Format AWS Lambda Proxy Response`,
    order: 3,
    challengeRef: awsL4_Challenge._id,
    content: `# Code Practice: Format AWS Lambda Proxy Response\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  awsL4_Challenge.activityId = awsL4_Practice._id;
  await awsL4_Challenge.save();

  const awsL4_Quiz = await AssessmentModel.create({
    title: `Assessment: Serverless & Lambda`,
    description: `Test Lambda scaling mechanics and event-driven patterns.`,
    passingScore: 70,
    skills: [{"skillId": "serverless-architecture", "weight": 1.0}],
    questions: [
    {
        "question": "What is a 'Cold Start' in AWS Lambda?",
        "options": [
            "When a server fails in cold weather",
            "The initial latency delay when Lambda spins up a new microVM container environment to execute a function invocation after being idle",
            "When a database query runs out of memory",
            "When the AWS billing cycle resets"
        ],
        "explanation": "A cold start occurs when an invocation triggers the allocation of a new execution container and initialization of runtime code, adding initial latency.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const awsL4_Assessment = await ActivityModel.create({
    lessonId: awsL4._id,
    type: 'QUIZ',
    title: `Assessment: Serverless & Lambda`,
    order: 4,
    assessmentRef: awsL4_Quiz._id,
  });
  awsL4_Quiz.activityId = awsL4_Assessment._id;
  await awsL4_Quiz.save();

  awsL4.activities = [
    awsL4_Video._id,
    awsL4_Notes._id,
    awsL4_Practice._id,
    awsL4_Assessment._id,
  ] as any;
  await awsL4.save();

  awsMod2.lessons = [awsL3._id, awsL4._id] as any;
  await awsMod2.save();

  const awsMod3 = await ModuleModel.create({
    courseId: awsCourse._id,
    title: `Module 3: Storage & Database Services`,
    description: `Master Amazon S3 storage classes, bucket policies, lifecycle rules, Amazon RDS Multi-AZ replication, and DynamoDB single-digit ms NoSQL.`,
    order: 3,
    lessons: [],
  });

  // --- Lesson 1: Amazon S3 Storage Classes, Security & Lifecycle Policies ---
  const awsL5 = await LessonModel.create({
    moduleId: awsMod3._id,
    courseId: awsCourse._id,
    title: `Amazon S3 Storage Classes, Security & Lifecycle Policies`,
    description: `Explore S3 Standard, S3 Intelligent-Tiering, Glacier Flexible/Deep Archive, SSE-KMS encryption, and bucket policies.`,
    order: 1,
    activities: [],
  });

  const awsL5_Video = await ActivityModel.create({
    lessonId: awsL5._id,
    type: 'VIDEO',
    title: `Video: Amazon S3 Masterclass (Storage Classes, Security & Lifecycle)`,
    order: 1,
    resourceRef: getRes('AWS S3 Object Storage and Bucket Policies')?._id,
    content: `# Key Takeaways:
- S3 provides 99.999999999% (11 9's) data durability across multiple AZs.
- S3 Intelligent-Tiering moves objects between access tiers automatically to save costs.
- S3 Glacier Deep Archive provides ultra-low-cost long-term compliance storage.`,
  });

  const awsL5_Notes = await ActivityModel.create({
    lessonId: awsL5._id,
    type: 'NOTES',
    title: `Codexa Notes: Amazon S3 Storage Classes, Security & Lifecycle Policies`,
    order: 2,
    content: `# Amazon S3 Storage Classes, Security & Lifecycle Policies

Explore S3 Standard, S3 Intelligent-Tiering, Glacier Flexible/Deep Archive, SSE-KMS encryption, and bucket policies.

Simple Storage Service (S3) provides infinitely scalable, highly durable object storage.

---

### S3 Storage Classes Compared
1. **S3 Standard**: High throughput, low latency for frequently accessed data (99.99% availability).
2. **S3 Intelligent-Tiering**: Automatically shifts objects between Frequent, Infrequent, and Archive tiers without operational overhead or retrieval fees.
3. **S3 Standard-IA (Infrequent Access)**: Lower storage cost, small per-GB retrieval fee.
4. **S3 Glacier Flexible / Deep Archive**: Long-term cold data archive ($0.00099 per GB/month).

### Lifecycle Management Rule Example
- Day 0: Upload to **S3 Standard**.
- Day 30: Transition to **S3 Standard-IA**.
- Day 90: Transition to **S3 Glacier Flexible Archive**.
- Day 365: Expire (Delete) permanently.

## Why Amazon S3 Storage Classes, Security & Lifecycle Policies Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
def calc_s3_storage_cost(gb_stored, storage_class='standard'):
    rates = {'standard': 0.023, 'ia': 0.0125, 'glacier': 0.004}
    rate = rates.get(storage_class.lower(), 0.023)
    return round(gb_stored * rate, 2)
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Multiply gb_stored by rate and round to 2 decimals

> ⚠️ **Common Mistake**: S3 Intelligent-Tiering automatically monitors access patterns and moves objects between frequent and infrequent access tiers without retrieval fees.

## Real-World Production Scenario

In production engineering, **Amazon S3 Storage Classes, Security & Lifecycle Policies** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Amazon S3 Storage Classes, Security & Lifecycle Policies. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('AWS Architecture Center')?._id,
  });

  const awsL5_Challenge = await ChallengeModel.create({
    title: `Calculate S3 Monthly Storage Cost`,
    description: `Write a Python function \`calc_s3_storage_cost(gb_stored, storage_class='standard')\` where \`'standard'\` is $0.023/GB, \`'ia'\` is $0.0125/GB, and \`'glacier'\` is $0.004/GB. Return the total cost rounded to 2 decimals.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def calc_s3_storage_cost(gb_stored, storage_class='standard'):
    # Return float cost
    pass
`,
    solutionCode: `def calc_s3_storage_cost(gb_stored, storage_class='standard'):
    rates = {'standard': 0.023, 'ia': 0.0125, 'glacier': 0.004}
    rate = rates.get(storage_class.lower(), 0.023)
    return round(gb_stored * rate, 2)`,
    hints: ["Multiply gb_stored by rate and round to 2 decimals"],
    skills: [{"skillId": "aws-cloud", "weight": 1.0}],
    testCases: [{"input": "calc_s3_storage_cost(1000, 'standard')", "expectedOutput": "23.0", "description": "Calculates standard storage cost for 1TB", "hidden": false}],
  });

  const awsL5_Practice = await ActivityModel.create({
    lessonId: awsL5._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Calculate S3 Monthly Storage Cost`,
    order: 3,
    challengeRef: awsL5_Challenge._id,
    content: `# Code Practice: Calculate S3 Monthly Storage Cost\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  awsL5_Challenge.activityId = awsL5_Practice._id;
  await awsL5_Challenge.save();

  const awsL5_Quiz = await AssessmentModel.create({
    title: `Assessment: S3 Storage & Lifecycle`,
    description: `Test storage tier selection and durability guarantees.`,
    passingScore: 70,
    skills: [{"skillId": "aws-cloud", "weight": 1.0}],
    questions: [
    {
        "question": "Which Amazon S3 storage class is best suited for datasets with unknown or unpredictable access patterns without incurring manual management overhead?",
        "options": [
            "S3 One Zone-IA",
            "S3 Intelligent-Tiering",
            "S3 Glacier Deep Archive",
            "S3 Standard"
        ],
        "explanation": "S3 Intelligent-Tiering automatically monitors access patterns and moves objects between frequent and infrequent access tiers without retrieval fees.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const awsL5_Assessment = await ActivityModel.create({
    lessonId: awsL5._id,
    type: 'QUIZ',
    title: `Assessment: S3 Storage & Lifecycle`,
    order: 4,
    assessmentRef: awsL5_Quiz._id,
  });
  awsL5_Quiz.activityId = awsL5_Assessment._id;
  await awsL5_Quiz.save();

  awsL5.activities = [
    awsL5_Video._id,
    awsL5_Notes._id,
    awsL5_Practice._id,
    awsL5_Assessment._id,
  ] as any;
  await awsL5.save();

  // --- Lesson 2: Amazon RDS Multi-AZ & Amazon DynamoDB NoSQL ---
  const awsL6 = await LessonModel.create({
    moduleId: awsMod3._id,
    courseId: awsCourse._id,
    title: `Amazon RDS Multi-AZ & Amazon DynamoDB NoSQL`,
    description: `Master RDS automated failover, read replicas, DynamoDB partition keys, sort keys, and Global Secondary Indexes (GSIs).`,
    order: 2,
    activities: [],
  });

  const awsL6_Video = await ActivityModel.create({
    lessonId: awsL6._id,
    type: 'VIDEO',
    title: `Video: AWS Databases: RDS vs DynamoDB (Architecture & Failover)`,
    order: 1,
    resourceRef: getRes('AWS RDS Managed Relational Databases')?._id,
    content: `# Key Takeaways:
- RDS Multi-AZ provides synchronous replication and automatic failover in < 60 seconds.
- RDS Read Replicas offload read-heavy query traffic asynchronously.
- DynamoDB delivers single-digit millisecond latency at any scale using partition key hashing.`,
  });

  const awsL6_Notes = await ActivityModel.create({
    lessonId: awsL6._id,
    type: 'NOTES',
    title: `Codexa Notes: Amazon RDS Multi-AZ & Amazon DynamoDB NoSQL`,
    order: 2,
    content: `# Amazon RDS Multi-AZ & Amazon DynamoDB NoSQL

Master RDS automated failover, read replicas, DynamoDB partition keys, sort keys, and Global Secondary Indexes (GSIs).

AWS provides specialized database engines tailored for relational and NoSQL workloads.

---

### 1. Amazon RDS Multi-AZ vs Read Replicas
- **Multi-AZ (High Availability / Disaster Recovery)**: Synchronous replication to a standby instance in a different AZ. If primary fails, DNS automatically points to standby in < 60s.
- **Read Replicas (Scalability)**: Asynchronous replication across up to 15 read instances to scale read-heavy applications.

### 2. Amazon DynamoDB (Serverless NoSQL)
- **Primary Key**: Partition Key (PK) alone, or Composite Key (Partition Key + Sort Key).
- **Single-Digit Millisecond Latency**: Hashes partition keys across distributed SSD storage partitions.
- **Global Secondary Indexes (GSIs)**: Query alternative attribute combinations with independent partition and sort keys.

## Why Amazon RDS Multi-AZ & Amazon DynamoDB NoSQL Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

## Practical Code Example

\`\`\`python
def build_dynamodb_item(pk, sk, data):
    return {
        'PK': {'S': pk},
        'SK': {'S': sk},
        'Data': {'S': data}
    }
\`\`\`

### Step-by-Step Code Breakdown

1. **Input Parameters & Setup**: Establishes inputs, validates boundaries, and sets default fallbacks.
2. **Logic Execution**: Executes the core operation cleanly without mutating shared state.
3. **Return Output**: Returns the calculated result directly to the caller.

> 💡 **Pro Tip**: Format marshaled DynamoDB type descriptors {'S': val}

> ⚠️ **Common Mistake**: Multi-AZ maintains an exact synchronous copy in a second AZ for automatic high-availability failover. Read Replicas offload read traffic asynchronously.

## Real-World Production Scenario

In production engineering, **Amazon RDS Multi-AZ & Amazon DynamoDB NoSQL** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Amazon RDS Multi-AZ & Amazon DynamoDB NoSQL. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('AWS Architecture Center')?._id,
  });

  const awsL6_Challenge = await ChallengeModel.create({
    title: `Structure DynamoDB PutItem Payload`,
    description: `Write a Python function \`build_dynamodb_item(pk, sk, data)\` that returns a dictionary with \`{'PK': {'S': pk}, 'SK': {'S': sk}, 'Data': {'S': data}}\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def build_dynamodb_item(pk, sk, data):
    # Return DynamoDB marshaled dict
    pass
`,
    solutionCode: `def build_dynamodb_item(pk, sk, data):
    return {
        'PK': {'S': pk},
        'SK': {'S': sk},
        'Data': {'S': data}
    }`,
    hints: ["Format marshaled DynamoDB type descriptors {'S': val}"],
    skills: [{"skillId": "aws-cloud", "weight": 1.0}],
    testCases: [{"input": "build_dynamodb_item('USER#1', 'PROFILE', 'Spix')", "expectedOutput": "True", "description": "Constructs DynamoDB marshaled item", "hidden": false}],
  });

  const awsL6_Practice = await ActivityModel.create({
    lessonId: awsL6._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Structure DynamoDB PutItem Payload`,
    order: 3,
    challengeRef: awsL6_Challenge._id,
    content: `# Code Practice: Structure DynamoDB PutItem Payload\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  awsL6_Challenge.activityId = awsL6_Practice._id;
  await awsL6_Challenge.save();

  const awsL6_Quiz = await AssessmentModel.create({
    title: `Assessment: AWS Databases`,
    description: `Test RDS Multi-AZ failover and DynamoDB partitioning.`,
    passingScore: 70,
    skills: [{"skillId": "aws-cloud", "weight": 1.0}],
    questions: [
    {
        "question": "What is the primary difference in purpose between an Amazon RDS Multi-AZ deployment and an RDS Read Replica?",
        "options": [
            "Multi-AZ is for caching; Read Replica is for backups",
            "Multi-AZ provides high availability and automatic disaster failover via synchronous replication; Read Replicas provide read scalability via asynchronous replication",
            "Read Replicas can only be used with PostgreSQL",
            "Multi-AZ does not cost extra"
        ],
        "explanation": "Multi-AZ maintains an exact synchronous copy in a second AZ for automatic high-availability failover. Read Replicas offload read traffic asynchronously.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const awsL6_Assessment = await ActivityModel.create({
    lessonId: awsL6._id,
    type: 'QUIZ',
    title: `Assessment: AWS Databases`,
    order: 4,
    assessmentRef: awsL6_Quiz._id,
  });
  awsL6_Quiz.activityId = awsL6_Assessment._id;
  await awsL6_Quiz.save();

  awsL6.activities = [
    awsL6_Video._id,
    awsL6_Notes._id,
    awsL6_Practice._id,
    awsL6_Assessment._id,
  ] as any;
  await awsL6.save();

  awsMod3.lessons = [awsL5._id, awsL6._id] as any;
  await awsMod3.save();

  const awsMod4 = await ModuleModel.create({
    courseId: awsCourse._id,
    title: `Module 4: Virtual Private Cloud (VPC) & Infrastructure as Code`,
    description: `Master VPC architecture, public/private subnets, Internet Gateways, NAT Gateways, Route Tables, and Infrastructure as Code with Terraform.`,
    order: 4,
    lessons: [],
  });

  // --- Lesson 1: VPC Architecture: Subnets, Route Tables & NAT Gateways ---
  const awsL7 = await LessonModel.create({
    moduleId: awsMod4._id,
    courseId: awsCourse._id,
    title: `VPC Architecture: Subnets, Route Tables & NAT Gateways`,
    description: `Design isolated Virtual Private Clouds (VPCs), configure Public Subnets (Internet Gateway) and Private Subnets (NAT Gateway).`,
    order: 1,
    activities: [],
  });

  const awsL7_Video = await ActivityModel.create({
    lessonId: awsL7._id,
    type: 'VIDEO',
    title: `Video: AWS VPC Masterclass - Networking, Subnets & Routing`,
    order: 1,
    resourceRef: getRes('AWS VPC Networking and Subnets Architecture')?._id,
    content: `# Key Takeaways:
- A VPC is a logically isolated virtual network dedicated to your AWS account.
- Public subnets have direct route to an Internet Gateway (IGW) for public web traffic.
- Private subnets route outbound internet traffic through a NAT Gateway to keep backends hidden.`,
  });

  const awsL7_Notes = await ActivityModel.create({
    lessonId: awsL7._id,
    type: 'NOTES',
    title: `Codexa Notes: VPC Architecture: Subnets, Route Tables & NAT Gateways`,
    order: 2,
    content: `# VPC Architecture: Subnets, Route Tables & NAT Gateways

Design isolated Virtual Private Clouds (VPCs), configure Public Subnets (Internet Gateway) and Private Subnets (NAT Gateway).

VPCs allow provisioning private, isolated cloud networks with full control over IP address ranges, subnets, and routing.

---

### VPC Architecture Topology
\`\`\`text
Internet ──► Internet Gateway (IGW)
                 ├──► Public Subnet (Route to IGW) ──► Application Load Balancer / NAT Gateway
                 └──► Private Subnet (Route to NAT) ──► EC2 Backend APIs / RDS Databases
\`\`\`

### Routing Rules
- **Public Subnet Route Table**: \`0.0.0.0/0 -> igw-xxxxxx\` (Direct bidirectional internet access).
- **Private Subnet Route Table**: \`0.0.0.0/0 -> nat-xxxxxx\` (Outbound only internet for patches/APIs; blocks inbound connections).

## Why VPC Architecture: Subnets, Route Tables & NAT Gateways Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check if destination is '0.0.0.0/0' and target starts with 'igw-'

> ⚠️ **Common Mistake**: Placing databases in private subnets ensures they have no public IPs and cannot receive unsolicited inbound internet connections, drastically reducing attack surfaces.

## Real-World Production Scenario

In production engineering, **VPC Architecture: Subnets, Route Tables & NAT Gateways** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of VPC Architecture: Subnets, Route Tables & NAT Gateways. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('AWS Architecture Center')?._id,
  });

  const awsL7_Challenge = await ChallengeModel.create({
    title: `Check Subnet Public/Private Routing`,
    description: `Write a Python function \`is_public_subnet_route(route_table)\` where \`route_table\` is a list of route dictionaries like \`[{'destination': '0.0.0.0/0', 'target': 'igw-123'}]\`. Return True if the \`0.0.0.0/0\` destination targets an Internet Gateway (\`igw-\`).`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def is_public_subnet_route(route_table):
    # Return boolean
    pass
`,
    solutionCode: `def is_public_subnet_route(route_table):
    for r in route_table:
        if r.get('destination') == '0.0.0.0/0' and str(r.get('target', '')).startswith('igw-'):
            return True
    return False`,
    hints: ["Check if destination is '0.0.0.0/0' and target starts with 'igw-'"],
    skills: [{"skillId": "cloud-infrastructure", "weight": 1.0}],
    testCases: [{"input": "is_public_subnet_route([{'destination': '0.0.0.0/0', 'target': 'igw-999'}])", "expectedOutput": "True", "description": "Identifies public route targeting IGW", "hidden": false}],
  });

  const awsL7_Practice = await ActivityModel.create({
    lessonId: awsL7._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Check Subnet Public/Private Routing`,
    order: 3,
    challengeRef: awsL7_Challenge._id,
    content: `# Code Practice: Check Subnet Public/Private Routing\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  awsL7_Challenge.activityId = awsL7_Practice._id;
  await awsL7_Challenge.save();

  const awsL7_Quiz = await AssessmentModel.create({
    title: `Assessment: VPC Networking`,
    description: `Test VPC CIDR blocks, NAT gateways, and routing tables.`,
    passingScore: 70,
    skills: [{"skillId": "cloud-infrastructure", "weight": 1.0}],
    questions: [
    {
        "question": "Why must production database instances (such as Amazon RDS) be placed inside Private Subnets rather than Public Subnets?",
        "options": [
            "Databases run slower on public subnets",
            "Private subnets have no direct public IP route from the internet, preventing external bad actors from directly probing or attacking the database port",
            "AWS does not allow RDS in public subnets",
            "Public subnets do not support SSL encryption"
        ],
        "explanation": "Placing databases in private subnets ensures they have no public IPs and cannot receive unsolicited inbound internet connections, drastically reducing attack surfaces.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const awsL7_Assessment = await ActivityModel.create({
    lessonId: awsL7._id,
    type: 'QUIZ',
    title: `Assessment: VPC Networking`,
    order: 4,
    assessmentRef: awsL7_Quiz._id,
  });
  awsL7_Quiz.activityId = awsL7_Assessment._id;
  await awsL7_Quiz.save();

  awsL7.activities = [
    awsL7_Video._id,
    awsL7_Notes._id,
    awsL7_Practice._id,
    awsL7_Assessment._id,
  ] as any;
  await awsL7.save();

  // --- Lesson 2: Infrastructure as Code (IaC) with Terraform & CloudFormation ---
  const awsL8 = await LessonModel.create({
    moduleId: awsMod4._id,
    courseId: awsCourse._id,
    title: `Infrastructure as Code (IaC) with Terraform & CloudFormation`,
    description: `Author declarative cloud infrastructure using Terraform (HCL), state management, plan/apply lifecycle, and drift detection.`,
    order: 2,
    activities: [],
  });

  const awsL8_Video = await ActivityModel.create({
    lessonId: awsL8._id,
    type: 'VIDEO',
    title: `Video: Terraform with AWS Tutorial - Complete Infrastructure as Code`,
    order: 1,
    resourceRef: getRes('AWS Architecture Center: Cloud Well-Architected Framework')?._id,
    content: `# Key Takeaways:
- Infrastructure as Code (IaC) defines cloud architecture as declarative version-controlled code.
- Terraform manages resource state in \`terraform.tfstate\` (store in S3 with DynamoDB state locking).
- \`terraform plan\` predicts changes; \`terraform apply\` provisions resources deterministically.`,
  });

  const awsL8_Notes = await ActivityModel.create({
    lessonId: awsL8._id,
    type: 'NOTES',
    title: `Codexa Notes: Infrastructure as Code (IaC) with Terraform & CloudFormation`,
    order: 2,
    content: `# Infrastructure as Code (IaC) with Terraform & CloudFormation

Author declarative cloud infrastructure using Terraform (HCL), state management, plan/apply lifecycle, and drift detection.

IaC eliminates manual console clicking, making cloud provisioning repeatable, auditable, and automated.

---

### Terraform Configuration Example (\`main.tf\`)
\`\`\`hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "assets" {
  bucket = "codexa-production-assets-2024"
  tags = {
    Environment = "Production"
    ManagedBy   = "Terraform"
  }
}
\`\`\`

### Terraform Workflow Loop
\`\`\`bash
terraform init       # Download provider plugins
terraform plan       # Dry-run execution preview
terraform apply      # Provision actual AWS resources
terraform destroy    # Teardown cloud environment
\`\`\`

## Why Infrastructure as Code (IaC) with Terraform & CloudFormation Matters

- **Encapsulation & Modularity**: Organizes complex operations into isolated, maintainable components.
- **Deterministic Data Flow**: Ensures predictable inputs and outputs, eliminating hidden runtime bugs.
- **Production Reliability**: Adheres to modern industry design patterns for scalable software architectures.

> 💡 **Pro Tip**: Check 'resource "aws_s3_bucket"' in tf_code and 'bucket =' in tf_code

> ⚠️ **Common Mistake**: Remote state with locking ensures all team members and CI pipelines operate on a single synchronized source of truth, preventing race conditions and state corruption.

## Real-World Production Scenario

In production engineering, **Infrastructure as Code (IaC) with Terraform & CloudFormation** is used across core application layers, API gateways, database transactions, and reactive UI state machines to ensure high-reliability performance.

> [!IMPORTANT]
> **Key Takeaway**: Master the fundamental syntax and mental model of Infrastructure as Code (IaC) with Terraform & CloudFormation. In the next step (Code Practice), you will implement and test this logic directly in the interactive sandbox.`,
    resourceRef: getRes('AWS Architecture Center')?._id,
  });

  const awsL8_Challenge = await ChallengeModel.create({
    title: `Validate Terraform S3 Resource Block`,
    description: `Write a Python function \`validate_terraform_s3_block(tf_code)\` that returns True if the string contains \`resource "aws_s3_bucket"\` and \`bucket =\`.`,
    difficulty: 'EASY',
    language: 'python',
    starterCode: `def validate_terraform_s3_block(tf_code):
    # Return boolean
    pass
`,
    solutionCode: `def validate_terraform_s3_block(tf_code):
    return 'resource "aws_s3_bucket"' in tf_code and 'bucket =' in tf_code`,
    hints: ["Check 'resource \"aws_s3_bucket\"' in tf_code and 'bucket =' in tf_code"],
    skills: [{"skillId": "cloud-infrastructure", "weight": 1.0}],
    testCases: [{"input": "validate_terraform_s3_block('resource \"aws_s3_bucket\" \"b\" {\\n  bucket = \"my-bucket\"\\n}')", "expectedOutput": "True", "description": "Validates Terraform S3 resource definition", "hidden": false}],
  });

  const awsL8_Practice = await ActivityModel.create({
    lessonId: awsL8._id,
    type: 'CODING_CHALLENGE',
    title: `Code Practice: Validate Terraform S3 Resource Block`,
    order: 3,
    challengeRef: awsL8_Challenge._id,
    content: `# Code Practice: Validate Terraform S3 Resource Block\n\nImplement and verify the solution in the interactive sandbox.`,
  });
  awsL8_Challenge.activityId = awsL8_Practice._id;
  await awsL8_Challenge.save();

  const awsL8_Quiz = await AssessmentModel.create({
    title: `Assessment: Terraform & IaC`,
    description: `Test Terraform lifecycle operations and state management.`,
    passingScore: 70,
    skills: [{"skillId": "cloud-infrastructure", "weight": 1.0}],
    questions: [
    {
        "question": "Why is it best practice to store the `terraform.tfstate` state file in a remote backend (such as S3 with DynamoDB locking) rather than on local developer laptops?",
        "options": [
            "Terraform state files cannot be saved locally",
            "Remote state enables team collaboration, protects sensitive state data, and prevents concurrent execution race conditions via distributed state locking",
            "To convert HCL into Python automatically",
            "AWS requires S3 for all Terraform runs"
        ],
        "explanation": "Remote state with locking ensures all team members and CI pipelines operate on a single synchronized source of truth, preventing race conditions and state corruption.",
        "correctOption": 1,
        "type": "MULTIPLE_CHOICE",
        "points": 10
    }
],
  });

  const awsL8_Assessment = await ActivityModel.create({
    lessonId: awsL8._id,
    type: 'QUIZ',
    title: `Assessment: Terraform & IaC`,
    order: 4,
    assessmentRef: awsL8_Quiz._id,
  });
  awsL8_Quiz.activityId = awsL8_Assessment._id;
  await awsL8_Quiz.save();

  awsL8.activities = [
    awsL8_Video._id,
    awsL8_Notes._id,
    awsL8_Practice._id,
    awsL8_Assessment._id,
  ] as any;
  await awsL8.save();

  awsMod4.lessons = [awsL7._id, awsL8._id] as any;
  await awsMod4.save();

  awsCourse.modules = [awsMod1._id, awsMod2._id, awsMod3._id, awsMod4._id] as any;
  await awsCourse.save();

  return [linuxCourse, gitCourse, dockerCourse, k8sCourse, awsCourse];
}

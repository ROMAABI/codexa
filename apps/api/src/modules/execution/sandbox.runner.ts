import { exec, spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { ProgrammingLanguage, TestResultItem } from '@codexa/shared';

export interface SandboxExecutionOptions {
  code: string;
  language: ProgrammingLanguage;
  testCases: Array<{
    id: string;
    input: string;
    expectedOutput: string;
    description: string;
  }>;
  timeoutMs?: number;
  memoryLimitMb?: number;
}

export interface SandboxExecutionResult {
  status: 'PASSED' | 'FAILED' | 'TIMEOUT' | 'ERROR';
  results: TestResultItem[];
  passedCount: number;
  totalCount: number;
  executionTimeMs: number;
  stdout: string;
  stderr: string;
  error?: string;
}

export class SandboxUnavailableError extends Error {
  constructor(msg = 'Sandbox environment is unavailable. Unsandboxed execution is prohibited.') {
    super(msg);
    this.name = 'SandboxUnavailableError';
  }
}

const MAX_OUTPUT_BYTES = 64 * 1024; // 64 KB limit
const STREAM_KILL_THRESHOLD_BYTES = 1024 * 1024; // 1 MB kill threshold

export class SandboxRunner {
  private static async checkCommand(cmd: string): Promise<boolean> {
    return new Promise((resolve) => {
      exec(`which ${cmd}`, (err) => resolve(!err));
    });
  }

  static async execute(options: SandboxExecutionOptions): Promise<SandboxExecutionResult> {
    const { code, language, testCases, timeoutMs = 5000, memoryLimitMb = 128 } = options;

    // Security Rule 1: Student code must NEVER execute unsandboxed
    const hasBwrap = await this.checkCommand('bwrap');
    if (!hasBwrap) {
      return {
        status: 'ERROR',
        results: testCases.map((tc) => ({
          testCaseId: tc.id,
          description: tc.description,
          passed: false,
          errorMessage: 'Infrastructure Error: Sandbox isolation runtime is unavailable.',
          durationMs: 0,
        })),
        passedCount: 0,
        totalCount: testCases.length,
        executionTimeMs: 0,
        stdout: '',
        stderr: 'Sandbox environment is unavailable. Unsandboxed code execution is strictly prohibited.',
        error: 'Sandbox Unavailable',
      };
    }

    // Create temporary isolated directory for the execution
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codexa-sandbox-'));

    try {
      if (language === 'javascript' || language === 'typescript') {
        return await this.runJavaScriptSandbox(tmpDir, code, testCases, timeoutMs, memoryLimitMb);
      } else if (language === 'python') {
        return await this.runPythonSandbox(tmpDir, code, testCases, timeoutMs, memoryLimitMb);
      } else {
        return {
          status: 'ERROR',
          results: [],
          passedCount: 0,
          totalCount: testCases.length,
          executionTimeMs: 0,
          stdout: '',
          stderr: `Unsupported sandbox language: ${language}`,
          error: `Unsupported language: ${language}`,
        };
      }
    } finally {
      // Clean up sandbox files safely
      await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
    }
  }

  private static async runJavaScriptSandbox(
    tmpDir: string,
    studentCode: string,
    testCases: Array<{ id: string; input: string; expectedOutput: string; description: string }>,
    timeoutMs: number,
    memoryLimitMb: number
  ): Promise<SandboxExecutionResult> {
    const studentFilePath = path.join(tmpDir, 'student.js');
    const runnerFilePath = path.join(tmpDir, 'runner.js');

    await fs.writeFile(studentFilePath, studentCode, 'utf8');

    // Generate hardened test harness runner
    const runnerCode = `
const fs = require('fs');
let studentModule;
let loadError = null;

try {
  studentModule = require('./student.js');
} catch (e) {
  loadError = e.message || String(e);
}

const testCases = ${JSON.stringify(testCases)};
const results = [];
let passedCount = 0;

(async () => {
  if (loadError) {
    testCases.forEach(tc => {
      results.push({
        testCaseId: tc.id,
        description: tc.description,
        passed: false,
        expectedOutput: tc.expectedOutput,
        actualOutput: null,
        errorMessage: 'Compilation / Import Error: ' + loadError,
        durationMs: 0
      });
    });
  } else {
    let targetFn = typeof studentModule === 'function' ? studentModule : null;
    if (!targetFn && typeof studentModule === 'object' && studentModule !== null) {
      const keys = Object.keys(studentModule);
      if (keys.length > 0 && typeof studentModule[keys[0]] === 'function') {
        targetFn = studentModule[keys[0]];
      }
    }

    for (const tc of testCases) {
      const tStart = Date.now();
      try {
        let parsedInput;
        try {
          parsedInput = JSON.parse(tc.input);
        } catch {
          parsedInput = tc.input;
        }

        let actual;
        if (typeof targetFn === 'function') {
          if (Array.isArray(parsedInput)) {
            actual = targetFn(...parsedInput);
          } else {
            actual = targetFn(parsedInput);
          }

          if (actual && typeof actual.then === 'function') {
            actual = await actual;
          }
        } else {
          throw new Error('No callable function exported in student code');
        }

        const durationMs = Date.now() - tStart;
        const actualStr = typeof actual === 'object' && actual !== null ? JSON.stringify(actual) : String(actual);
        const expectedNormalized = tc.expectedOutput.trim();
        const actualNormalized = actualStr.trim();

        const passed = actualNormalized === expectedNormalized;
        if (passed) passedCount++;

        results.push({
          testCaseId: tc.id,
          description: tc.description,
          passed,
          actualOutput: actualStr,
          expectedOutput: tc.expectedOutput,
          durationMs
        });
      } catch (err) {
        results.push({
          testCaseId: tc.id,
          description: tc.description,
          passed: false,
          expectedOutput: tc.expectedOutput,
          actualOutput: null,
          errorMessage: err.message || String(err),
          durationMs: Date.now() - tStart
        });
      }
    }
  }

  const payload = JSON.stringify({ results, passedCount, totalCount: testCases.length });
  try {
    fs.writeFileSync('./results.json', payload, 'utf8');
  } catch (err) {}

  console.log('__CODEXA_RESULTS_START__');
  console.log(payload);
  console.log('__CODEXA_RESULTS_END__');
})();
`;

    await fs.writeFile(runnerFilePath, runnerCode, 'utf8');

    // Bubblewrap configuration: full namespace, process, network, and filesystem isolation
    const cmd = 'bwrap';
    const args = [
      '--unshare-all',
      '--unshare-net',
      '--ro-bind', '/usr', '/usr',
      '--symlink', 'usr/lib', '/lib',
      '--symlink', 'usr/lib', '/lib64',
      '--symlink', 'usr/bin', '/bin',
      '--proc', '/proc',
      '--dev', '/dev',
      '--bind', tmpDir, tmpDir,
      '--chdir', tmpDir,
      'node',
      `--max-old-space-size=${memoryLimitMb}`,
      'runner.js'
    ];

    return this.runIsolatedProcess(cmd, args, tmpDir, testCases, timeoutMs);
  }

  private static async runPythonSandbox(
    tmpDir: string,
    studentCode: string,
    testCases: Array<{ id: string; input: string; expectedOutput: string; description: string }>,
    timeoutMs: number,
    memoryLimitMb: number
  ): Promise<SandboxExecutionResult> {
    const studentFilePath = path.join(tmpDir, 'student.py');
    const runnerFilePath = path.join(tmpDir, 'runner.py');

    await fs.writeFile(studentFilePath, studentCode, 'utf8');

    const runnerCode = `
import json
import time
import sys
import resource

mem_bytes = ${memoryLimitMb} * 1024 * 1024
try:
    resource.setrlimit(resource.RLIMIT_AS, (mem_bytes, mem_bytes))
    resource.setrlimit(resource.RLIMIT_DATA, (mem_bytes, mem_bytes))
except Exception:
    pass

try:
    import student
except Exception as e:
    load_err = str(e)
    student = None
else:
    load_err = None

test_cases = json.loads('''${JSON.stringify(testCases)}''')
results = []
passed_count = 0

if load_err:
    for tc in test_cases:
        results.append({
            "testCaseId": tc["id"],
            "description": tc["description"],
            "passed": False,
            "expectedOutput": tc["expectedOutput"],
            "actualOutput": None,
            "errorMessage": "Import Error: " + load_err,
            "durationMs": 0
        })
else:
    target_fn = None
    for attr in dir(student):
        if not attr.startswith('__') and callable(getattr(student, attr)):
            target_fn = getattr(student, attr)
            break

    for tc in test_cases:
        t_start = time.time()
        try:
            try:
                inp = json.loads(tc["input"])
            except:
                inp = tc["input"]

            if isinstance(inp, list):
                actual = target_fn(*inp)
            else:
                actual = target_fn(inp)

            dur = int((time.time() - t_start) * 1000)
            actual_str = json.dumps(actual) if isinstance(actual, (dict, list)) else str(actual)
            passed = actual_str.strip() == tc["expectedOutput"].strip()
            if passed:
                passed_count += 1

            results.append({
                "testCaseId": tc["id"],
                "description": tc["description"],
                "passed": passed,
                "actualOutput": actual_str,
                "expectedOutput": tc["expectedOutput"],
                "durationMs": dur
            })
        except Exception as ex:
            results.append({
                "testCaseId": tc["id"],
                "description": tc["description"],
                "passed": False,
                "expectedOutput": tc["expectedOutput"],
                "actualOutput": None,
                "errorMessage": str(ex),
                "durationMs": int((time.time() - t_start) * 1000)
            })

payload = {"results": results, "passedCount": passed_count, "totalCount": len(test_cases)}
try:
    with open('results.json', 'w') as f:
        json.dump(payload, f)
except Exception:
    pass

print('__CODEXA_RESULTS_START__')
print(json.dumps(payload))
print('__CODEXA_RESULTS_END__')
`;
    await fs.writeFile(runnerFilePath, runnerCode, 'utf8');

    const cmd = 'bwrap';
    const args = [
      '--unshare-all',
      '--unshare-net',
      '--ro-bind', '/usr', '/usr',
      '--symlink', 'usr/lib', '/lib',
      '--symlink', 'usr/lib', '/lib64',
      '--symlink', 'usr/bin', '/bin',
      '--proc', '/proc',
      '--dev', '/dev',
      '--bind', tmpDir, tmpDir,
      '--chdir', tmpDir,
      'python3',
      'runner.py'
    ];

    return this.runIsolatedProcess(cmd, args, tmpDir, testCases, timeoutMs);
  }

  private static runIsolatedProcess(
    cmd: string,
    args: string[],
    tmpDir: string,
    testCases: Array<{ id: string; input: string; expectedOutput: string; description: string }>,
    timeoutMs: number
  ): Promise<SandboxExecutionResult> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let stdout = '';
      let stderr = '';
      let totalRawBytes = 0;
      let timedOut = false;
      let resolved = false;

      // Launch in an isolated, detached process group with strictly sanitized environment
      const child = spawn(cmd, args, {
        cwd: tmpDir,
        env: { PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin', NODE_ENV: 'sandbox' },
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: process.platform !== 'win32',
      });

      const killProcessGroup = () => {
        try {
          if (child.pid && process.platform !== 'win32') {
            process.kill(-child.pid, 'SIGKILL');
          } else if (child.pid) {
            child.kill('SIGKILL');
          }
        } catch {}
      };

      const timer = setTimeout(() => {
        timedOut = true;
        killProcessGroup();

        if (!resolved) {
          resolved = true;
          resolve({
            status: 'TIMEOUT',
            results: testCases.map((tc) => ({
              testCaseId: tc.id,
              description: tc.description,
              passed: false,
              errorMessage: `Execution timed out after ${timeoutMs}ms limit`,
              durationMs: timeoutMs,
            })),
            passedCount: 0,
            totalCount: testCases.length,
            executionTimeMs: timeoutMs,
            stdout,
            stderr: stderr + `\nExecution killed: exceeded ${timeoutMs}ms CPU limit.`,
            error: 'Time Limit Exceeded',
          });
        }
      }, timeoutMs);

      child.stdout?.on('data', (chunk) => {
        const str = chunk.toString();
        totalRawBytes += chunk.length;

        // Prevent memory exhaustion / pipe flooding attack
        if (totalRawBytes > STREAM_KILL_THRESHOLD_BYTES) {
          killProcessGroup();
        }

        if (stdout.length < MAX_OUTPUT_BYTES) {
          stdout += str;
          if (stdout.length >= MAX_OUTPUT_BYTES) {
            stdout = stdout.substring(0, MAX_OUTPUT_BYTES) + '\n[Output truncated: maximum 64KB limit reached]';
          }
        }
      });

      child.stderr?.on('data', (chunk) => {
        const str = chunk.toString();
        totalRawBytes += chunk.length;

        if (totalRawBytes > STREAM_KILL_THRESHOLD_BYTES) {
          killProcessGroup();
        }

        if (stderr.length < MAX_OUTPUT_BYTES) {
          stderr += str;
          if (stderr.length >= MAX_OUTPUT_BYTES) {
            stderr = stderr.substring(0, MAX_OUTPUT_BYTES) + '\n[Stderr truncated: maximum 64KB limit reached]';
          }
        }
      });

      child.on('close', async (code) => {
        clearTimeout(timer);
        if (resolved) return;
        resolved = true;
        const duration = Date.now() - startTime;

        if (timedOut) {
          return resolve({
            status: 'TIMEOUT',
            results: testCases.map((tc) => ({
              testCaseId: tc.id,
              description: tc.description,
              passed: false,
              errorMessage: `Execution timed out after ${timeoutMs}ms limit`,
              durationMs: timeoutMs,
            })),
            passedCount: 0,
            totalCount: testCases.length,
            executionTimeMs: timeoutMs,
            stdout,
            stderr: stderr + `\nExecution killed: exceeded ${timeoutMs}ms CPU limit.`,
            error: 'Time Limit Exceeded',
          });
        }

        // Try reading results.json first (immune to stdout spam/truncation)
        const resultsFilePath = path.join(tmpDir, 'results.json');
        let parsedResults: any = null;
        try {
          const fileContent = await fs.readFile(resultsFilePath, 'utf8');
          parsedResults = JSON.parse(fileContent);
        } catch (e) {
          // Fall back to parsing stdout markers
          const startMarker = '__CODEXA_RESULTS_START__';
          const endMarker = '__CODEXA_RESULTS_END__';
          const startIdx = stdout.indexOf(startMarker);
          const endIdx = stdout.indexOf(endMarker);
          if (startIdx !== -1 && endIdx !== -1) {
            try {
              const jsonStr = stdout.substring(startIdx + startMarker.length, endIdx).trim();
              parsedResults = JSON.parse(jsonStr);
            } catch {}
          }
        }

        if (parsedResults) {
          const passed = parsedResults.passedCount === parsedResults.totalCount;
          const cleanStdout = stdout
            .replace('__CODEXA_RESULTS_START__', '')
            .replace('__CODEXA_RESULTS_END__', '')
            .trim();

          return resolve({
            status: passed ? 'PASSED' : 'FAILED',
            results: parsedResults.results,
            passedCount: parsedResults.passedCount,
            totalCount: parsedResults.totalCount,
            executionTimeMs: duration,
            stdout: cleanStdout,
            stderr,
          });
        }

        return resolve({
          status: 'ERROR',
          results: [],
          passedCount: 0,
          totalCount: testCases.length,
          executionTimeMs: duration,
          stdout,
          stderr,
          error: stderr || `Process exited with code ${code}`,
        });
      });
    });
  }
}

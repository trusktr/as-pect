/// <reference types="yargs-parser" />
declare module "util/ILogTarget" {
    import { LogValue } from "util/LogValue";
    export interface ILogTarget {
        logs: LogValue[];
    }
}
declare module "util/LogValue" {
    import { ILogTarget } from "util/ILogTarget";
    /**
     * A virtual representation of a discrete value logged to from AssemblyScript.
     */
    export class LogValue {
        /**
         * If a pointer is referenced, this is the precise memory location of the referenced block of
         * data.
         */
        pointer: number;
        /**
         * If a pointer is referenced and isn't a string, this is the size of the referenced block of
         * data.
         */
        offset: number;
        /**
         * If a pointer is referenced and ins't a string, this is an array of bytes to be logged byt the
         * logger.
         */
        bytes: number[];
        /**
         * This is a message generated by the TestSuite to be displayed in the logger.
         */
        message: string;
        /**
         * This is the relevant stack trace, filtered with the `/wasm/i` regex.
         */
        stack: string;
        /**
         * This is the referenced log target.
         */
        target: ILogTarget | null;
        /**
         * This is the raw logged value.
         */
        value: number | null;
    }
}
declare module "util/ActualValue" {
    import { LogValue } from "util/LogValue";
    /**
     * A class representing a reported expected or actual value. It shares a lot of properties with
     * LogValue, so those are copied over.
     */
    export class ActualValue extends LogValue {
        /**
         * An indicator if the actual expected value is negated.
         */
        negated: boolean;
    }
}
declare module "test/TestResult" {
    import { LogValue } from "util/LogValue";
    import { ActualValue } from "util/ActualValue";
    import { ILogTarget } from "util/ILogTarget";
    /**
     * This is the data class that contains all the data about each `test()` or `it()` function defined
     * in the `AssemblyScript` module.
     */
    export class TestResult implements ILogTarget {
        /** The actual test's name or description. */
        name: string;
        /** The indicator to see if the test passed. */
        pass: boolean;
        /** The time in milliseconds indicating how long the test ran for each run. */
        times: number[];
        /** The reported actual value description. */
        actual: ActualValue | null;
        /** The reported expected value description. */
        expected: ActualValue | null;
        /** If the test failed, this is the message describing why the test failed. */
        message: string;
        /** A set of strings logged by the test itself. */
        logs: LogValue[];
        /** The generated stack trace if the test errored. */
        stack: string | null;
        /** This value is set to true if the test is expected to throw. */
        negated: boolean;
        /** This value indicates if performance statistics were collected for this test. */
        performance: boolean;
        /** The number of decimal places used for rounding. */
        decimalPlaces: number;
        /** This value indicates if an average was calculated. */
        hasAverage: boolean;
        /** This is the average (mean) value. */
        average: number;
        /** This value indicates if a max was calculated. */
        hasMax: boolean;
        /** This is the max time. */
        max: number;
        /** This value indicates if a median value was calculated. */
        hasMedian: boolean;
        /** This is the calculated median time. */
        median: number;
        /** This value indicates if a min value was calculated. */
        hasMin: boolean;
        /** This is the calculated min time. */
        min: number;
        /** This value indicates if a standard deviation value was calculated. */
        hasStdDev: boolean;
        /** This is the calculated standard deviation of the times collected. */
        stdDev: number;
        /** A boolean indicating if the variance was calcluated. */
        hasVariance: boolean;
        /** The raw variance calculation before rounding was applied. */
        rawVariance: number;
        /** This value indicates the calculated variance used for standard deviation calculations. */
        variance: number;
        /** This is the timestamp for when the test started in milliseconds. */
        start: number;
        /** This is the timestamp for when the test ended in milliseconds. */
        end: number;
        /** This is the run time for the test in milliseconds. */
        runTime: number;
        /**
         * Caclculate the average value of the collected times.
         */
        calculateAverage(): void;
        /**
         * Calculate the max time of the collected times.
         */
        calculateMax(): void;
        /**
         * Calculate the median value of the collected times.
         */
        calculateMedian(): void;
        /**
         * Calculate the min value of the collected times.
         */
        calculateMin(): void;
        /**
         * Calculate the standard deviation of the collected times.
         */
        calculateStandardDeviation(): void;
        /**
         * Calculate the variance.
         */
        calculateVariance(): void;
    }
}
declare module "test/TestGroup" {
    import { LogValue } from "util/LogValue";
    import { ILogTarget } from "util/ILogTarget";
    import { TestResult } from "test/TestResult";
    /**
     * This test group class is designed with a data oriented layout in mind. Each test property is
     * represented by an array.
     */
    export class TestGroup implements ILogTarget {
        describePointers: number[];
        beforeEachPointers: number[];
        afterEachPointers: number[];
        beforeAllPointers: number[];
        afterAllPointers: number[];
        testFunctionPointers: number[];
        testNamePointers: number[];
        testMessagePointers: number[];
        testThrows: boolean[];
        tests: TestResult[];
        todoPointers: number[];
        todos: string[];
        logs: LogValue[];
        name: string;
        pass: boolean;
        reason: string;
        time: number;
        performanceEnabled: Array<boolean | undefined>;
        maxSamples: Array<number | undefined>;
        roundDecimalPlaces: Array<number | undefined>;
        maxTestRuntime: Array<number | undefined>;
        reportAverage: Array<boolean | undefined>;
        reportMedian: Array<boolean | undefined>;
        reportStandardDeviation: Array<boolean | undefined>;
        reportMax: Array<boolean | undefined>;
        reportMin: Array<boolean | undefined>;
        reportVariance: Array<boolean | undefined>;
        fork(): TestGroup;
    }
}
declare module "test/TestReporter" {
    import { TestContext } from "test/TestContext";
    import { TestGroup } from "test/TestGroup";
    import { TestResult } from "test/TestResult";
    export abstract class TestReporter {
        /**
         * A function that is called when a test suite starts.
         *
         * @param {TestSuite} suite - The started test suite.
         */
        abstract onStart(suite: TestContext): void;
        /**
         * A function that is called when a test group starts.
         *
         * @param {TestGroup} group - The started test group.
         */
        abstract onGroupStart(group: TestGroup): void;
        /**
         * A function that is called when a test group ends.
         *
         * @param {TestGroup} group - The ended test group.
         */
        abstract onGroupFinish(group: TestGroup): void;
        /**
         * A function that is called when a test starts.
         *
         * @param {TestGroup} group - The current test group.
         * @param {TestResult} result - The generated test result reference that will be used for the test.
         */
        abstract onTestStart(group: TestGroup, result: TestResult): void;
        /**
         * A function that is called when a test ends.
         *
         * @param {TestGroup} group - The current test group.
         * @param {TestResult} result - The generated test result reference.
         */
        abstract onTestFinish(group: TestGroup, result: TestResult): void;
        /**
         * A function that is called when a test suite ends.
         *
         * @param {TestSuite} suite - The ended test suite.
         */
        abstract onFinish(suite: TestContext): void;
        /**
         * A function that is called when a test group reports a "todo" item.
         *
         * @param {TestGroup} group - The current test group.
         * @param {string} todo - The todo description.
         */
        abstract onTodo(group: TestGroup, todo: string): void;
    }
}
declare module "reporter/DefaultTestReporter" {
    import { TestGroup } from "test/TestGroup";
    import { TestResult } from "test/TestResult";
    import { TestContext } from "test/TestContext";
    import { LogValue } from "util/LogValue";
    import { TestReporter } from "test/TestReporter";
    export class DefaultTestReporter extends TestReporter {
        onStart(_suite: TestContext): void;
        onGroupStart(group: TestGroup): void;
        onGroupFinish(group: TestGroup): void;
        onTestStart(_group: TestGroup, _test: TestResult): void;
        onTestFinish(_group: TestGroup, test: TestResult): void;
        onFinish(suite: TestContext): void;
        onTodo(_group: TestGroup, todo: string): void;
        /**
         * A custom logger function for the default reporter that writes the log values using `console.log()`
         *
         * @param {LogValue} logValue - A value to be logged to the console
         */
        onLog(logValue: LogValue): void;
    }
}
declare module "util/timeDifference" {
    export const timeDifference: (end: number, start: number) => number;
}
declare module "test/RunContext" {
    import { ASUtil } from "assemblyscript/lib/loader";
    import { TestReporter } from "test/TestReporter";
    /**
     * This class is a test runner helper class that contains a set of useful properties
     * to help reduce run function size.
     */
    export class RunContext {
        wasm: ASUtil;
        reporter: TestReporter;
        start: number;
        end: number;
        groupstart: number;
        groupend: number;
        teststart: number;
        testend: number;
        passed: boolean;
        endGroup: boolean;
        constructor(wasm: ASUtil, reporter: TestReporter);
    }
}
declare module "util/IPerformanceConfiguration" {
    /**
     * This is the interface for performance configuration provided to the TestContext object, before
     * tests are run.
     */
    export interface IPerformanceConfiguration {
        /** Enable performance statistics gathering. */
        enabled?: boolean;
        /** Set the minimum number of samples to run for each test in milliseconds. */
        maxSamples?: number;
        /** Set the maximum test run time in milliseconds. */
        maxTestRunTime?: number;
        /** Report the median time in the default reporter. */
        reportMedian?: boolean;
        /** Report the average time in milliseconds. */
        reportAverage?: boolean;
        /** Report the standard deviation. */
        reportStandardDeviation?: boolean;
        /** Report the maximum run time in milliseconds. */
        reportMax?: boolean;
        /** Report the minimum run time in milliseconds. */
        reportMin?: boolean;
        /** Report the variance. */
        reportVariance?: boolean;
        /** Set the number of decimal places to round to. */
        roundDecimalPlaces?: number;
    }
    export function createDefaultPerformanceConfiguration(): IPerformanceConfiguration;
}
declare module "test/IWarning" {
    export interface IWarning {
        type: string;
        message: string;
        stackTrace: string;
    }
}
declare module "test/TestContext" {
    import { ASUtil } from "assemblyscript/lib/loader";
    import { TestGroup } from "test/TestGroup";
    import { TestReporter } from "test/TestReporter";
    import { IPerformanceConfiguration } from "util/IPerformanceConfiguration";
    import { IWarning } from "test/IWarning";
    export class TestContext {
        reporter: TestReporter;
        file: string;
        performanceConfiguration: IPerformanceConfiguration;
        private groupStack;
        testGroups: TestGroup[];
        private logTarget;
        private wasm;
        private stack;
        private message;
        private actual;
        private expected;
        time: number;
        pass: boolean;
        private performanceEnabledValue;
        private maxSamplesValue;
        private maxTestRunTimeValue;
        private roundDecimalPlacesValue;
        private recordAverageValue;
        private recordMedianValue;
        private recordStdDevValue;
        private recordMaxValue;
        private recordMinValue;
        private recordVariance;
        /**
         * This value is used to detect if an `expect()` function call was used outside of a test
         * function. If a reportExpected or reportActual function is called before the `context.run()`
         * method is called, it should prevent the `run()` method from running the tests and report a
         * failure.
         */
        private ready;
        errors: IWarning[];
        constructor(reporter?: TestReporter, file?: string, performanceConfiguration?: IPerformanceConfiguration);
        /**
         * Run the tests on the wasm module.
         */
        run(wasm: ASUtil): void;
        private runGroup;
        /**
         * Run a given test.
         *
         * @param {RunContext} runContext - The current run context.
         * @param {TestGroup} group - The current run group.
         * @param {number} testIndex - The current test index.
         */
        private runTest;
        /**
         * Run the current test once and collect statistics.
         *
         * @param {RunContext} runContext - The current run context.
         * @param {TestGroup} group - The current test group.
         * @param {TestResult} result - The current test result.
         * @param {number} testIndex - The current test index.
         */
        private runTestCall;
        /**
         * Run the afterEach callbacks before running the test.
         *
         * @param {RunContext} runContext - The current run context.
         * @param {TestGroup} group - The current test group.
         * @param {TestResult} result - The current test result.
         */
        private runAfterEach;
        /**
         * Run the beforeEach callbacks before running the test.
         *
         * @param {RunContext} runContext - The current run context.
         * @param {TestGroup} group - The current test group.
         * @param {TestResult} result - The current test result.
         */
        private runBeforeEach;
        /**
         * Run the afterAll callbacks with the given runContext and group.
         *
         * @param {RunContext} runContext - The current run context.
         * @param {TestGroup} group - The current test group.
         */
        private runAfterAll;
        /**
         * Run the beforeAll callbacks with the given runContext and group.
         *
         * @param {RunContext} runContext - The current run context.
         * @param {TestGroup} group - The current test group.
         */
        private runBeforeAll;
        /**
         * This method creates a WebAssembly imports object with all the TestContext functions
         * bound to the TestContext.
         *
         * @param {any[]} imports - Every import item specified.
         */
        createImports(...imports: any[]): any;
        /**
         * This web assembly linked function creates a test group. It's called when the test suite calls
         * the describe("test", callback) function from within AssemblyScript. It receives a pointer to
         * the description of the tests, forks the top level test group, pushes the suiteName to a list,
         * then pushes the forked group to the top of the test context stack.
         *
         * @param {number} suiteNamePointer
         */
        private reportDescribe;
        /**
         * This web assembly linked function finishes a test group. It's called when the test suite calls
         * the describe("test", callback) function from within AssemblyScript. It pops the current
         * test group from the test context stack and pushes it to the final test group list.
         */
        private reportEndDescribe;
        /**
         * This web assembly linked function sets the group's "beforeEach" callback pointer to
         * the current groupStackItem.
         *
         * @param {number} callbackPointer - The callback that should run before each test.
         */
        private reportBeforeEach;
        /**
         * This web assembly linked function adds the group's "beforeAll" callback pointer to
         * the current groupStackItem.
         *
         * @param {number} callbackPointer - The callback that should run before each test in the
         * current context.
         */
        private reportBeforeAll;
        /**
         * This web assembly linked function sets the group's "afterEach" callback pointer.
         *
         * @param {number} callbackPointer - The callback that should run before each test group.
         */
        private reportAfterEach;
        /**
         * This web assembly linked function adds the group's "afterAll" callback pointer to
         * the current groupStackItem.
         *
         * @param {number} callbackPointer - The callback that should run before each test in the
         * current context.
         */
        private reportAfterAll;
        /**
         * This is a web assembly utility function that wraps a function call in a try catch block to
         * report success or failure.
         *
         * @param {number} pointer - The function pointer to call. It must accept no parameters and return
         * void.
         * @returns {1 | 0} - If the callback was run successfully without error, it returns 1, else it
         * returns 0.
         */
        private tryCall;
        /**
         * This adds a logged string to the current test.
         *
         * @param {number} pointer - The pointer to the logged string reference.
         */
        private logString;
        /**
         * Log a reference to the reporter.
         *
         * @param {number} referencePointer - The pointer to the reference.
         * @param {number} offset - The offset of the reference.
         */
        private logReference;
        /**
         * Log a numevalueric value to the reporter.
         *
         * @param {number} value - The value to be logged.
         */
        private logValue;
        /**
         * Log a null value to the reporter.
         */
        private logNull;
        /**
         * Gets a log stack trace.
         */
        private getLogStackTrace;
        /**
         * Gets an error stack trace.
         */
        private getErrorStackTrace;
        /**
         * This is called to stop the debugger.  e.g. `node --inspect-brk asp`.
         */
        private debug;
        /**
         * This web assembly linked function creates a test from the callback and the testNamePointer in
         * the current group. It assumes that the group has already been created with the describe
         * function. It is called when `it("description", callback)` or `test("description", callback)`
         * is called.
         *
         * @param {number} testNamePointer - The test's name pointer.
         * @param {number} callback - The test's function.
         */
        private reportTest;
        /**
         * This web assembly linked function is responsible for reporting tests that are expected
         * to fail. This is useful for verifying that specific application states will throw.
         *
         * @param {number} testNamePointer - The test's name pointer.
         * @param {number} callback - The test's function.
         * @param {number} message - The message associated with this test if it does not throw.
         */
        private reportNegatedTest;
        /**
         * This function reports a single "todo" item in a test suite.
         *
         * @param {number} todoPointer - The todo description string pointer.
         */
        private reportTodo;
        /**
          * This function is called after each expectation if the expectation passes. This prevents other
          * unreachable() conditions that throw errors to report actual and expected values too.
          */
        private clearExpected;
        /**
         * This function reports an actual null value.
         */
        private reportActualNull;
        /**
         * This function reports an expected null value.
         *
         * @param {1 | 0} negated - An indicator if the expectation is negated.
         */
        private reportExpectedNull;
        /**
         * This function reports an actual numeric value.
         *
         * @param {number} numericValue - The value to be expected.
         */
        private reportActualValue;
        /**
         * This function reports an expected numeric value.
         *
         * @param {number} numericValue - The value to be expected
         * @param {1 | 0} negated - An indicator if the expectation is negated.
         */
        private reportExpectedValue;
        /**
         * This function reports an actual reference value.
         *
         * @param {number} referencePointer - The actual reference pointer.
         * @param {number} offset - The size of the reference in bytes.
         */
        private reportActualReference;
        /**
         * This function reports an expected reference value.
         *
         * @param {number} referencePointer - The expected reference pointer.
         * @param {number} offset - The size of the reference in bytes.
         * @param {1 | 0} negated - An indicator if the expectation is negated.
         */
        private reportExpectedReference;
        /**
         * This function reports an expected truthy value.
         *
         * @param {1 | 0} negated - An indicator if the expectation is negated.
         */
        private reportExpectedTruthy;
        /**
         * This function reports an expected falsy value.
         *
         * @param {1 | 0} negated - An indicator if the expectation is negated.
         */
        private reportExpectedFalsy;
        /**
         * This function reports an expected finite value.
         *
         * @param {1 | 0} negated - An indicator if the expectation is negated.
         */
        private reportExpectedFinite;
        /**
         * This function reports an actual string value.
         *
         * @param {number} stringPointer - A pointer that points to the actual string.
         */
        private reportActualString;
        /**
         * This function reports an expected string value.
         *
         * @param {number} stringPointer - A pointer that points to the expected string.
         * @param {1 | 0} negated - An indicator if the expectation is negated.
         */
        private reportExpectedString;
        /**
         * This function overrides the provided AssemblyScript `env.abort()` function to catch abort
         * reasons.
         *
         * @param {number} reasonPointer - This points to the message value that causes the expectation to
         * fail.
         * @param {number} _fileNamePointer - The file name that reported the error. (Ignored)
         * @param {number} _line - The line that reported the error. (Ignored)
         * @param {number} _col - The column that reported the error. (Ignored)
         */
        private abort;
        /**
         * Reset all the performance values to the configured values.
         */
        private resetPerformanceValues;
        /**
         * This web assembly linked function modifies the state machine to enable
         * performance for the following test.
         *
         * @param {1 | 0} value - A value indicating if performance should be enabled.
         */
        private performanceEnabled;
        /**
         * This web assembly linked function modifies the state machine to set the maximum number of
         * samples for the following test.
         *
         * @param {number} value - The maximum number of samples to collect for the following test.
         */
        private maxSamples;
        /**
         * This web assembly linked function modifies the state machine to set the maximum amount of
         * time to run the following test in milliseconds
         *
         * @param {number} value - The maximum number of milliseconds to run the following test.
         */
        private maxTestRunTime;
        /**
         * This web assembly linked function modifies the state machine to set the number of decimal places
         * to round all the statistics to.
         *
         * @param {number} value - The number of decimal places to round to.
         */
        private roundDecimalPlaces;
        /**
         * This web assembly linked function modifies the state machine to cause the next test to report
         * an average run time.
         *
         * @param {1 | 0} value - A boolean indicating if the average should be reported.
         */
        private reportAverage;
        /**
         * This web assembly linked function modifies the state machine to cause the next test to report
         * an median run time.
         *
         * @param {1 | 0} value - A boolean indicating if the median should be reported.
         */
        private reportMedian;
        /**
         * This web assembly linked function modifies the state machine to cause the next test to report
         * a standard deviation calculation on the run times.
         *
         * @param {1 | 0} value - A boolean indicating if the standard deviation should be reported.
         */
        private reportStdDev;
        /**
         * This web assembly linked function modifies the state machine to cause the next test to report
         * the maximum run time for this test.
         *
         * @param {1 | 0} value - A boolean indicating if the max should be reported.
         */
        private reportMax;
        /**
         * This web assembly linked function modifies the state machine to cause the next test to report
         * the minimum run time for this test.
         *
         * @param {1 | 0} value - A boolean indicating if the min should be reported.
         */
        private reportMin;
        /**
         * This web assembly linked function modifies the state machine to cause the next test to report
         * the variance of the run times for this test.
         *
         * @param {1 | 0} value - A boolean indicating if the min should be reported.
         */
        private reportVariance;
        /**
         * This method reports to the TestContext that an expect function call was used outside of the
         * intended test functions.
         */
        private reportInvalidExpectCall;
    }
}
declare module "reporter/EmptyReporter" {
    import { TestReporter } from "test/TestReporter";
    export class EmptyReporter extends TestReporter {
        onFinish(): void;
        onGroupFinish(): void;
        onGroupStart(): void;
        onStart(): void;
        onTestFinish(): void;
        onTestStart(): void;
        onTodo(): void;
    }
}
declare module "reporter/SummaryTestReporter" {
    import { TestReporter } from "test/TestReporter";
    import { TestContext } from "test/TestContext";
    export class SummaryTestReporter extends TestReporter {
        onStart(): void;
        onGroupStart(): void;
        onGroupFinish(): void;
        onTestStart(): void;
        onTestFinish(): void;
        onTodo(): void;
        constructor();
        onFinish(suite: TestContext): void;
    }
}
declare module "util/IConfiguration" {
    import { TestReporter } from "test/TestReporter";
    import { IPerformanceConfiguration } from "util/IPerformanceConfiguration";
    export interface ICompilerFlags {
        [flag: string]: string[];
    }
    export interface IConfiguration {
        /**
         * A string of globs to find the files that will be included in the test suite.
         */
        include?: string[];
        /**
         * A set of globs passed to the glob package that quality files to be added to each test.
         */
        add?: string[];
        /**
         * All the compiler flags needed for this test suite. Make sure that a binary file is output.
         */
        flags?: ICompilerFlags;
        /**
         * And array of regular expressions that are tested against the file names. If they match, the
         * files will be discluded.
         */
        disclude?: RegExp[];
        /**
         * If the test module requires a set of imports to be loaded, it can be set here.
         */
        imports?: any;
        /**
         * Set the default performance measurement values.
         */
        performance?: IPerformanceConfiguration;
        /**
         * A custom reporter that extends the `TestReporter` class, and is responsible for generating log
         * output.
         */
        reporter?: TestReporter;
    }
}
declare module "cli/types" {
    export function types(assemblyFolder: string, testFolder: string, typesFile: string, typesFileSource: string): void;
}
declare module "cli/init" {
    export function init(assemblyFolder: string, testFolder: string, typesFile: string, typesFileSource: string): void;
}
declare module "cli/help" {
    export function help(): void;
}
declare module "cli/util/IYargs" {
    import yargsparser from "yargs-parser";
    export interface IYargs {
        argv: yargsparser.Arguments;
    }
}
declare module "cli/util/collectPerformanceConfiguration" {
    import { IYargs } from "cli/util/IYargs";
    import { IPerformanceConfiguration } from "util/IPerformanceConfiguration";
    export function collectPerformanceConfiguration(yargs: IYargs, performanceConfiguration: IPerformanceConfiguration): void;
}
declare module "cli/util/collectReporter" {
    import { TestReporter } from "test/TestReporter";
    import { IYargs } from "cli/util/IYargs";
    export function collectReporter(yargs: IYargs): TestReporter;
}
declare module "cli/util/getTestEntryFiles" {
    import { IYargs } from "cli/util/IYargs";
    export function getTestEntryFiles(yargs: IYargs, include: string[], disclude: RegExp[]): Set<string>;
}
declare module "cli/run" {
    import { IYargs } from "cli/util/IYargs";
    export function run(yargs: IYargs): void;
}
declare module "cli/index" {
    /**
     * This is the cli entry point and expects an array of arguments from the command line.
     *
     * @param {string[]} args - The arguments from the command line
     */
    export function asp(args: string[]): void;
}
declare module "as-pect" {
    export * from "test/TestContext";
    export * from "test/TestGroup";
    export * from "test/TestReporter";
    export * from "test/TestResult";
    export * from "reporter/DefaultTestReporter";
    export * from "reporter/EmptyReporter";
    export * from "reporter/SummaryTestReporter";
    export * from "util/ActualValue";
    export * from "util/IConfiguration";
    export * from "util/ILogTarget";
    export * from "util/LogValue";
    export * from "cli/index";
}
//# sourceMappingURL=as-pect.amd.d.ts.map
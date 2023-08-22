export declare function copyText(text: string): Promise<void>;
export declare function pasteText(): Promise<string>;
export declare function packagePath(cwd?: string): string;
export declare function forTestPath(...rest: string[]): string;
export declare function forExistsTestFile(...rest: string[]): string;
export declare function forExistsTestDir(...rest: string[]): string;

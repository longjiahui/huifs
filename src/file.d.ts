interface Descriptor {
    path: string;
    content: string;
    execRegExp?: RegExp;
    forceCreate?: boolean;
    forceReplace?: boolean;
}
export declare function validateDescriptors(ds: Descriptor[]): Promise<void>;
export declare function applyFileDescriptors(ds: Descriptor[]): Promise<void>;
export {};

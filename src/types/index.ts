/** Make a type nullable. */
export type Nullable<T> = T | null;

/** String-keyed dictionary. */
export type Dict<T = unknown> = Record<string, T>;

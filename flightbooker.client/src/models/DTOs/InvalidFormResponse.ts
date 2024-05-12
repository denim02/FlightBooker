export interface FormValidationResponse {
    isSuccessful: boolean,
    entries: { [key: string]: string } | null,
    errors: { [key: string]: string[] } | null
}
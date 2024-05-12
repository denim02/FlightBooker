import { TextField } from "@mui/material";
import { FormikTouched, FormikErrors, getIn } from "formik";

type ComplexTextFieldNamedProps<T> = {
    name: string,
    touched?: FormikTouched<T>,
    errors: FormikErrors<T>,
    [x: string]: unknown
}

const ComplexTextField = <T,>(props: ComplexTextFieldNamedProps<T>) => {
    const isTouched = props.touched ? getIn(props.touched, props.name) : true;
    const error = getIn(props.errors, props.name);
    const hasError = isTouched && Boolean(error);

    return (
        <TextField
            {...props}
            error={hasError}
            helperText={hasError ? error : undefined}
        />
    );
};

export default ComplexTextField;
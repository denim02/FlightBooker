import { Autocomplete, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import ComplexTextField from "./ComplexTextField";
import { FormikErrors, FormikTouched } from "formik";
import { LabeledObject } from "../../models/tables/LabeledObject";

type AsyncSelectProps<T> = {
    name: string,
    label: string,
    touched?: FormikTouched<T>,
    value?: number | string,
    errors?: FormikErrors<T>,
    handleChange: (newValue: string | number | null) => void,
    fetchOptions: () => Promise<LabeledObject[]>,
    className?: string,
    [x: string]: unknown
}

const AsyncSelect = <T,>({ name, label, touched, value, errors, handleChange, className, fetchOptions, ...rest }: AsyncSelectProps<T>) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<LabeledObject[]>([]);
    const loading = open && options.length === 0;

    useEffect(() => {
        let active = true;

        (async () => {
            const data = await fetchOptions();

            if (active) {
                setOptions(data);
            }
        })();

        return () => {
            active = false;
        };
    }, [fetchOptions]);

    return (
        <Autocomplete
            sx={{ width: 300 }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            value={value}
            getOptionLabel={(option) => options.find((o) => o.id === option)?.label || ""}
            onChange={(_: React.SyntheticEvent, newValue: string | number | null) => {
                handleChange(newValue);
            }}
            options={options.map((option) => option.id)}
            loading={loading}
            className={className || ""}
            renderInput={(params) => (
                <ComplexTextField
                    {...params}
                    {...rest}
                    name={name}
                    label={label}
                    touched={touched}
                    className="bg-white"
                    errors={errors ? errors : {}}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
};

export default AsyncSelect;
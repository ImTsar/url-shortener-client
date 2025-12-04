import * as Yup from "yup";

export const urlSchema = Yup.object().shape({
  originalUrl: Yup.string()
    .url("Invalid URL format")
    .required("URL is required"),
});
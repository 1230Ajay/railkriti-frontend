import * as Yup from "yup";

export const SignInDto = Yup.object({
    identifier:Yup.string().min(4).max(16).required("Please enter valid username , mobile or username"),
    password:Yup.string().min(6).max(20).required("Please enter password"),
    captcha:Yup.string().required("please enter captcha")
})
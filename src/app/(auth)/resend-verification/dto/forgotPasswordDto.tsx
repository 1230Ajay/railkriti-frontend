import * as Yup from "yup"

export const forgotPasswordDto = Yup.object({
    identifier:Yup.string().required().min(2).max(48)
})
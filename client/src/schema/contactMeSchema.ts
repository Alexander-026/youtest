import * as yup from "yup"



export const contactMeSchema = yup.object({
    fullName: yup.string().required("Заполните поле с именем"),
    email: yup.string().email("Email не валиден").required("Заполните поле с Email"),
    text: yup.string().required("Заполните поле с текстом")
}).required()